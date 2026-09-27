// Canonical, https-only production URL for the public web app. Every
// absolute URL used in metadata (canonical links, Open Graph, JSON-LD,
// sitemap, robots) is built from this single source of truth so the site
// never advertises a stale or mismatched domain to search engines.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.rganxi.org"
).replace(/\/+$/, "");

export const SITE_NAME = "RGAN XI";

/**
 * Resolves a path to an absolute, https URL on the canonical site domain.
 * Accepts paths with or without a leading slash.
 */
export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}
