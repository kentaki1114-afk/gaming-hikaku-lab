/**
 * seo-audit.mjs — ゲーミング比較ラボ SEO健全性チェッカー
 *
 * 静的データ・ソースコードを走査して、SEO上の問題を検出する。
 * ビルド不要・依存パッケージ不要・読み取り専用（ファイルを変更しない）。
 *
 * 実行: node scripts/seo-audit.mjs
 * 終了コード: 0 = 問題なし / 1 = ERROR あり（WARN のみなら 0）
 *
 * チェック項目:
 *   1. canonical URL     — 全ページに alternates.canonical があるか
 *   2. 構造化データ      — カテゴリページに ItemList / BreadcrumbList / FAQPage があるか
 *   3. 記事データ整合性  — slug とファイル名の一致・カテゴリ存在・商品keyword参照切れ
 *   4. 商品データ品質    — imageUrl / affiliateUrl / price の欠落
 *   5. sitemap整合性     — categories.json ⇔ app/<slug>/page.tsx ⇔ data/products/<slug>.json
 *   6. 内部リンク        — カテゴリページに RelatedArticles・パンくず「ホーム」リンクがあるか
 *   7. 画像alt属性       — <Image> 使用ファイルに alt= があるか
 */

import { readdirSync, readFileSync, existsSync, statSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "app");
const ARTICLES_DIR = join(ROOT, "data", "articles");
const PRODUCTS_DIR = join(ROOT, "data", "products");
const CATEGORIES_JSON = join(ROOT, "data", "categories.json");

// パンくず・canonical を必須としない特別ページ
const NON_CONTENT_DIRS = new Set(["components"]);

let errors = 0;
let warns = 0;
const ok = (msg) => console.log(`  ✅ ${msg}`);
const warn = (msg) => { warns++; console.log(`  ⚠️  WARN: ${msg}`); };
const error = (msg) => { errors++; console.log(`  ❌ ERROR: ${msg}`); };

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

const categories = readJson(CATEGORIES_JSON);
const categorySlugs = categories.map((c) => c.slug);

// ページディレクトリ一覧（app直下で page.tsx を持つもの）
const pageDirs = readdirSync(APP_DIR).filter((d) => {
  const full = join(APP_DIR, d);
  return statSync(full).isDirectory() && !NON_CONTENT_DIRS.has(d) && existsSync(join(full, "page.tsx"));
});

// ── 1. canonical URL ─────────────────────────────────────────────
console.log("\n[1/7] canonical URL チェック");
{
  const targets = [
    join(APP_DIR, "page.tsx"),
    ...pageDirs.map((d) => join(APP_DIR, d, "page.tsx")),
    join(APP_DIR, "articles", "[slug]", "page.tsx"),
  ].filter(existsSync);
  let missing = 0;
  for (const file of targets) {
    const src = readFileSync(file, "utf-8");
    if (!src.includes("canonical")) {
      error(`canonical 未設定: ${file.replace(ROOT, "")}`);
      missing++;
    }
  }
  if (missing === 0) ok(`全 ${targets.length} ページに canonical 設定あり`);
}

// ── 2. 構造化データ ───────────────────────────────────────────────
console.log("\n[2/7] 構造化データ（JSON-LD）チェック");
{
  for (const slug of categorySlugs) {
    const file = join(APP_DIR, slug, "page.tsx");
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf-8");
    if (!src.includes('"ItemList"')) error(`${slug}: ItemList JSON-LD なし`);
    if (!src.includes('"BreadcrumbList"')) error(`${slug}: BreadcrumbList JSON-LD なし`);
    if (!src.includes("FaqSection")) warn(`${slug}: FAQセクション（FAQPage JSON-LD）なし`);
  }
  const articlePage = readFileSync(join(APP_DIR, "articles", "[slug]", "page.tsx"), "utf-8");
  if (!articlePage.includes('"Article"')) error("記事ページ: Article JSON-LD なし");
  if (!articlePage.includes("image:")) warn("記事ページ: Article JSON-LD に image なし");
  const layout = readFileSync(join(APP_DIR, "layout.tsx"), "utf-8");
  if (!layout.includes('"WebSite"')) warn("layout: WebSite JSON-LD なし");
  if (errors === 0) ok("カテゴリ・記事・layout の構造化データを確認");
}

