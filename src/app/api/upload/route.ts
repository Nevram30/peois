import { type NextRequest, NextResponse } from "next/server";

import { auth } from "~/server/auth";
import {
  UPLOAD_ENDPOINTS,
  isUploadEndpoint,
} from "~/lib/upload-endpoints";
import { UploadError, storeFile } from "~/server/upload-storage";

/**
 * Local replacement for the UploadThing upload flow.
 *
 * Takes `endpoint` plus one or more `file` entries as multipart form data and
 * answers in the shape the client helpers in `~/lib/uploadthing` expect, so
 * every existing upload call site keeps working unchanged.
 */

export const runtime = "nodejs";
// Uploads must never be prerendered or cached.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Malformed upload request." },
      { status: 400 },
    );
  }

  const endpoint = formData.get("endpoint");
  if (!isUploadEndpoint(endpoint)) {
    return NextResponse.json(
      { error: "Unknown upload endpoint." },
      { status: 400 },
    );
  }

  const config = UPLOAD_ENDPOINTS[endpoint];
  const files = formData
    .getAll("file")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (files.length > config.maxFileCount) {
    return NextResponse.json(
      {
        error: `Too many files — ${endpoint} accepts at most ${config.maxFileCount}.`,
      },
      { status: 400 },
    );
  }

  try {
    // Sequential rather than parallel: these are 8-16MB writes to one disk, and
    // a failure part-way leaves fewer orphans to think about.
    const stored = [];
    for (const file of files) {
      stored.push(await storeFile(file, config));
    }

    return NextResponse.json({
      files: stored.map((file) => ({
        // `url` and `ufsUrl` are the same value: consumers read one or the
        // other depending on when they were written.
        url: file.url,
        ufsUrl: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
      })),
    });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("[api/upload] failed to store upload", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
