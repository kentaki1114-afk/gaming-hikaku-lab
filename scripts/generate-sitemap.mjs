// ビルド前に public/sitemap.xml を静的ファイルとして生成するスクリプト。
// Next.js の app/sitemap.ts（動的生成）がGoogle Search Consoleで取得できない
// 問題の回避策として、静的XMLファイルを直接 public/ に出力する。
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = process.cwd();
const SITE_ORIGIN = "https://gaming-hikaku-lab.com";

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function isoDate(dateStr) {
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function url(loc, { lastmod, changefreq, priority } = {}) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod   ? `    <lastmod>${lastmod}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority  !== undefined ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ].filter(Boolean).join("\n");
}

// カテゴリ一覧
const categoriesPath = resolve(ROOT, "data", "categories.json");
const categories = loadJson(categoriesPath);

// 商品データの更新日時
function categoryLastMod(slug) {
  try {
    const data = loadJson(resolve(ROOT, "data", "products", `${slug}.json`));
    return isoDate(data.updatedAt);
  } catch {
    return undefined;
  }
}

// 記事一覧
const articlesDir = resolve(ROOT, "data", "articles");
const articleFiles = readdirSync(articlesDir).filter(f => f.endsWith(".json"));
const articles = articleFiles.map(f => loadJson(resolve(articlesDir, f)));

// pillar page: 最新カテゴリ更新日
const pillarLastMod = categories
  .map(c => categoryLastMod(c.slug))
  .filter(Boolean)
  .sort()
  .reverse()[0];

const entries = [
  url(SITE_ORIGIN,                        { changefreq: "daily", priority: 1.0 }),
  url(`${SITE_ORIGIN}/ps5-accessories`,   { lastmod: pillarLastMod, changefreq: "daily", priority: 0.9 }),
  url(`${SITE_ORIGIN}/about`,             { changefreq: "monthly", priority: 0.5 }),
  ...categories.map(c =>
    url(`${SITE_ORIGIN}/${c.slug}`,       { lastmod: categoryLastMod(c.slug), changefreq: "daily", priority: 0.8 })
  ),
  url(`${SITE_ORIGIN}/articles`,          { changefreq: "daily", priority: 0.7 }),
  ...articles.map(a =>
    url(`${SITE_ORIGIN}/articles/${a.slug}`, { lastmod: isoDate(a.updatedAt), changefreq: "weekly", priority: 0.6 })
  ),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries,
  "</urlset>",
].join("\n") + "\n";

const outPath = resolve(ROOT, "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`✅ sitemap.xml を生成しました: ${entries.length} URL`);
