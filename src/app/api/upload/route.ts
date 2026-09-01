import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { storeFile } from "~/server/storage";
import {
  UPLOAD_ENDPOINTS,
  isUploadEndpoint,
  uploadedFileUrl,
  type UploadedFile,
} from "~/lib/upload-endpoints";
import { formatBytes } from "~/lib/project-documents";

// Local-disk replacement for the UploadThing file router. The client helper in
// src/lib/uploadthing.ts posts here; the response shape matches what the forms
// already read, so no upload call site had to change.
//
// Streaming to disk would be nicer for large files, but Next's Web `Request`
// hands us a whole `File` anyway and the ceiling here is 16MB, so buffering is
// not worth the extra machinery.

export const runtime = "nodejs";
// Uploads must never be prerendered or cached.
export const dynamic = "force-dynamic";

const bad = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return bad("Unauthorized", 401);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    // Usually the reverse proxy cutting off an oversized body before we see it.
    return bad("Upload could not be read. The file may be too large.", 413);
  }

  const endpoint = formData.get("endpoint");
  if (typeof endpoint !== "string" || !isUploadEndpoint(endpoint)) {
    return bad("Unknown upload endpoint.");
  }
  const rule = UPLOAD_ENDPOINTS[endpoint];

  const files = formData.getAll("file").filter((f): f is File => f instanceof File);
  if (files.length === 0) return bad("No file provided.");
  if (files.length > rule.maxFileCount) {
    return bad(
      `Too many files — ${endpoint} accepts at most ${rule.maxFileCount}.`,
    );
  }

  // Validate every file before writing any of them, so a rejected second file
  // cannot leave the first one orphaned on disk.
  for (const file of files) {
    const extension = rule.accept[file.type];
    if (!extension) {
      return bad(
        `"${file.name}" is not an accepted file type. Allowed: JPG, PNG, WebP, PDF, DOC, DOCX.`,
      );
    }
    const maxBytes = rule.maxBytes(file.type);
    if (file.size > maxBytes) {
      return bad(
        `"${file.name}" is ${formatBytes(file.size)} — the limit is ${formatBytes(maxBytes)}.`,
      );
    }
    if (file.size === 0) return bad(`"${file.name}" is empty.`);
  }

  try {
    const stored: UploadedFile[] = [];
    for (const file of files) {
      const extension = rule.accept[file.type]!;
      const key = await storeFile(await file.arrayBuffer(), extension);
      const url = uploadedFileUrl(key);
      stored.push({
        url,
        // Same value under both names — see UploadedFile.
        ufsUrl: url,
        key,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
    return NextResponse.json({ files: stored });
  } catch (error) {
    // Almost always a permissions problem on UPLOAD_DIR, which is invisible
    // from the browser — log it so it is findable in the service log.
    console.error("[upload] failed to write file", error);
    return bad("Could not save the file on the server.", 500);
  }
}
