import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllCategories } from "@/lib/categories";

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getAllCategories();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_ORIGIN, changeFrequency: "daily", priority: 1 },
    ...categories.map((cat) => ({
      url: `${SITE_ORIGIN}/${cat.slug}`,
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
