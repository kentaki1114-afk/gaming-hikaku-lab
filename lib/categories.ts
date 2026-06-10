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

/**
 * accentColor → バッジ用Tailwindクラスのマップ。
 * Tailwindは動的クラス名を生成できないため、リテラルで全色を列挙している。
 * auto-category.mjs の COLOR_THEMES と対応。
 */
export const ACCENT_BADGE_CLASSES: Record<string, string> = {
  violet: "bg-violet-600/20 text-violet-300 border-violet-500/30",
  green: "bg-green-600/20 text-green-300 border-green-500/30",
  blue: "bg-blue-600/20 text-blue-300 border-blue-500/30",
  orange: "bg-orange-600/20 text-orange-300 border-orange-500/30",
  rose: "bg-rose-600/20 text-rose-300 border-rose-500/30",
  yellow: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30",
  cyan: "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",
  purple: "bg-purple-600/20 text-purple-300 border-purple-500/30",
  indigo: "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
  teal: "bg-teal-600/20 text-teal-300 border-teal-500/30",
  amber: "bg-amber-600/20 text-amber-300 border-amber-500/30",
};

export const DEFAULT_BADGE_CLASS = ACCENT_BADGE_CLASSES.violet;