// ── 3. 記事データ整合性 ───────────────────────────────────────────
console.log("\n[3/7] 記事データ整合性チェック");
{
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const seenSlugs = new Set();
  let issues = 0;
  for (const file of files) {
    const article = readJson(join(ARTICLES_DIR, file));
    const base = file.replace(/\.json$/, "");
    if (article.slug !== base) {
      error(`${file}: slug "${article.slug}" がファイル名と不一致（404の原因になる）`);
      issues++;
    }
    if (seenSlugs.has(article.slug)) { error(`${file}: slug 重複`); issues++; }
    seenSlugs.add(article.slug);
    if (!categorySlugs.includes(article.category)) {
      warn(`${file}: カテゴリ "${article.category}" が categories.json に未登録`);
      issues++;
    }
    if (!article.title || !article.description) { error(`${file}: title/description 欠落`); issues++; }
    if (article.description && (article.description.length < 50 || article.description.length > 160)) {
      warn(`${file}: description が ${article.description.length} 文字（推奨 50〜160）`);
    }
    // 商品ブロックの keyword 参照切れ（リンク切れ商品カード = 表示されない）
    const productsPath = join(PRODUCTS_DIR, `${article.category}.json`);
    if (existsSync(productsPath)) {
      const { items } = readJson(productsPath);
      const keywords = new Set(items.map((it) => it.keyword));
      for (const block of article.blocks || []) {
        if (block.type === "product" && !keywords.has(block.keyword)) {
          warn(`${file}: 商品keyword "${block.keyword}" が ${article.category}.json に存在せず、カードが描画されない`);
          issues++;
        }
      }
    }
  }
  if (issues === 0) ok(`全 ${files.length} 記事の整合性OK`);
}

// ── 4. 商品データ品質 ─────────────────────────────────────────────
console.log("\n[4/7] 商品データ品質チェック");
{
  let issues = 0;
  for (const file of readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".json"))) {
    const { items, updatedAt } = readJson(join(PRODUCTS_DIR, file));
    for (const item of items) {
      if (!item.imageUrl) { warn(`${file}: "${item.name?.slice(0, 30)}…" 画像なし`); issues++; }
      if (!item.affiliateUrl) { error(`${file}: "${item.name?.slice(0, 30)}…" アフィリエイトURLなし`); issues++; }
      if (!item.price || item.price <= 0) { warn(`${file}: "${item.name?.slice(0, 30)}…" 価格が不正`); issues++; }
    }
    const age = (Date.now() - new Date(updatedAt).getTime()) / 86400000;
    if (Number.isFinite(age) && age > 7) {
      warn(`${file}: 商品データが ${Math.floor(age)} 日間未更新（自動更新が止まっている可能性）`);
      issues++;
    }
  }
  if (issues === 0) ok("全商品データの品質OK・鮮度OK");
}

// ── 5. sitemap・カテゴリ整合性 ────────────────────────────────────
console.log("\n[5/7] sitemap・カテゴリ整合性チェック");
{
  let issues = 0;
  for (const slug of categorySlugs) {
    if (!existsSync(join(APP_DIR, slug, "page.tsx"))) { error(`categories.json の "${slug}" にページがない`); issues++; }
    if (!existsSync(join(PRODUCTS_DIR, `${slug}.json`))) { error(`categories.json の "${slug}" に商品データがない`); issues++; }
  }
  const knownNonCategory = new Set(["articles", "privacy", "disclaimer"]);
  for (const dir of pageDirs) {
    if (!categorySlugs.includes(dir) && !knownNonCategory.has(dir)) {
      warn(`app/${dir} は categories.json 未登録（sitemap から漏れている可能性）`);
      issues++;
    }
  }
  if (issues === 0) ok(`全 ${categorySlugs.length} カテゴリの sitemap 整合性OK`);
}

// ── 6. 内部リンク ─────────────────────────────────────────────────
console.log("\n[6/7] 内部リンクチェック");
{
  let issues = 0;
  for (const slug of categorySlugs) {
    const file = join(APP_DIR, slug, "page.tsx");
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf-8");
    if (!src.includes("<RelatedArticles")) { warn(`${slug}: 関連記事セクション（RelatedArticles）なし`); issues++; }
    if (!/Link href="\/"/.test(src)) { warn(`${slug}: パンくずの「ホーム」がリンクになっていない`); issues++; }
  }
  if (issues === 0) ok("全カテゴリページの内部リンクOK");
}

// ── 7. 画像 alt 属性 ──────────────────────────────────────────────
console.log("\n[7/7] 画像 alt 属性チェック");
{
  let issues = 0;
  const walk = (dir) =>
    readdirSync(dir).flatMap((f) => {
      const full = join(dir, f);
      return statSync(full).isDirectory() ? walk(full) : full.endsWith(".tsx") ? [full] : [];
    });
  for (const file of walk(APP_DIR)) {
    const src = readFileSync(file, "utf-8");
    if ((src.includes("<Image") || src.includes("<img")) && !src.includes("alt=")) {
      error(`${file.replace(ROOT, "")}: <Image>/<img> に alt 属性なし`);
      issues++;
    }
  }
  if (issues === 0) ok("画像 alt 属性OK");
}

// ── 結果 ─────────────────────────────────────────────────────────
console.log(`\n━━━ 結果: ERROR ${errors} 件 / WARN ${warns} 件 ━━━`);
if (errors > 0) process.exit(1);
