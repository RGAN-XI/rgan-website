import type { ArticleAuthor, AuthorAffiliation } from "@gad/types/issue";

export function formatAuthorName(author: ArticleAuthor): string {
  const middle = author.middlename ? ` ${author.middlename}` : "";
  return `${author.firstname}${middle} ${author.lastname}`.trim();
}

export function formatAffiliation(affiliation: AuthorAffiliation): string {
  return [affiliation.department, affiliation.school, affiliation.city, affiliation.country]
    .filter(Boolean)
    .join(", ");
}

export function formatAuthorAddress(address: AuthorAffiliation): string{
  return [address.city, address.country]
    .filter(Boolean)
    .join(", ");
}
