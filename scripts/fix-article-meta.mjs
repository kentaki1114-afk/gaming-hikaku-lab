// 既存記事のメタ情報（title / description / 見出し・本文中の商品名）を修復するスクリプト。
//
// 背景: generate-articles.mjs は楽天APIの商品名をそのまま埋め込んでいたため、
// 「【スーパーSALE】」のようなセール文言が記事タイトルや description に混入し、
// 検索結果（SERP）の表示が壊れる・description が160字を超える問題があった。
// 生成側は修正済みだが、このスクリプトで過去に生成された記事も同じルールで直す。
//
// やること（冪等・何度実行しても安全）:
//   1. title / description をテーマ別テンプレートで短縮商品名を使って再構築
//      （slugから selectionguide / headtohead テーマを判定。商品名を含まないテーマは対象外）
//   2. 全テキストブロックで「生の商品名」→「短縮商品名」に置換し、残ったセール文言【...】を除去
//   3. description が160字を超えていれば末尾を省略
//   4. 変更があった記事は updatedAt を今日に更新（sitemapのlastModifiedに反映される）
//
// 実行: node scripts/fix-article-meta.mjs        … 修正を書き込む
//       node scripts/fix-article-meta.mjs --dry  … 変更内容の確認のみ
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve } from "path";
import { cleanProductName, shortProductName, clampDescription } from "./product-name.mjs";

const ROOT = process.cwd();
const ARTICLES_DIR = resolve(ROOT, "data", "articles");
const PRODUCTS_DIR = resolve(ROOT, "data", "products");
const DRY_RUN = process.argv.includes("--dry");

const CATEGORY_TITLES = {
  controllers: "コントローラー",
  headsets: "ヘッドセット",
  monitors: "ゲーミングモニター",
  keyboards: "ゲーミングキーボード",
  mice: "ゲーミングマウス",
  chairs: "ゲーミングチェア",
  capture: "キャプチャーボード",
};

function loadProducts(category) {
  const path = resolve(PRODUCTS_DIR, `${category}.json`);
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8")).items;
}

/** 本文テキスト中の生の商品名を短縮名に置換し、残ったセール文言を除去する */
function cleanText(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) {
    out = out.split(from).join(to);
  }
  // 商品名置換後に残った【セール文言】を除去（markdownリンクの[]には触らない）
  return out.replace(/【[^】]*】/g, " ").replace(/ {2,}/g, " ").replace(/^ | $/g, "");
}

/** 記事内の product ブロックの keyword 順に商品を返す */
function productsInArticle(article, products) {
  const byKeyword = new Map(products.map((p) => [p.keyword, p]));
  const seen = new Set();
  const result = [];
  for (const block of article.blocks ?? []) {
    if (block.type === "product" && byKeyword.has(block.keyword) && !seen.has(block.keyword)) {
      seen.add(block.keyword);
      result.push(byKeyword.get(block.keyword));
    }
  }
  return result;
}

/** slugからテーマを判定し、title/description を再構築する（対象外テーマは null） */
function rebuildMeta(article, articleProducts) {
  const catTitle = CATEGORY_TITLES[article.category] ?? article.category;
  if (article.slug.includes("-selectionguide-") && articleProducts.length >= 2) {
    const [main, sub] = articleProducts;
    return {
      title: `${catTitle}の選び方完全ガイド｜${shortProductName(main.name)}と${shortProductName(sub.name)}を例に解説`,
      description: `${catTitle}選びで失敗しないためのチェックポイントを、人気モデル「${shortProductName(main.name)}」「${shortProductName(sub.name)}」を例にしながら解説します。`,
    };
  }
  if (article.slug.includes("-headtohead-") && articleProducts.length >= 2) {
    const [a, b] = articleProducts;
    return {
      title: `「${shortProductName(a.name)}」と「${shortProductName(b.name)}」を徹底比較｜どちらを選ぶべき？`,
      description: `人気${catTitle}「${shortProductName(a.name)}」と「${shortProductName(b.name)}」を比較し、それぞれどんな人におすすめかを解説します。`,
    };
  }
  return null;
}

const today = new Date().toISOString().slice(0, 10);
const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
let fixedCount = 0;

for (const file of files) {
  const path = resolve(ARTICLES_DIR, file);
  const article = JSON.parse(readFileSync(path, "utf-8"));
  const products = loadProducts(article.category);
  const articleProducts = productsInArticle(article, products);

  // 「生の商品名」「クリーニング済み商品名」→「短縮名」の置換ペア（長い順に適用）
  const replacements = [];
  for (const p of articleProducts) {
    const short = shortProductName(p.name);
    if (p.name !== short) replacements.push([p.name, short]);
    const cleaned = cleanProductName(p.name);
    if (cleaned !== short && cleaned !== p.name) replacements.push([cleaned, short]);
  }
  replacements.sort((a, b) => b[0].length - a[0].length);

  const before = JSON.stringify(article);

  // 1. テーマ別テンプレートで title/description を再構築
  const rebuilt = rebuildMeta(article, articleProducts);
  if (rebuilt) {
    article.title = rebuilt.title;
    article.description = rebuilt.description;
  } else {
    article.title = cleanText(article.title, replacements);
    article.description = cleanText(article.description, replacements);
  }
  article.description = clampDescription(article.description);

  // 2. 本文ブロックのテキストをクリーニング
  for (const block of article.blocks ?? []) {
    if (typeof block.text === "string") block.text = cleanText(block.text, replacements);
    if (typeof block.note === "string") block.note = cleanText(block.note, replacements);
    if (Array.isArray(block.items)) block.items = block.items.map((it) => cleanText(it, replacements));
  }

  if (JSON.stringify(article) === before) continue;

  article.updatedAt = today;
  fixedCount++;
  console.log(`修正: ${file}`);
  console.log(`  title: ${article.title}`);
  console.log(`  description(${article.description.length}字): ${article.description.slice(0, 80)}…`);
  if (!DRY_RUN) writeFileSync(path, JSON.stringify(article, null, 2) + "\n", "utf-8");
}

console.log(`\n完了: ${fixedCount}/${files.length} 記事を${DRY_RUN ? "修正対象として検出（--dry: 未書き込み）" : "修正"}しました。`);
