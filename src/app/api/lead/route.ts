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

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const { website: _honeypot, ...lead } = parsed.data;
    void _honeypot;

    try {
      const payload = await getPayload();
      await payload.create({
        collection: "leads",
        data: {
          ...lead,
          status: "new",
        },
      });
    } catch (err) {
      console.error("Payload lead create failed (continuing with email):", err);
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.LEAD_FROM_EMAIL || "leads@takfornying.no",
        to: process.env.LEAD_TO_EMAIL || siteConfig.email,
        subject: `Ny henvendelse: ${lead.name} (${lead.type})`,
        text: [
          `Navn: ${lead.name}`,
          `E-post: ${lead.email}`,
          `Telefon: ${lead.phone || "-"}`,
          `Adresse: ${lead.address} ${lead.houseNumber}, ${lead.postal} ${lead.city}`,
          `Type: ${lead.type}`,
          `Språk: ${lead.locale}`,
          "",
          lead.message,
        ].join("\n"),
      });
    } else {
      console.info("[lead]", lead);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
