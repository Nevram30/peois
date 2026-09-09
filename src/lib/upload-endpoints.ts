/**
 * Upload endpoint contract — shared by the client helpers in
 * `~/lib/uploadthing` and the server route at `/api/upload`.
 *
 * These four endpoint names and their limits mirror what the UploadThing file
 * router (`src/app/api/uploadthing/core.ts`) enforced, so the switch to local
 * disk storage is invisible to the eight components that upload files.
 */

export type UploadEndpoint =
  | "imageUploader"
  | "documentUploader"
  | "taskReplyUploader"
  | "projectFileUploader";

const MB = 1024 * 1024;

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
] as const;

export const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export type EndpointConfig = {
  /** MIME types the endpoint accepts. */
  accept: readonly string[];
  /** Per-file ceiling, by category. Images and documents differ. */
  maxImageBytes: number;
  maxDocumentBytes: number;
  /** How many files one request may carry. */
  maxFileCount: number;
};

const IMAGE_ONLY = {
  accept: IMAGE_TYPES,
  maxImageBytes: 8 * MB,
  maxDocumentBytes: 0,
} as const;

const DOCS_AND_IMAGES = {
  accept: [...IMAGE_TYPES, ...DOCUMENT_TYPES],
  maxImageBytes: 8 * MB,
  maxDocumentBytes: 16 * MB,
} as const;

export const UPLOAD_ENDPOINTS: Record<UploadEndpoint, EndpointConfig> = {
  imageUploader: { ...IMAGE_ONLY, maxFileCount: 1 },
  documentUploader: {
    accept: DOCUMENT_TYPES,
    maxImageBytes: 0,
    maxDocumentBytes: 16 * MB,
    maxFileCount: 1,
  },
  taskReplyUploader: { ...DOCS_AND_IMAGES, maxFileCount: 5 },
  projectFileUploader: { ...DOCS_AND_IMAGES, maxFileCount: 1 },
};

export const isUploadEndpoint = (value: unknown): value is UploadEndpoint =>
  typeof value === "string" && value in UPLOAD_ENDPOINTS;

export const maxBytesForType = (config: EndpointConfig, mimeType: string) =>
  mimeType.startsWith("image/")
    ? config.maxImageBytes
    : config.maxDocumentBytes;

/**
 * The extension a stored file gets. Derived from the *validated* MIME type —
 * never from the uploader's file name, which is attacker-controlled and is the
 * path-traversal surface. The original name is kept in the database instead
 * (`Document.fileName`, `TaskReplyDocument.fileName`, `ProjectFile.fileName`).
 */
export const EXTENSION_BY_TYPE: Record<string, string> = {
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

/** Reverse map, for serving a stored file with the right `Content-Type`. */
export const TYPE_BY_EXTENSION: Record<string, string> = Object.fromEntries(
  Object.entries(EXTENSION_BY_TYPE).map(([type, ext]) => [ext, type]),
);

/** Where a stored file is read back from. Kept in one place so the client
 *  helpers, the migration script, and `next/image` checks agree. */
export const LOCAL_FILE_PREFIX = "/api/files/";

/**
 * next/image's optimizer fetches same-origin paths through an internal mocked
 * request that carries no headers — and therefore no session cookie — so an
 * auth-gated `/api/files` URL comes back 401 and the photo silently falls back
 * to the placeholder. Images served from here must be rendered `unoptimized`
 * so the browser fetches them directly, with the cookie attached.
 */
export const isLocalUpload = (url?: string | null) =>
  !!url?.startsWith(LOCAL_FILE_PREFIX);
