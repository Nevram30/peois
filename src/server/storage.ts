import "server-only";

import { randomUUID } from "crypto";
import { mkdir, stat, writeFile } from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import { env } from "~/env";

// ─── Local file storage ───────────────────────────────────────────────────
// Uploads live on the server's own disk, outside the application folder, so a
// redeploy cannot delete them and nothing leaves the building. `UPLOAD_DIR`
// points at that folder (e.g. D:\peois-data\uploads).
//
// Files are NOT written under `public/`: Next serves everything there with no
// authentication at all, and these are official project documents. They are
// read back through /api/files/[...path], which checks the session first.

/** Absolute path of the storage root, resolved once. */
export const uploadRoot = () => path.resolve(process.cwd(), env.UPLOAD_DIR);

/**
 * Stores one file and returns its storage key — a relative POSIX path like
 * `2026/09/3f2a....jpg`.
 *
 * Files are foldered by year and month. A single flat directory holding tens
 * of thousands of files is slow to list, slow to back up, and awkward to
 * browse on NTFS; this keeps each folder to roughly a month of uploads.
 *
 * The name on disk is a random UUID plus an extension derived from the
 * caller-validated MIME type. The original file name never touches the path.
 */
export const storeFile = async (
  bytes: ArrayBuffer,
  extension: string,
): Promise<string> => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const dir = path.join(uploadRoot(), year, month);
  await mkdir(dir, { recursive: true });

  const fileName = `${randomUUID()}${extension}`;
  await writeFile(path.join(dir, fileName), Buffer.from(bytes));

  // POSIX separators: this becomes part of a URL, not a filesystem path.
  return `${year}/${month}/${fileName}`;
};

/**
 * Resolves a storage key to an absolute path, or null if it escapes the
 * storage root.
 *
 * The key arrives from the URL, so it is untrusted.
 *
 * Two layers, because either alone leaves a gap:
 *
 * 1. A whitelist on each segment. Real keys only ever look like `2026`, `09`,
 *    or `<uuid>.jpg`, so anything else is rejected outright. This matters
 *    because separators are platform-dependent — `a\..\..\b` is one harmless
 *    filename on the Linux/macOS dev machines and a traversal on the Windows
 *    server, and `C:` only means a drive there. Filtering here makes both
 *    platforms behave identically, so a dev-machine test result is meaningful.
 * 2. Resolve, then confirm the result is still under the root. Catches
 *    anything the whitelist did not anticipate.
 */
const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export const resolveStoredFile = (segments: string[]): string | null => {
  if (segments.length === 0) return null;
  // Rejects "", ".", "..", separators, drive letters, NUL, and anything with
  // a leading dot — no legitimate key contains them.
  if (segments.some((s) => !SAFE_SEGMENT.test(s) || s.includes(".."))) {
    return null;
  }

  const root = uploadRoot();
  const resolved = path.resolve(root, ...segments);
  const relative = path.relative(root, resolved);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return resolved;
};

/** Opens a stored file for streaming, or returns null if it is not a file. */
export const readStoredFile = async (absolutePath: string) => {
  try {
    const stats = await stat(absolutePath);
    if (!stats.isFile()) return null;
    return { stream: createReadStream(absolutePath), size: stats.size };
  } catch {
    return null;
  }
};

/** Best-effort content type for a stored file, from its extension. */
export const contentTypeFor = (fileName: string) => {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};
