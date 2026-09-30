import React, { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIssueById } from "@/services/issue";
import { getArticleMetrics } from "@/services/article-metrics";
import { type Issue, IssueArticle, ArticleAuthor } from "@gad/types/issue";
import type { ArticleMetrics } from "@gad/types/article-metrics";
import { IssueCover } from "@/components/journal/issue-cover";
import { IssueQuickLinks } from "@/components/journal/issue-quick-links";
import { CiteButton } from "@/components/journal/cite-button";
import { AltmetricBadge } from "@/components/journal/altmetric-badge";
import { PdfDownloadButton } from "@/components/journal/pdf-download-button";
import { ArticleViewTracker } from "@/components/journal/article-view-tracker";
import { Badge } from "@gad/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import { formatAuthorName } from "@/lib/authors";
import {
  ARTICLE_FALLBACK_DESCRIPTION,
  JOURNAL_FALLBACK_TITLE,
  absoluteUrl,
  buildArticleTitle,
} from "@/lib/seo";
import { images } from "@/constants/images";
import {
  ArrowLeft,
  Calendar,
  Users,
  Mail,
  Eye,
  Download,
  Copy,
} from "lucide-react";
import { Separator } from "@gad/components/ui/separator";

interface Props {
  params: { id: string; articleId: string };
}

