/**
 * One-off migration: pull every file still hosted on UploadThing down into
 * UPLOAD_DIR and rewrite the database columns to the local /api/files path.
 *
 *   npm run uploads:migrate -- --dry-run   # report only, downloads nothing
 *   npm run uploads:migrate                # download + rewrite
 *
 * Run it on the server WHILE IT STILL HAS INTERNET, and take a pg_dump first.
 * It is idempotent: anything already pointing at /api/files is skipped, so it
 * is safe to re-run after a partial failure.
 *
 * The office cannot go fully offline until this reports 0 remaining.
 *
 * The npm script passes `--conditions=react-server` because this reuses
 * src/server/storage.ts, which is marked `server-only`; without that condition
 * the guard module throws on import outside Next.
 */

import { extname } from "path";
import { PrismaClient } from "../generated/prisma";
import { storeFile } from "~/server/storage";
import { uploadedFileUrl } from "~/lib/upload-endpoints";

const db = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

const isCloudUrl = (url: string) =>
  /^https?:\/\/([^/]*\.)?(ufs\.sh|utfs\.io)\//i.test(url);

// UploadThing URLs carry no extension; fall back to the content type.
const extensionFor = (url: string, contentType: string | null) => {
  const fromUrl = extname(new URL(url).pathname);
  if (fromUrl) return fromUrl;
  switch (contentType?.split(";")[0]?.trim()) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "application/pdf":
      return ".pdf";
    case "application/msword":
      return ".doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";
    default:
      return ".bin";
  }
};

let downloaded = 0;
let failed = 0;
const cache = new Map<string, string>();

/** Downloads one cloud URL and returns its new local path (memoised). */
const localise = async (url: string): Promise<string | null> => {
  if (!isCloudUrl(url)) return null; // already local, or something unexpected
  const cached = cache.get(url);
  if (cached) return cached;
  if (dryRun) {
    downloaded += 1;
    return null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = await response.arrayBuffer();
    const key = await storeFile(
      bytes,
      extensionFor(url, response.headers.get("content-type")),
    );
    const local = uploadedFileUrl(key);
    cache.set(url, local);
    downloaded += 1;
    return local;
  } catch (error) {
    // Keep going: one dead URL should not strand the rest of the migration.
    // Re-running the script will retry whatever failed here.
    console.error(`  ! could not fetch ${url}: ${String(error)}`);
    failed += 1;
    return null;
  }
};

/** Migrates a single nullable string column on one model. */
const migrateColumn = async (
  label: string,
  rows: { id: string; value: string | null }[],
  update: (id: string, value: string) => Promise<unknown>,
) => {
  const pending = rows.filter((r) => r.value && isCloudUrl(r.value));
  console.log(`${label}: ${pending.length} cloud URL(s)`);

  for (const row of pending) {
    const local = await localise(row.value!);
    if (local && !dryRun) await update(row.id, local);
  }
};

async function main() {
  console.log(
    dryRun
      ? "DRY RUN — counting cloud URLs, nothing will be downloaded or written.\n"
      : "Migrating UploadThing files to local disk...\n",
  );

  // ── Project.imageUrl ────────────────────────────────────────────────────
  await migrateColumn(
    "Project.imageUrl",
    (
      await db.project.findMany({ select: { id: true, imageUrl: true } })
    ).map((p) => ({ id: p.id, value: p.imageUrl })),
    (id, imageUrl) => db.project.update({ where: { id }, data: { imageUrl } }),
  );

  // ── Project.documentUrl ─────────────────────────────────────────────────
  await migrateColumn(
    "Project.documentUrl",
    (
      await db.project.findMany({ select: { id: true, documentUrl: true } })
    ).map((p) => ({ id: p.id, value: p.documentUrl })),
    (id, documentUrl) =>
      db.project.update({ where: { id }, data: { documentUrl } }),
  );

  // ── Project.imageUrls[] ─────────────────────────────────────────────────
  // An array column, so it needs the whole list rebuilt rather than one value.
  const galleries = await db.project.findMany({
    select: { id: true, imageUrls: true },
  });
  const withCloudImages = galleries.filter((p) =>
    p.imageUrls.some(isCloudUrl),
  );
  console.log(`Project.imageUrls: ${withCloudImages.length} project(s)`);
  for (const project of withCloudImages) {
    const next: string[] = [];
    for (const url of project.imageUrls) {
      // A failed download keeps the original URL so the slot is not blanked.
      next.push((isCloudUrl(url) ? await localise(url) : null) ?? url);
    }
    if (!dryRun) {
      await db.project.update({
        where: { id: project.id },
        data: { imageUrls: next },
      });
    }
  }

  // ── User.image ──────────────────────────────────────────────────────────
  await migrateColumn(
    "User.image",
    (await db.user.findMany({ select: { id: true, image: true } })).map((u) => ({
      id: u.id,
      value: u.image,
    })),
    (id, image) => db.user.update({ where: { id }, data: { image } }),
  );

  // ── Document.filePath ───────────────────────────────────────────────────
  await migrateColumn(
    "Document.filePath",
    (
      await db.document.findMany({ select: { id: true, filePath: true } })
    ).map((d) => ({ id: d.id, value: d.filePath })),
    (id, filePath) => db.document.update({ where: { id }, data: { filePath } }),
  );

  // ── ProjectFile.fileUrl ─────────────────────────────────────────────────
  await migrateColumn(
    "ProjectFile.fileUrl",
    (
      await db.projectFile.findMany({ select: { id: true, fileUrl: true } })
    ).map((f) => ({ id: f.id, value: f.fileUrl })),
    (id, fileUrl) => db.projectFile.update({ where: { id }, data: { fileUrl } }),
  );

  // ── TaskReplyDocument.fileUrl ───────────────────────────────────────────
  await migrateColumn(
    "TaskReplyDocument.fileUrl",
    (
      await db.taskReplyDocument.findMany({
        select: { id: true, fileUrl: true },
      })
    ).map((f) => ({ id: f.id, value: f.fileUrl })),
    (id, fileUrl) =>
      db.taskReplyDocument.update({ where: { id }, data: { fileUrl } }),
  );

  console.log(
    dryRun
      ? `\n${downloaded} file(s) would be downloaded.`
      : `\nDone. ${downloaded} file(s) downloaded, ${failed} failed.`,
  );
  if (failed > 0) {
    console.log("Re-run the script to retry the failures.");
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
