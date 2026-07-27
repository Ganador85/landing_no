/**
 * Resolve PAYLOAD_SECRET for signing / Payload config.
 * During `next build` (NODE_ENV=production) page-data collection may run
 * without env on Dependabot/preview — allow a disposable build-only value.
 * Live production runtime still requires a real secret.
 */
export function resolvePayloadSecret(): string {
  const secret = process.env.PAYLOAD_SECRET;
  if (secret) return secret;

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-secret-do-not-use-at-runtime";
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("PAYLOAD_SECRET must be set in production");
  }

  return "dev-secret-change-me-in-production";
}
