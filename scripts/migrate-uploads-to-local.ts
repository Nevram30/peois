/**
 * One-off migration: pull every file still hosted on UploadThing down into
 * UPLOAD_DIR and rewrite the database column to the local `/api/files/...`
 * path.
 *
 * Run it WHILE THE SERVER STILL HAS INTERNET, and take a pg_dump first:
 *
 *   pg_dump -U peois_app -F c peois > backup-before-upload-migration.dump
 *   npm run migrate:uploads              # add --dry-run to preview
 *
 * Idempotent: anything already stored locally is skipped, so a re-run after a
 * partial failure only picks up what is left.
 */

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR ?? "./uploads");
const DRY_RUN = process.argv.includes("--dry-run");

const CLOUD_HOST = /^https:\/\/([a-z0-9-]+\.)?(ufs\.sh|utfs\.io)\//i;

const isCloudUrl = (value: string | null | undefined): value is string =>
  !!value && CLOUD_HOST.test(value);

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/heic": ".heic",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

const stats = { downloaded: 0, skipped: 0, failed: 0 };
// One cloud URL can appear in several columns (Project.imageUrl mirrors
// imageUrls[0]); download it once and reuse the local path.
const seen = new Map<string, string>();

/** Downloads one cloud URL and returns the local `/api/files/...` path. */
async function fetchToLocal(url: string): Promise<string | null> {
  const cached = seen.get(url);
  if (cached) return cached;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  ✗ ${response.status} ${response.statusText} — ${url}`);
      stats.failed++;
      return null;
    }

    const contentType = (response.headers.get("content-type") ?? "")
      .split(";")[0]!
      .trim()
      .toLowerCase();
    const extension =
      EXTENSION_BY_TYPE[contentType] ??
      // Fall back to whatever the URL ends in; UploadThing keys often have none.
      (path.extname(new URL(url).pathname) || ".bin");

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const key = `${year}/${month}/${randomUUID()}${extension}`;

    if (!DRY_RUN) {
      await mkdir(path.join(UPLOAD_ROOT, year, month), { recursive: true });
      await writeFile(
        path.join(UPLOAD_ROOT, year, month, path.basename(key)),
        Buffer.from(await response.arrayBuffer()),
      );
    }

    const localPath = `/api/files/${key}`;
    seen.set(url, localPath);
    stats.downloaded++;
    console.log(`  ✓ ${url}\n    → ${localPath}`);
    return localPath;
  } catch (error) {
    console.error(`  ✗ ${url} — ${String(error)}`);
    stats.failed++;
    return null;
  }
}

/** Migrates one single-URL column on one table. */
async function migrateColumn<T extends { id: string }>(
  label: string,
  rows: T[],
  read: (row: T) => string | null,
  write: (id: string, value: string) => Promise<unknown>,
) {
  console.log(`\n${label} — ${rows.length} row(s) to check`);
  for (const row of rows) {
    const current = read(row);
    if (!isCloudUrl(current)) {
      stats.skipped++;
      continue;
    }
    const local = await fetchToLocal(current);
    if (!local) continue;
    if (!DRY_RUN) await write(row.id, local);
  }
}

async function main() {
  console.log(
    `Migrating UploadThing files into ${UPLOAD_ROOT}${DRY_RUN ? " (dry run — nothing written)" : ""}\n`,
  );

  // ── Project.imageUrl and Project.imageUrls[] ────────────────────────────
  const projects = await prisma.project.findMany({
    select: { id: true, imageUrl: true, imageUrls: true },
  });
  console.log(`\nProject.imageUrl / imageUrls — ${projects.length} row(s) to check`);
  for (const project of projects) {
    const hasCloud =
      isCloudUrl(project.imageUrl) || project.imageUrls.some(isCloudUrl);
    if (!hasCloud) {
      stats.skipped++;
      continue;
    }

    const imageUrls: string[] = [];
    for (const url of project.imageUrls) {
      imageUrls.push(isCloudUrl(url) ? ((await fetchToLocal(url)) ?? url) : url);
    }

    const imageUrl = isCloudUrl(project.imageUrl)
      ? ((await fetchToLocal(project.imageUrl)) ?? project.imageUrl)
      : project.imageUrl;

    if (!DRY_RUN) {
      await prisma.project.update({
        where: { id: project.id },
        data: { imageUrl, imageUrls },
      });
    }
  }

  // ── User.image ──────────────────────────────────────────────────────────
  await migrateColumn(
    "User.image",
    await prisma.user.findMany({ select: { id: true, image: true } }),
    (row) => row.image,
    (id, image) => prisma.user.update({ where: { id }, data: { image } }),
  );

  // ── Document.filePath ───────────────────────────────────────────────────
  await migrateColumn(
    "Document.filePath",
    await prisma.document.findMany({ select: { id: true, filePath: true } }),
    (row) => row.filePath,
    (id, filePath) =>
      prisma.document.update({ where: { id }, data: { filePath } }),
  );

  // ── ProjectFile.fileUrl ─────────────────────────────────────────────────
  await migrateColumn(
    "ProjectFile.fileUrl",
    await prisma.projectFile.findMany({ select: { id: true, fileUrl: true } }),
    (row) => row.fileUrl,
    (id, fileUrl) =>
      prisma.projectFile.update({ where: { id }, data: { fileUrl } }),
  );

  // ── TaskReplyDocument.fileUrl ───────────────────────────────────────────
  await migrateColumn(
    "TaskReplyDocument.fileUrl",
    await prisma.taskReplyDocument.findMany({
      select: { id: true, fileUrl: true },
    }),
    (row) => row.fileUrl,
    (id, fileUrl) =>
      prisma.taskReplyDocument.update({ where: { id }, data: { fileUrl } }),
  );

  console.log(
    `\nDone. downloaded=${stats.downloaded} skipped=${stats.skipped} failed=${stats.failed}`,
  );
  if (stats.failed > 0) {
    console.error(
      "\nSome files could not be downloaded. Re-run once the cause is fixed — " +
        "already-migrated rows are skipped.",
    );
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
