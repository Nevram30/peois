// ─── Upload endpoints ─────────────────────────────────────────────────────
// One table describing what each upload surface accepts. It is imported by
// both the client helper (src/lib/uploadthing.ts) and the route handler
// (src/app/api/upload/route.ts), so the browser-side check and the
// authoritative server-side check can never drift apart.
//
// These mirror the limits the UploadThing file router used to enforce, so the
// move to local disk is invisible to the forms.

import { MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES } from "./project-documents";

/**
 * Accepted types, mapped to the extension the file is stored under.
 *
 * The extension is taken from here rather than from the uploaded file name:
 * the name is attacker-controlled, and it is only ever used as a display
 * label (persisted separately in `fileName` columns), never as a path.
 */
export const IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
} as const;

export const DOCUMENT_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
} as const;

export type UploadEndpoint =
  | "imageUploader"
  | "documentUploader"
  | "taskReplyUploader"
  | "projectFileUploader";

type EndpointRule = {
  /** Accepted MIME type → stored extension. */
  accept: Record<string, string>;
  /** Per-type byte ceiling; images are held to the tighter image limit. */
  maxBytes: (mime: string) => number;
  maxFileCount: number;
};

const imageAware = (mime: string) =>
  mime.startsWith("image/") ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;

export const UPLOAD_ENDPOINTS: Record<UploadEndpoint, EndpointRule> = {
  imageUploader: {
    accept: { ...IMAGE_TYPES },
    maxBytes: () => MAX_IMAGE_BYTES,
    maxFileCount: 1,
  },
  documentUploader: {
    accept: { ...DOCUMENT_TYPES },
    maxBytes: () => MAX_DOCUMENT_BYTES,
    maxFileCount: 1,
  },
  taskReplyUploader: {
    accept: { ...IMAGE_TYPES, ...DOCUMENT_TYPES },
    maxBytes: imageAware,
    maxFileCount: 5,
  },
  projectFileUploader: {
    accept: { ...IMAGE_TYPES, ...DOCUMENT_TYPES },
    maxBytes: imageAware,
    maxFileCount: 1,
  },
};

export const isUploadEndpoint = (value: string): value is UploadEndpoint =>
  Object.hasOwn(UPLOAD_ENDPOINTS, value);

/** Public path prefix that {@link uploadedFileUrl} builds on. */
export const FILE_ROUTE_PREFIX = "/api/files";

export const uploadedFileUrl = (storageKey: string) =>
  `${FILE_ROUTE_PREFIX}/${storageKey}`;

/**
 * The shape every upload resolves to. `url` and `ufsUrl` are the same value —
 * call sites read one or the other depending on when they were written, and
 * carrying both keeps them all working unchanged.
 */
export type UploadedFile = {
  url: string;
  ufsUrl: string;
  key: string;
  name: string;
  size: number;
  type: string;
};