function plainText(html?: string) {
  return html
    ? html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

// Wrapped in React's cache() so generateMetadata and the page body share one
// execution instead of fetching the article twice. Views are no longer
// recorded here; see <ArticleViewTracker />.
const getArticle = cache(async (issueId: string, articleId: string) => {
  const result = await getIssueById(issueId);
  if (!result) return null;
  const article = result.articles.find((a) => a.id === articleId);
  if (!article) return null;

  // Metrics are best-effort: a read hiccup here should never keep the
  // article itself from rendering.
  let metrics: ArticleMetrics | null = null;
  try {
    metrics = await getArticleMetrics(article.id);
  } catch {
    // Ignore; metrics will simply show as unavailable for this request.
  }

  return { issue: result.issue, article, metrics };
});

function toApaAuthorName(author: ArticleAuthor): string {
  const initials = [author.firstname, author.middlename]
    .filter(Boolean)
    .map((name) => `${name!.charAt(0).toUpperCase()}.`)
    .join(" ");

  return `${author.lastname}, ${initials}`;
}

function buildCitation(issue: Issue, article: IssueArticle) {
  const year = new Date(issue.publishedAt).getFullYear();

  const authorList =
    article.authors.length > 0
      ? article.authors.map(toApaAuthorName).join(", ")
      : "RGAN XI Editorial Team";

  const pages = article.pages ? `, ${article.pages}` : "";
  const doi = article.doi ? ` https://doi.org/${article.doi}` : "";

  const citationText =
    `${authorList} (${year}). ${article.title}. ` +
    `Gender Research and Policy Journal, ${issue.volume}(${issue.issueNo})` +
    `${pages}.${doi}`;

  const citation = (
    <>
      {authorList} ({year}). {article.title}.{" "}
      <em>Gender Research and Policy Journal, {issue.volume}</em>(
      {issue.issueNo}){pages}.{doi}
    </>
  );

  return {
    citation,
    citationText,
  };
}

function buildArticleJsonLd(issue: Issue, article: IssueArticle, canonical: string) {
  const authorNames =
    article.authors.length > 0
      ? article.authors.map((author) => formatAuthorName(author))
      : ["RGAN XI Editorial Team"];

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: article.title,
    abstract: plainText(article.abstract) || undefined,
    datePublished: issue.publishedAt,
    url: absoluteUrl(canonical),
    isPartOf: {
      "@type": "Periodical",
      name: "Gender Research and Policy Journal",
      issn: issue.issn,
    },
    author: authorNames.map((name) => ({ "@type": "Person", name })),
    keywords: article.keywords.length > 0 ? article.keywords.join(", ") : undefined,
    ...(article.doi ? { sameAs: `https://doi.org/${article.doi}` } : {}),
    ...(article.pdfUrl ? { encoding: { "@type": "MediaObject", contentUrl: article.pdfUrl } } : {}),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // A data-source hiccup must never break the page head; fall back to a
  // safe, generic journal title instead.
  let result: Awaited<ReturnType<typeof getArticle>> = null;
  try {
    result = await getArticle(params.id, params.articleId);
  } catch {
    result = null;
  }
  if (!result) return { title: { absolute: JOURNAL_FALLBACK_TITLE } };
  const { issue, article } = result;
  const seoTitle = buildArticleTitle(article.title);
  const description =
    plainText(article.abstract) || ARTICLE_FALLBACK_DESCRIPTION;
  const canonical = `/issue/${issue.id}/${article.id}`;
  const authorNames =
    article.authors.length > 0
      ? article.authors.map((author) => `${author.lastname}, ${author.firstname}`)
      : ["RGAN XI Editorial Team"];

  return {
    // Only the <title> tag is optimized. The article H1, citation tags and
    // JSON-LD headline keep the full, unmodified article title.
    title: { absolute: seoTitle },
    description,
    alternates: { canonical },
    openGraph: {
      title: seoTitle,
      description,
      url: canonical,
      type: "article",
      publishedTime: issue.publishedAt,
      images: issue.coverImage ? [{ url: issue.coverImage }] : undefined,
    },
    twitter: { title: seoTitle, description },
    // Highwire Press tags: the metadata format Google Scholar reads to
    // index individual journal articles for citation and discovery.
    other: {
      citation_title: article.title,
      citation_author: authorNames,
      citation_publication_date: issue.publishedAt,
      citation_journal_title: "Gender Research and Policy Journal",
      citation_issn: issue.issn,
      ...(article.doi ? { citation_doi: article.doi } : {}),
      ...(article.pdfUrl ? { citation_pdf_url: article.pdfUrl } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const result = await getArticle(params.id, params.articleId);
  if (!result) notFound();
  const { issue, article, metrics } = result;
  const citation = buildCitation(issue, article);
  const articleJsonLd = buildArticleJsonLd(
    issue,
    article,
    `/issue/${issue.id}/${article.id}`,
  );

  return (
    <div className="pt-20">
      <ArticleViewTracker articleId={article.id} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/issue/${issue.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Issue
        </Link>

        <div className="grid lg:grid-cols-4 gap-10 lg:gap-14">
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-[220px_1fr] gap-10">
              {/* Cover + actions */}
              <div className="max-w-[220px] mx-auto md:mx-0 w-full">
                <IssueCover
                  volume={issue.volume}
                  issueNo={issue.issueNo}
                  coverImage={issue.coverImage}
                  className="mb-4"
                  priority
                />
                <div className="space-y-2">
                  {article.pdfUrl && (
                    <PdfDownloadButton
                      articleId={article.id}
                      pdfUrl={article.pdfUrl}
                    />
                  )}
                  <CiteButton
                    citation={citation.citation}
                    citationText={citation.citationText}
                  />
                </div>
              </div>

              {/* Title / metadata */}
              <div className="flex flex-col justify-center">
                <h1 className="font-display text-2xl lg:text-3xl font-bold mb-5 leading-snug">
                  {article.title}
                </h1>

                {/* Authors: full name, institution, ORCID */}
                <div className="space-y-3 mb-5">
                  {article.authors.length > 0 ? (
                    article.authors.map((author, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground/90">
                            {formatAuthorName(author)}
                          </p>
                          {author.school && (
                            <p className="text-muted-foreground text-xs">
                              {author.school}
                            </p>
                          )}
                          {author.orcid_no && (
                            <a
                              href={`https://orcid.org/${author.orcid_no}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary underline hover:no-underline"
                            >
                              ORCID: {author.orcid_no}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      RGAN XI Editorial Team
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Published {formatDateShort(issue.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    DOI:{" "}
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary transition-colors"
                    >
                      https://doi.org/{article.doi}
                    </a>
                  </span>
                </div>

                {article.correspondence && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
                    <Mail className="h-4 w-4 shrink-0" />
                    Correspondence:{" "}
                    <a
                      href={`mailto:${article.correspondence}`}
                      className="underline hover:text-primary transition-colors"
                    >
                      {article.correspondence}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Abstract */}
            <div className="mt-14 pt-12 border-t border-border">
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">
                Abstract
              </p>
              {article.abstract ? (
                <p className="text-foreground/85 leading-relaxed">
                  {article.abstract}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No abstract has been provided for this article.
                </p>
              )}
            </div>

            {/* Keywords */}
            {article.keywords.length > 0 && (
              <div className="mt-10 pt-10 border-t border-border">
                <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword) => (
                    <Badge key={keyword} variant="category">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-40 space-y-6">
              <IssueQuickLinks />

              <div className="bg-white border border-border rounded-2xl p-6">
                <p className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground mb-5">
                  Article Metrics
                </p>

                <div className="grid grid-cols-3 divide-x divide-border">
                  <div className="flex flex-col items-center text-center px-2">
                    <Eye className="h-4 w-4 text-muted-foreground mb-2" />
                    <span className="font-display font-semibold text-lg text-foreground">
                      {metrics?.totalViews ?? 0}
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      Views
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center px-2">
                    <Download className="h-4 w-4 text-muted-foreground mb-2" />
                    <span className="font-display font-semibold text-lg text-foreground">
                      {metrics?.totalDownloads ?? 0}
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      Downloads
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center px-2">
                    <Copy className="h-4 w-4 text-muted-foreground mb-2" />
                    <span className="font-display font-semibold text-lg text-foreground">
                      {metrics?.citationCount ?? 0}
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      Citations
                    </span>
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="flex items-center gap-3">
                  <Image
                    src={images.open_access_logo}
                    alt="Open Access"
                    width={28}
                    height={28}
                    className="shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      Open Access
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Freely available to read and download.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
