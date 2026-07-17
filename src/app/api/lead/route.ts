import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getPayload } from "@/lib/payload";
import { siteConfig } from "@/lib/site";

const inquiryTypes = [
  "takvask",
  "impregnering",
  "takmaling",
  "nytt_tak",
  "usikker",
] as const;

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(5).max(40),
  postal: z.string().min(3).max(12),
  type: z.enum(inquiryTypes),
  locale: z.enum(["no", "en"]),
  email: z.string().email().max(200).optional(),
  address: z.string().max(200).optional(),
  roofSize: z.string().max(20).optional(),
  message: z.string().max(5000).optional(),
});

const rateMap = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

async function uploadPhotos(files: File[]): Promise<string[]> {
  if (!files.length || !process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { put } = await import("@vercel/blob");
    const urls: string[] = [];
    for (const file of files.slice(0, 5)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 8_000_000) continue;
      const blob = await put(`leads/${Date.now()}-${file.name}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      urls.push(blob.url);
    }
    return urls;
  } catch (err) {
    console.error("Lead photo upload failed:", err);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const contentType = request.headers.get("content-type") || "";
    let raw: Record<string, unknown> = {};
    let photoFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      raw = {
        name: form.get("name"),
        phone: form.get("phone"),
        postal: form.get("postal"),
        type: form.get("type"),
        locale: form.get("locale"),
        email: form.get("email") || undefined,
        address: form.get("address") || undefined,
        roofSize: form.get("roofSize") || undefined,
        message: form.get("message") || undefined,
      };
      photoFiles = form.getAll("photos").filter((f): f is File => f instanceof File);
    } else {
      const body = await request.json();
      const {
        website: _website,
        company_url_hp: _hp,
        ...safeBody
      } = body as Record<string, unknown>;
      void _website;
      void _hp;
      raw = safeBody;
    }

    const parsed = leadSchema.safeParse({
      ...raw,
      email: raw.email || undefined,
      address: raw.address || undefined,
      roofSize: raw.roofSize || undefined,
      message: raw.message || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { phone, type, locale, message, email, address, roofSize, ...rest } =
      parsed.data;

    const photoUrls = await uploadPhotos(photoFiles);
    const approxSqm = roofSize ? Number(roofSize) : undefined;

    const payload = await getPayload();
    const created = await payload.create({
      collection: "leads",
      data: {
        name: rest.name,
        postal: rest.postal,
        phone,
        inquiryType: type,
        language: locale,
        message: message || "",
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
        ...(approxSqm && Number.isFinite(approxSqm) ? { approxSqm } : {}),
        ...(photoUrls.length ? { photoUrls: photoUrls.join("\n") } : {}),
        status: "new",
      },
      overrideAccess: true,
    });

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.LEAD_FROM_EMAIL || "leads@takfornyelse.as",
          to: process.env.LEAD_TO_EMAIL || siteConfig.email,
          subject: `Ny henvendelse: ${rest.name} (${type})`,
          text: [
            `Navn: ${rest.name}`,
            `Telefon: ${phone}`,
            `Postnummer: ${rest.postal}`,
            email ? `E-post: ${email}` : null,
            address ? `Adresse: ${address}` : null,
            approxSqm ? `Ca. m²: ${approxSqm}` : null,
            `Type: ${type}`,
            `Språk: ${locale}`,
            photoUrls.length ? `Bilder:\n${photoUrls.join("\n")}` : null,
            "",
            message || "",
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (err) {
        console.error("Lead email failed:", err);
      }
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("Lead create failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
