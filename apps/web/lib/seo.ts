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

// ---------------------------------------------------------------------------
// Entity names and title builders
//
// Entity hierarchy reinforced by every title and description:
//   RGAN XI -> Region XI Gender and Development Advocates Network
//     publishes -> Gender Research and Policy Journal (GRPJ)
//       contains -> Issues -> Articles
// ---------------------------------------------------------------------------
export const ORG_NAME_FULL = "Region XI Gender and Development Advocates Network";
export const JOURNAL_NAME = "Gender Research and Policy Journal";
export const JOURNAL_ABBR = "GRPJ";

export const HOME_TITLE = `${SITE_NAME} | ${ORG_NAME_FULL}`;
export const ABOUT_TITLE = `About ${SITE_NAME} | ${ORG_NAME_FULL}`;
export const ARCHIVE_TITLE = `${JOURNAL_NAME} Archive | ${SITE_NAME}`;
export const JOURNAL_FALLBACK_TITLE = `${JOURNAL_NAME} | ${SITE_NAME}`;

export const HOME_DESCRIPTION = `${ORG_NAME_FULL} (${SITE_NAME}) promotes gender-responsive research, advocacy, education, policy development, and collaboration across Region XI, Philippines.`;
export const ARCHIVE_DESCRIPTION = `Explore the ${JOURNAL_NAME} (${JOURNAL_ABBR}) archive, featuring peer-reviewed research, policy analysis, and scholarly work published by ${SITE_NAME}.`;
export const ARTICLE_FALLBACK_DESCRIPTION = `A scholarly article published in the ${JOURNAL_NAME} (${JOURNAL_ABBR}) by the ${ORG_NAME_FULL} (${SITE_NAME}).`;

// Target length for the whole <title>. It is a soft limit: the article title
// is the primary search entity and is never shortened, only its suffix is.
const TITLE_SOFT_LIMIT = 65;

function clean(value?: string | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Title for /issue/{id}, e.g.
 * "Gender Research and Policy Journal | Vol. 2 No. 1 (2026) | RGAN XI".
 * Built from the loaded issue metadata; falls back safely when a value is
 * missing so "undefined" or "NaN" can never reach the <title>.
 */
export function buildIssueTitle(issue?: {
  volume?: number | null;
  issueNo?: number | null;
  publishedAt?: string | null;
} | null): string {
  if (!issue) return JOURNAL_FALLBACK_TITLE;

  const parts: string[] = [];
  if (Number.isFinite(issue.volume)) parts.push(`Vol. ${issue.volume}`);
  if (Number.isFinite(issue.issueNo)) parts.push(`No. ${issue.issueNo}`);

  const year = issue.publishedAt ? new Date(issue.publishedAt).getUTCFullYear() : NaN;
  const yearLabel = Number.isFinite(year) ? `(${year})` : "";

  const label = [parts.join(" "), yearLabel].filter(Boolean).join(" ");
  return label
    ? `${JOURNAL_NAME} | ${label} | ${SITE_NAME}`
    : JOURNAL_FALLBACK_TITLE;
}

/** Description for /issue/{id}, built only from existing issue data. */
export function buildIssueDescription(issue?: {
  volume?: number | null;
  issueNo?: number | null;
  issn?: string | null;
} | null): string {
  const base = `${JOURNAL_NAME} (${JOURNAL_ABBR}), published by the ${ORG_NAME_FULL}.`;
  if (!issue || !Number.isFinite(issue.volume) || !Number.isFinite(issue.issueNo)) {
    return `Explore the ${base}`;
  }
  const issn = clean(issue.issn);
  return (
    `Explore Volume ${issue.volume}, Number ${issue.issueNo} of the ${base}` +
    (issn ? ` ISSN ${issn}.` : "")
  );
}

/**
 * Title for /issue/{id}/{articleId}. The article title always comes first and
 * is never truncated. Only the suffix is shortened, in this order:
 *   " | Gender Research and Policy Journal | RGAN XI"
 *   " | GRPJ | RGAN XI"   (keeps both entity signals for long titles)
 */
export function buildArticleTitle(articleTitle?: string | null): string {
  const title = clean(articleTitle);
  if (!title) return JOURNAL_FALLBACK_TITLE;

  const full = `${title} | ${JOURNAL_NAME} | ${SITE_NAME}`;
  if (full.length <= TITLE_SOFT_LIMIT) return full;

  const compact = `${title} | ${JOURNAL_ABBR} | ${SITE_NAME}`;
  return compact;
}
