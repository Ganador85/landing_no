/**
 * Small monitoring seam for server and client errors.
 * Replace the implementation with Sentry (or another provider) when configured.
 */
export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  console.error("[monitoring] Captured exception", error, context ?? {});
}
