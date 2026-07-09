import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { cache } from "react";

export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "product"; category: string; keyword: string; note?: string }
  | { type: "faq"; items: { q: string; a: string }[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  /** 手書きの柱記事。関連記事欄で自動生成記事より優先表示される */
  featured?: boolean;
  blocks: ArticleBlock[];
};

const ARTICLES_DIR = resolve(process.cwd(), "data", "articles");

// リクエスト中に何度も呼ばれるため React cache でメモ化する
// （トップ・記事一覧・各記事の RelatedArticles で繰り返しファイル全読込されるのを防ぐ）
export const getAllArticles = cache((): Article[] => {
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const articles = files.map((file) => {
    const raw = readFileSync(resolve(ARTICLES_DIR, file), "utf-8");
    return JSON.parse(raw) as Article;
  });
  return articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
});

export function getArticleBySlug(slug: string): Article | null {
  try {
    const raw = readFileSync(resolve(ARTICLES_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}
