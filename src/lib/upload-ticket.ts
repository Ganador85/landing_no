import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { resolvePayloadSecret } from "@/lib/payload-secret";

function requireSecret(): string {
  return resolvePayloadSecret();
}

const UPLOAD_TICKET_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Short-lived ticket required by /api/lead/photo-upload.
 * Format: `up.<expMs>.<nonce>.<sig>`
 */
export function makeUploadTicket() {
  const exp = Date.now() + UPLOAD_TICKET_TTL_MS;
  const nonce = randomBytes(8).toString("hex");
  const sig = createHmac("sha256", requireSecret())
    .update(`upload-ticket:${exp}:${nonce}`)
    .digest("hex")
    .slice(0, 32);
  return `up.${exp}.${nonce}.${sig}`;
}

export function verifyUploadTicket(ticket: string | null | undefined): boolean {
  if (!ticket || !ticket.startsWith("up.")) return false;
  const parts = ticket.split(".");
  if (parts.length !== 4) return false;
  const exp = Number(parts[1]);
  const nonce = parts[2];
  const sig = parts[3];
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  if (!/^[a-f0-9]{16}$/.test(nonce)) return false;
  const expected = createHmac("sha256", requireSecret())
    .update(`upload-ticket:${exp}:${nonce}`)
    .digest("hex")
    .slice(0, 32);
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
