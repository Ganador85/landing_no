import { createHmac, timingSafeEqual } from "crypto";

export function makeLeadPhotoToken(id: string | number) {
  const secret = process.env.PAYLOAD_SECRET || "dev-secret-change-me-in-production";
  return createHmac("sha256", secret)
    .update(`lead-photos:${id}`)
    .digest("hex")
    .slice(0, 40);
}

export function tokensMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyLeadPhotoToken(id: string | number, token: string) {
  if (!token || token.length < 16) return false;
  return tokensMatch(token, makeLeadPhotoToken(id));
}

export function parseLeadPhotoUrls(value: unknown): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
