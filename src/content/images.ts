/** Curated Unsplash stock for client preview (illustrative, not real project photos). */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75&fm=webp`;

export const siteImages = {
  hero: u("photo-1568605114967-8130f3a36994", 2000),
  newRoof: u("photo-1475855581690-80accde3ae2b", 1400),
  about: u("photo-1449844908441-8829872d2607", 1400),
  og: u("photo-1568605114967-8130f3a36994", 1200),
} as const;
