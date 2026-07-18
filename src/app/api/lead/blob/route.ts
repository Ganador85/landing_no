import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getPayload } from "@/lib/payload";
import {
  parseLeadPhotoUrls,
  verifyLeadPhotoToken,
} from "@/lib/lead-photo-token";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob storage is not configured" },
        { status: 503 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");
    const raw = searchParams.get("url");
    const download = searchParams.get("download") === "1";

    if (!id || !token || !raw) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    if (!verifyLeadPhotoToken(id, token)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }

    if (!parsed.hostname.endsWith(".blob.vercel-storage.com")) {
      return NextResponse.json({ error: "Invalid host" }, { status: 400 });
    }

    const cleanUrl = `${parsed.origin}${parsed.pathname}`;

    const payload = await getPayload();
    const lead = await payload.findByID({
      collection: "leads",
      id,
      overrideAccess: true,
    });

    if (!lead) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const allowed = parseLeadPhotoUrls(lead.photoUrls);
    const allowedClean = new Set(
      allowed.map((u) => {
        try {
          const p = new URL(u);
          return `${p.origin}${p.pathname}`;
        } catch {
          return u;
        }
      }),
    );

    if (!allowedClean.has(cleanUrl)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await get(cleanUrl, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType = result.blob.contentType || "application/octet-stream";
    const ext =
      contentType.includes("png")
        ? "png"
        : contentType.includes("webp")
          ? "webp"
          : contentType.includes("gif")
            ? "gif"
            : "jpg";
    const filename = `takfornyelse-lead-${id}.${ext}`;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(result.stream, { headers });
  } catch (err) {
    console.error("Lead blob proxy failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
