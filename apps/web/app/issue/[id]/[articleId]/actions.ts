"use server";

import {
  recordArticleDownload,
  recordArticleView,
} from "@/services/article-metrics";

/**
 * Records a download event for an article. Called from the client-side
 * "Download PDF" button on click. Swallows errors so a metrics hiccup
 * never blocks or surfaces to a visitor trying to download the PDF.
 */
export async function recordArticleDownloadAction(
  articleId: string,
): Promise<void> {
  try {
    await recordArticleDownload(articleId);
  } catch {
    // Best-effort only; ignore failures.
  }
}

/**
 * Records a view event for an article. Called once from the client after the
 * page has loaded, so the article page itself can be statically rendered and
 * cached instead of writing to the database on every render. Errors are
 * swallowed for the same reason as the download action.
 */
export async function recordArticleViewAction(
  articleId: string,
): Promise<void> {
  try {
    await recordArticleView(articleId);
  } catch {
    // Best-effort only; ignore failures.
  }
}
