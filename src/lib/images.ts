/** Build a CDN-friendly image URL (Unsplash params, etc.). */
export function optimizeRemoteImageUrl(
  url: string,
  opts?: { width?: number; quality?: number },
): string {
  if (!url) return url;
  const width = opts?.width ?? 1600;
  const quality = opts?.quality ?? 75;

  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.unsplash.com") {
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("q", String(quality));
      parsed.searchParams.set("fm", "webp");
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}
