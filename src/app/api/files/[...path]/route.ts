import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "~/server/auth";
import { TYPE_BY_EXTENSION } from "~/lib/upload-endpoints";
import { resolveStoredPath } from "~/server/upload-storage";

/**
 * Serves files out of UPLOAD_DIR behind the same session check as the rest of
 * the app.
 *
 * Deliberately *not* served by writing into `public/`: Next serves everything
 * under `public/` with no authentication at all, so anyone who learned or
 * guessed a URL could read an official project document.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path: segments } = await params;
  const absolute = resolveStoredPath(segments);
  if (!absolute) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let fileStat;
  try {
    fileStat = await stat(absolute);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!fileStat.isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contentType =
    TYPE_BY_EXTENSION[path.extname(absolute).toLowerCase()] ??
    "application/octet-stream";

  const headers = new Headers({
    "Content-Type": contentType,
    // Stored files are immutable — the name carries a UUID, so a changed file
    // is a different URL. `private` keeps shared proxies out of it.
    "Cache-Control": "private, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "Last-Modified": fileStat.mtime.toUTCString(),
    "Content-Disposition": "inline",
    // Never let a stored file be interpreted as something else.
    "X-Content-Type-Options": "nosniff",
  });

  // Browsers' built-in PDF viewer asks for byte ranges on large documents;
  // without this a 16MB scan can stall or fail to open.
  const range = request.headers.get("range");
  const match = /^bytes=(\d*)-(\d*)$/.exec(range ?? "");
  if (match) {
    const [, rawStart, rawEnd] = match;
    const start = rawStart ? Number(rawStart) : 0;
    const end = rawEnd ? Number(rawEnd) : fileStat.size - 1;

    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      start > end ||
      start >= fileStat.size
    ) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${fileStat.size}` },
      });
    }

    const last = Math.min(end, fileStat.size - 1);
    headers.set("Content-Range", `bytes ${start}-${last}/${fileStat.size}`);
    headers.set("Content-Length", String(last - start + 1));

    const partial = Readable.toWeb(
      createReadStream(absolute, { start, end: last }),
    ) as ReadableStream<Uint8Array>;
    return new NextResponse(partial, { status: 206, headers });
  }

  headers.set("Content-Length", String(fileStat.size));
  const stream = Readable.toWeb(
    createReadStream(absolute),
  ) as ReadableStream<Uint8Array>;
  return new NextResponse(stream, { status: 200, headers });
}
