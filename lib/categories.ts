import { readFileSync } from "fs";
import { resolve } from "path";

export type CategoryMeta = {
  slug: string;
  title: string;
  navLabel: string;
  navLabelShort: string;
  accentColor: string;
};

export function getAllCategories(): CategoryMeta[] {
  const raw = readFileSync(resolve(process.cwd(), "data", "categories.json"), "utf-8");
  return JSON.parse(raw) as CategoryMeta[];
}

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}
