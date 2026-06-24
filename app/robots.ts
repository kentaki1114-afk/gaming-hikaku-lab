import type { MetadataRoute } from "next";

const SITE_ORIGIN = "https://gaming-hikaku-lab.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
