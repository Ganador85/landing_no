export const RESERVED_PAGE_SLUGS = ["blogg", "personvern"] as const;

const reservedPageSlugs = new Set<string>(RESERVED_PAGE_SLUGS);
const slugPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

export function isReservedPageSlug(slug: string): boolean {
  return reservedPageSlugs.has(slug.toLowerCase());
}

export function validateContentSlug(
  value: string | null | undefined,
  options: { allowReserved?: boolean } = {},
): true | string {
  if (!value) return true;

  const trimmed = value.trim();
  if (trimmed !== value) return "Slug cannot start or end with spaces";
  if (trimmed !== trimmed.toLowerCase()) return "Slug must use lowercase letters";
  if (!slugPattern.test(trimmed)) {
    return "Use letters, numbers, and single hyphens only";
  }
  if (!options.allowReserved && isReservedPageSlug(trimmed)) {
    return `"${trimmed}" is reserved by a static site route`;
  }

  return true;
}

export function normalizeRedirectPath(path: string): string {
  const trimmed = path.trim();
  if (trimmed === "/") return trimmed;
  return trimmed.replace(/\/+$/, "");
}

export function redirectPathCandidates(
  locale: string,
  path: string,
): string[] {
  const normalized = normalizeRedirectPath(path);
  const localizedPrefix = `/${locale}`;
  const withoutLocale = normalized.startsWith(`${localizedPrefix}/`)
    ? normalized.slice(localizedPrefix.length)
    : normalized;

  return Array.from(new Set([normalized, withoutLocale]));
}
