import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "product"; category: string; keyword: string; note?: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  blocks: ArticleBlock[];
};

const ARTICLES_DIR = resolve(process.cwd(), "data", "articles");

export function getAllArticles(): Article[] {
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const articles = files.map((file) => {
    const raw = readFileSync(resolve(ARTICLES_DIR, file), "utf-8");
    return JSON.parse(raw) as Article;
  });
  return articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const raw = readFileSync(resolve(ARTICLES_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}
