import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

/** 商品データの更新日時をカテゴリページの lastModified として使う */
function categoryLastModified(slug: string): Date | undefined {
  try {
    const { updatedAt } = getProducts(slug);
    const date = new Date(updatedAt);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getAllCategories();
  // 周辺機器まとめ（ピラーページ）は全カテゴリの商品データを束ねるため、
  // 最も新しいカテゴリ更新日時を lastModified に使う
  const pillarLastModified = categories
    .map((cat) => categoryLastModified(cat.slug))
    .filter((d): d is Date => d !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_ORIGIN, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_ORIGIN}/ps5-accessories`,
      lastModified: pillarLastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categories.map((cat) => ({
      url: `${SITE_ORIGIN}/${cat.slug}`,
      lastModified: categoryLastModified(cat.slug),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: `${SITE_ORIGIN}/articles`, changeFrequency: "daily", priority: 0.7 },
  ];

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${SITE_ORIGIN}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages];
}
