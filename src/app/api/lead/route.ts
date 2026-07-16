import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getPayload } from "@/lib/payload";
import { siteConfig } from "@/lib/site";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  address: z.string().min(2).max(200),
  houseNumber: z.string().min(1).max(20),
  postal: z.string().min(3).max(12),
  city: z.string().min(2).max(100),
  type: z.enum(["vedlikehold", "nytt_tak", "kledning"]),
  message: z.string().min(10).max(5000),
  locale: z.enum(["no", "en"]),
  website: z.string().optional(),
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
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Honeypot — bots filled hidden field
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const { website: _honeypot, phone, ...rest } = parsed.data;
    void _honeypot;

    const payload = await getPayload();
    await payload.create({
      collection: "leads",
      data: {
        ...rest,
        ...(phone ? { phone } : {}),
        status: "new",
      },
      overrideAccess: true,
    });

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.LEAD_FROM_EMAIL || "leads@takfornying.no",
          to: process.env.LEAD_TO_EMAIL || siteConfig.email,
          subject: `Ny henvendelse: ${rest.name} (${rest.type})`,
          text: [
            `Navn: ${rest.name}`,
            `E-post: ${rest.email}`,
            `Telefon: ${phone || "-"}`,
            `Adresse: ${rest.address} ${rest.houseNumber}, ${rest.postal} ${rest.city}`,
            `Type: ${rest.type}`,
            `Språk: ${rest.locale}`,
            "",
            rest.message,
          ].join("\n"),
        });
      } catch (err) {
        // Lead is already saved — don't fail the request on email issues
        console.error("Lead email failed:", err);
      }
    } else {
      console.info("[lead]", { ...rest, phone });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead create failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
