import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_ORIGIN, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_ORIGIN}/controllers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_ORIGIN}/headsets`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_ORIGIN}/monitors`, changeFrequency: "daily", priority: 0.8 },
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
