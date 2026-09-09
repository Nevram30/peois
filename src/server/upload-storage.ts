import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { env } from "~/env";
import {
  EXTENSION_BY_TYPE,
  LOCAL_FILE_PREFIX,
  type EndpointConfig,
  maxBytesForType,
} from "~/lib/upload-endpoints";

/**
 * Local file storage. Uploads live outside the application folder (see
 * UPLOAD_DIR) so a redeploy — `git pull`, a rebuild, even delete-and-reclone —
 * can never destroy office data.
 */
export const UPLOAD_ROOT = path.resolve(env.UPLOAD_DIR);

// The default is a convenience for developer machines. On the server it would
// put official documents inside the app folder, where a redeploy erases them.
if (env.NODE_ENV === "production" && !process.env.UPLOAD_DIR) {
  console.warn(
    `[upload-storage] UPLOAD_DIR is not set; storing uploads in ${UPLOAD_ROOT}. ` +
      `Set UPLOAD_DIR to a path outside the application folder (e.g. D:\\peois-data\\uploads).`,
  );
}

/**
 * Magic-number check. A browser fills `File.type` from the file *extension*,
 * so a renamed `.exe` arrives claiming `application/pdf` and passes a MIME
 * check untouched. Reading the real signature is what actually rejects it.
 */
const SIGNATURES: { type: string; test: (b: Buffer) => boolean }[] = [
  { type: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    type: "image/png",
    test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  { type: "image/gif", test: (b) => b.subarray(0, 6).toString("latin1").startsWith("GIF8") },
  {
    type: "image/webp",
    test: (b) =>
      b.subarray(0, 4).toString("latin1") === "RIFF" &&
      b.subarray(8, 12).toString("latin1") === "WEBP",
  },
  {
    // HEIC and friends: an ISO base-media `ftyp` box with a HEIF brand.
    type: "image/heic",
    test: (b) =>
      b.subarray(4, 8).toString("latin1") === "ftyp" &&
      ["heic", "heix", "hevc", "mif1", "msf1"].includes(
        b.subarray(8, 12).toString("latin1"),
      ),
  },
  { type: "application/pdf", test: (b) => b.subarray(0, 4).toString("latin1") === "%PDF" },
  {
    // .docx is a zip container; .doc is an OLE2 compound file.
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    test: (b) => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07),
  },
  {
    type: "application/msword",
    test: (b) =>
      b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  },
];

const sniffType = (bytes: Buffer) =>
  SIGNATURES.find((sig) => sig.test(bytes))?.type ?? null;

/**
 * `.doc` and `.docx` are both Office documents but have unrelated container
 * formats, and Office writes `.docx` files that are plain zips — so the sniffed
 * type only has to be *compatible* with the declared one, not identical.
 */
const OFFICE_TYPES = new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const isCompatible = (declared: string, sniffed: string) =>
  declared === sniffed || (OFFICE_TYPES.has(declared) && OFFICE_TYPES.has(sniffed));

export type StoredFile = {
  /** Relative URL, e.g. `/api/files/2026/09/<uuid>.jpg`. */
  url: string;
  name: string;
  size: number;
  type: string;
  key: string;
};

export class UploadError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/**
 * Validates one upload and writes it under `UPLOAD_ROOT/<yyyy>/<mm>/`.
 *
 * Sub-foldering by year and month matters: a single flat directory with tens
 * of thousands of files is slow to browse and to back up on NTFS.
 */
export const storeFile = async (
  file: File,
  config: EndpointConfig,
): Promise<StoredFile> => {
  const declared = file.type;

  if (!config.accept.includes(declared)) {
    throw new UploadError(`"${file.name}" is not an accepted file type.`);
  }

  const limit = maxBytesForType(config, declared);
  if (file.size > limit) {
    throw new UploadError(
      `"${file.name}" is ${formatBytes(file.size)} — the limit is ${formatBytes(limit)}.`,
    );
  }
  if (file.size === 0) {
    throw new UploadError(`"${file.name}" is empty.`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const sniffed = sniffType(bytes.subarray(0, 16));
  if (!sniffed || !isCompatible(declared, sniffed)) {
    throw new UploadError(
      `"${file.name}" does not contain ${declared} data and was rejected.`,
    );
  }

  const extension = EXTENSION_BY_TYPE[declared];
  if (!extension) {
    throw new UploadError(`"${file.name}" is not an accepted file type.`);
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const key = `${year}/${month}/${randomUUID()}${extension}`;

  const destination = path.join(UPLOAD_ROOT, year, month);
  await mkdir(destination, { recursive: true });
  await writeFile(path.join(UPLOAD_ROOT, ...key.split("/")), bytes);

  return {
    url: `${LOCAL_FILE_PREFIX}${key}`,
    name: file.name,
    size: file.size,
    type: declared,
    key,
  };
};

/**
 * Resolves a `/api/files/...` path segment list to an absolute path, refusing
 * anything that escapes UPLOAD_ROOT. `path.relative` is the check that matters:
 * it catches `..` traversal, absolute segments, and symlink-free tricks alike.
 */
export const resolveStoredPath = (segments: string[]) => {
  if (segments.length === 0) return null;
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return null;
  }

  const absolute = path.resolve(UPLOAD_ROOT, ...segments);
  const relative = path.relative(UPLOAD_ROOT, absolute);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return absolute;
};
