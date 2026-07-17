import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024;

function isUploadBlob(value: FormDataEntryValue): value is Blob {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Blob).arrayBuffer === "function" &&
    typeof (value as Blob).size === "number" &&
    (value as Blob).size > 0
  );
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage is not configured" },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !isUploadBlob(file)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 4 MB after compression)" },
        { status: 413 },
      );
    }

    const fileName =
      "name" in file && typeof file.name === "string" && file.name
        ? file.name
        : "photo.jpg";
    const safeName = fileName.replace(/[^\w.\-]+/g, "_") || "photo.jpg";
    const contentType =
      file.type && file.type !== "application/octet-stream"
        ? file.type
        : "image/jpeg";

    // Store is configured as private in Vercel — public access throws.
    const bytes = Buffer.from(await file.arrayBuffer());
    const blob = await put(`leads/${Date.now()}-${safeName}`, bytes, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    });
  } catch (err) {
    console.error("Lead photo upload failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
