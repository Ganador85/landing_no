/**
 * Verify Cloudflare Turnstile token.
 * When TURNSTILE_SECRET_KEY is unset, verification is skipped (local/dev).
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string,
): Promise<{ ok: boolean; skipped: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true, skipped: true };
  }
  if (!token || typeof token !== "string" || token.length < 10) {
    return { ok: false, skipped: false };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return { ok: Boolean(data.success), skipped: false };
  } catch (err) {
    console.error("Turnstile verify failed:", err);
    return { ok: false, skipped: false };
  }
}

export function turnstileEnabled() {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}
