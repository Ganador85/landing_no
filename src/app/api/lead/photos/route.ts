import { NextResponse } from "next/server";
import { z } from "zod";
import { getPayload } from "@/lib/payload";
import {
  makeLeadPhotoToken,
  parseLeadPhotoUrls,
  tokensMatch,
} from "@/lib/lead-photo-token";

const photosSchema = z.object({
  id: z.union([z.string(), z.number()]),
  token: z.string().min(16).max(128),
  photoUrls: z.array(z.string().url()).min(1).max(15),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = photosSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { id, token, photoUrls } = parsed.data;
    const expected = makeLeadPhotoToken(id);
    if (!tokensMatch(token, expected)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await getPayload();
    const existing = await payload.findByID({
      collection: "leads",
      id,
      overrideAccess: true,
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const previous = parseLeadPhotoUrls(existing.photoUrls);
    const merged = [...previous, ...photoUrls].slice(0, 15);

    await payload.update({
      collection: "leads",
      id,
      data: {
        photoUrls: merged.join("\n"),
      },
      overrideAccess: true,
    });

    return NextResponse.json({ ok: true, count: merged.length });
  } catch (err) {
    console.error("Lead photo attach failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
