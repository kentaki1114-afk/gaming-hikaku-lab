import type { Product } from "./products";

type RankedItem = { product: Product };

/** ランキングページの ItemList JSON-LD（AggregateRating付き）を生成する */
export function buildItemListJsonLd(
  name: string,
  siteOrigin: string,
  path: string,
  merged: RankedItem[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${siteOrigin}${path}`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "JPY",
          url: product.affiliateUrl,
        },
        ...(product.reviewCount >= 5
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: String(product.reviewAverage),
                bestRating: "5",
                worstRating: "1",
                ratingCount: String(product.reviewCount),
              },
            }
          : {}),
      },
    })),
  };
}

/** パンくずリスト JSON-LD を生成する */
export function buildBreadcrumbJsonLd(
  items: { name: string; item?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, item }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      ...(item ? { item } : {}),
    })),
  };
}
