import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getPayload } from "@/lib/payload";
import { siteConfig } from "@/lib/site";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(5).max(40),
  postal: z.string().min(3).max(12),
  type: z.enum(["vedlikehold", "nytt_tak", "kledning"]),
  message: z.string().max(5000).optional(),
  email: z.string().email().max(200).optional(),
  address: z.string().max(200).optional(),
  houseNumber: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  locale: z.enum(["no", "en"]),
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

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const {
      website: _website,
      company_url_hp: _hp,
      ...safeBody
    } = body as Record<string, unknown>;
    void _website;
    void _hp;

    const parsed = leadSchema.safeParse(safeBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { phone, type, locale, message, email, address, houseNumber, city, ...rest } =
      parsed.data;

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
        ...(houseNumber ? { houseNumber } : {}),
        ...(city ? { city } : {}),
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
            address ? `Adresse: ${address} ${houseNumber || ""}, ${rest.postal} ${city || ""}` : null,
            `Type: ${type}`,
            `Språk: ${locale}`,
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
