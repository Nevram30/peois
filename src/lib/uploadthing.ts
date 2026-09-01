"use client";

import { useCallback, useState } from "react";
import {
  UPLOAD_ENDPOINTS,
  type UploadEndpoint,
  type UploadedFile,
} from "./upload-endpoints";
import { formatBytes } from "./project-documents";

// ─── Upload client ────────────────────────────────────────────────────────
// Files are stored on the server's own disk (see src/app/api/upload/route.ts),
// not on UploadThing. This module keeps the old module path and the old export
// names — `uploadFiles` and `useUploadThing` — so every form that was written
// against the hosted service keeps working without a change.
//
// The result objects carry `url` and `ufsUrl` set to the same path, because
// call sites read one or the other.

const postFiles = async (
  endpoint: UploadEndpoint,
  files: File[],
): Promise<UploadedFile[]> => {
  const rule = UPLOAD_ENDPOINTS[endpoint];

  // Checked again — authoritatively — on the server. Doing it here too means
  // an oversized file fails instantly with a readable message instead of
  // after a slow upload that the proxy may cut off anyway.
  for (const file of files) {
    if (!rule.accept[file.type]) {
      throw new Error(`"${file.name}" is not an accepted file type.`);
    }
    const maxBytes = rule.maxBytes(file.type);
    if (file.size > maxBytes) {
      throw new Error(
        `"${file.name}" is ${formatBytes(file.size)} — the limit is ${formatBytes(maxBytes)}.`,
      );
    }
  }

  const body = new FormData();
  body.append("endpoint", endpoint);
  for (const file of files) body.append("file", file);

  const response = await fetch("/api/upload", { method: "POST", body });

  if (!response.ok) {
    const message = await response
      .json()
      .then((data: { error?: string }) => data.error)
      .catch(() => null);
    throw new Error(message ?? "Upload failed. Please try again.");
  }

  const data = (await response.json()) as { files: UploadedFile[] };
  return data.files;
};

/**
 * Uploads files to `endpoint` and resolves to their stored URLs.
 *
 * Signature matches the UploadThing helper it replaces:
 * `uploadFiles("imageUploader", { files: [file] })`.
 */
export const uploadFiles = (
  endpoint: UploadEndpoint,
  { files }: { files: File[] },
) => postFiles(endpoint, files);

/**
 * Hook form of {@link uploadFiles}, for the call sites that use
 * `const { startUpload } = useUploadThing("imageUploader")`.
 */
export const useUploadThing = (endpoint: UploadEndpoint) => {
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = useCallback(
    async (files: File[]): Promise<UploadedFile[] | undefined> => {
      setIsUploading(true);
      try {
        return await postFiles(endpoint, files);
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint],
  );

  return { startUpload, isUploading };
};
