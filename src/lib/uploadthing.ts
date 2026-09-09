"use client";

import { useCallback, useState } from "react";

import type { UploadEndpoint } from "./upload-endpoints";

/**
 * Upload helpers, backed by local disk storage (`/api/upload`).
 *
 * The file name and both export names are unchanged from the UploadThing
 * version on purpose: the nine call sites across eight components read
 * `.url`, `.ufsUrl` and `.name` off the result and need no edits.
 */

export type UploadedFile = {
  /** Relative path, e.g. `/api/files/2026/09/<uuid>.jpg`. */
  url: string;
  /** Same value as `url` — kept because some call sites read this name. */
  ufsUrl: string;
  name: string;
  size: number;
  type: string;
  key: string;
};

type UploadResponse = { files?: UploadedFile[]; error?: string };

/**
 * Uploads files and resolves to one entry per file, in the order given.
 * Rejects with a readable message when the server refuses the upload.
 */
export async function uploadFiles(
  endpoint: UploadEndpoint,
  { files, signal }: { files: File[]; signal?: AbortSignal },
): Promise<UploadedFile[]> {
  const body = new FormData();
  body.append("endpoint", endpoint);
  for (const file of files) body.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body,
    signal,
  });

  let payload: UploadResponse = {};
  try {
    payload = (await response.json()) as UploadResponse;
  } catch {
    // Fall through to the generic message below.
  }

  if (!response.ok || !payload.files) {
    throw new Error(payload.error ?? "Upload failed. Please try again.");
  }
  return payload.files;
}

/**
 * Hook form of the same call. `startUpload` resolves to `undefined` on
 * failure rather than throwing — matching the `if (uploaded)` guard the task
 * reply and project forms already use — and exposes the message via `error`.
 */
export function useUploadThing(endpoint: UploadEndpoint) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startUpload = useCallback(
    async (files: File[]): Promise<UploadedFile[] | undefined> => {
      if (files.length === 0) return [];
      setIsUploading(true);
      setError(null);
      try {
        return await uploadFiles(endpoint, { files });
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Upload failed. Please try again.",
        );
        return undefined;
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint],
  );

  return { startUpload, isUploading, error };
}
