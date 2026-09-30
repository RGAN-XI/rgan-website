"use client";

import { useEffect } from "react";
import { recordArticleViewAction } from "@/app/issue/[id]/[articleId]/actions";

interface ArticleViewTrackerProps {
  articleId: string;
}

/**
 * Fires a single view event after the article page mounts. Keeping this out
 * of the server render lets the page be cached (ISR) while still counting
 * real visitors. Renders nothing.
 */
export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    void recordArticleViewAction(articleId);
  }, [articleId]);

  return null;
}
