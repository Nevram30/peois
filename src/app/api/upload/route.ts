import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "~/server/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN_ASSISTANT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Only PDF, JPEG, PNG, and WebP are allowed." },
      { status: 400 },
    );
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10MB." },
      { status: 400 },
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
  await mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueName = `${timestamp}-${sanitized}`;
  const filePath = path.join(uploadDir, uniqueName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return NextResponse.json({
    filePath: `/uploads/documents/${uniqueName}`,
    fileName: file.name,
    fileSize: file.size,
  });
}
