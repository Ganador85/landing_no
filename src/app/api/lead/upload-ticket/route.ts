import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { makeUploadTicket } from "@/lib/upload-ticket";

/**
 * Issues a short-lived upload ticket after optional Turnstile check.
 * Required by /api/lead/photo-upload.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = await rateLimit("upload-ticket", ip, {
    limit: 20,
    windowSec: 60,
  });
  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let turnstileToken: string | undefined;
  try {
    const body = (await request.json()) as { turnstileToken?: string };
    turnstileToken = body.turnstileToken;
  } catch {
    turnstileToken = undefined;
  }

  const turnstile = await verifyTurnstile(turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
  }

  return NextResponse.json({
    ticket: makeUploadTicket(),
    expiresInSec: 15 * 60,
  });
}
