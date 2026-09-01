import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { contentTypeFor, readStoredFile, resolveStoredFile } from "~/server/storage";

// Serves files out of UPLOAD_DIR, behind the session check.
//
// This route is why uploads are not written into `public/`: anything under
// `public/` is served by Next with no authentication, so a leaked or guessed
// URL would hand out project documents to anyone. Here an expired session gets
// a 401 instead.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path: segments } = await params;
  const absolutePath = resolveStoredFile(segments);
  // A traversal attempt and a genuinely missing file both return 404 — a
  // distinct error for the former would confirm the storage layout.
  if (!absolutePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const file = await readStoredFile(absolutePath);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(file.stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": contentTypeFor(absolutePath),
      "Content-Length": String(file.size),
      // Stored names are random UUIDs and files are never overwritten, so the
      // content at a given URL is immutable. `private` keeps it out of any
      // shared proxy cache — these are access-controlled documents.
      "Cache-Control": "private, max-age=31536000, immutable",
      // Render images and PDFs inline; never let the browser treat an upload
      // as an HTML document in this origin.
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
