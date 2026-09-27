import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getIssues, getIssueById } from "@/services/issue";
import { getAnnouncements } from "@/services/announcement";

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
};

const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/journal", changeFrequency: "monthly", priority: 0.9 },
  { path: "/journal/editorial-board", changeFrequency: "monthly", priority: 0.6 },
  { path: "/journal/editorial-board/reviewers", changeFrequency: "monthly", priority: 0.5 },
  { path: "/journal/peer-review-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/journal/publication-ethics", changeFrequency: "yearly", priority: 0.5 },
  { path: "/journal/submission-guidelines", changeFrequency: "yearly", priority: 0.6 },
  { path: "/journal/workflow", changeFrequency: "yearly", priority: 0.5 },
  { path: "/issue", changeFrequency: "weekly", priority: 0.9 },
  { path: "/issue/archive", changeFrequency: "weekly", priority: 0.8 },
  { path: "/announcements", changeFrequency: "weekly", priority: 0.7 },
  { path: "/summit", changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Data-backed routes are best-effort: a Supabase hiccup here should never
  // fail the whole sitemap, since the static routes above still give
  // crawlers a usable entry point.
  try {
    const issues = await getIssues();

    for (const issue of issues) {
      entries.push({
        url: `${SITE_URL}/issue/${issue.id}`,
        lastModified: issue.publishedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });

      const detail = await getIssueById(issue.id);
      for (const article of detail?.articles ?? []) {
        entries.push({
          url: `${SITE_URL}/issue/${issue.id}/${article.id}`,
          lastModified: issue.publishedAt,
          changeFrequency: "yearly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // Ignore; sitemap falls back to the static routes only.
  }

  try {
    const announcements = await getAnnouncements();

    for (const announcement of announcements) {
      entries.push({
        url: `${SITE_URL}/announcements/${announcement.slug}`,
        lastModified: announcement.publishedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // Ignore; sitemap falls back to the static routes only.
  }

  return entries;
}
