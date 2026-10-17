export type Issue = {
  id: string;
  volume: number;
  issueNo: number;
  title: string;
  doi?: string;
  issn: string;
  coverImage?: string | null;
  publishedAt: string;
  isCurrent: boolean;
  date: string;
};

export type IssueArticle = {
  id: string;
  title: string;
  abstract: string;
  pages: string;
  pdfUrl: string;
  authors: ArticleAuthor[];
  keywords: string[];
  archiveId?: string;
  doi?: string;
  correspondence?: string;
};

export type AuthorAffiliation = {
  school: string;
  department?: string | null;
  city?: string | null;
  country?: string | null;
};

export type ArticleAuthor = {
  firstname: string;
  middlename?: string | null;
  lastname: string;
  affiliations: AuthorAffiliation[];
  orcid_no?: string | null;
};
