import { readFileSync } from "fs";
import { resolve } from "path";

export type Product = {
  rank: number;
  keyword: string;
  name: string;
  price: number;
  priceLabel: string;
  imageUrl: string;
  affiliateUrl: string;
  itemUrl: string;
  shopName: string;
  reviewAverage: number;
  reviewCount: number;
};

export type ProductCategory = {
  category: string;
  title: string;
  updatedAt: string;
  items: Product[];
};

export type Category = "controllers" | "headsets" | "monitors" | "keyboards" | "mice" | "chairs" | "capture";

export function getProducts(category: Category): ProductCategory {
  const path = resolve(process.cwd(), "data", "products", `${category}.json`);
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as ProductCategory;
}
