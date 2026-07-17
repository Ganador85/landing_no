import { createHmac } from "crypto";

export function makeLeadPhotoToken(id: string | number) {
  const secret = process.env.PAYLOAD_SECRET || "dev-secret-change-me-in-production";
  return createHmac("sha256", secret)
    .update(`lead-photos:${id}`)
    .digest("hex")
    .slice(0, 40);
}
