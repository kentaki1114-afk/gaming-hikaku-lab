/**
 * auto-category.mjs
 *
 * 記事（data/articles/*.json）を走査し、2件以上の記事があるのに
 * ランキングページ（app/[slug]/page.tsx）が存在しないカテゴリを検出して
 * 自動的にページ・製品データを生成する。
 *
 * 実行タイミング: package.json の predev / prebuild から自動呼び出し。
 * 手動実行:      node scripts/auto-category.mjs
 * ドライラン:    node scripts/auto-category.mjs --dry-run
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join } from "path";
import { searchItems, sleep } from "./lib/rakuten.mjs";
import CATEGORY_CONFIG from "./category-config.mjs";

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, "data", "articles");
const PRODUCTS_DIR = join(ROOT, "data", "products");
const APP_DIR = join(ROOT, "app");
const CATEGORIES_JSON = join(ROOT, "data", "categories.json");

const THRESHOLD = 2; // この件数以上の記事があれば新カテゴリを生成
const DRY_RUN = process.argv.includes("--dry-run");

// ── Tailwindのカラーテーマ定義 ────────────────────────────────────────────
const COLOR_THEMES = {
  violet: { nav: "text-violet-400", badge1: "bg-violet-600/20 text-violet-300 border-violet-500/30", accentBorder: "hover:border-violet-500/40", pointBg: "bg-violet-900/20 border-violet-700/30", updateBadge: "bg-violet-600/20 text-violet-300 border-violet-500/30" },
  rose:   { nav: "text-rose-400",   badge1: "bg-rose-600/20 text-rose-300 border-rose-500/30",     accentBorder: "hover:border-rose-500/40",   pointBg: "bg-rose-900/20 border-rose-700/30",   updateBadge: "bg-rose-600/20 text-rose-300 border-rose-500/30"   },
  cyan:   { nav: "text-cyan-400",   badge1: "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",     accentBorder: "hover:border-cyan-500/40",   pointBg: "bg-cyan-900/20 border-cyan-700/30",   updateBadge: "bg-cyan-600/20 text-cyan-300 border-cyan-500/30"   },
  yellow: { nav: "text-yellow-400", badge1: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30", accentBorder: "hover:border-yellow-500/40", pointBg: "bg-yellow-900/20 border-yellow-700/30", updateBadge: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30" },
  orange: { nav: "text-orange-400", badge1: "bg-orange-600/20 text-orange-300 border-orange-500/30", accentBorder: "hover:border-orange-500/40", pointBg: "bg-orange-900/20 border-orange-700/30", updateBadge: "bg-orange-600/20 text-orange-300 border-orange-500/30" },
  blue:   { nav: "text-blue-400",   badge1: "bg-blue-600/20 text-blue-300 border-blue-500/30",     accentBorder: "hover:border-blue-500/40",   pointBg: "bg-blue-900/20 border-blue-700/30",   updateBadge: "bg-blue-600/20 text-blue-300 border-blue-500/30"   },
  green:  { nav: "text-green-400",  badge1: "bg-green-600/20 text-green-300 border-green-500/30",   accentBorder: "hover:border-green-500/40",  pointBg: "bg-green-900/20 border-green-700/30",  updateBadge: "bg-green-600/20 text-green-300 border-green-500/30"  },
  purple: { nav: "text-purple-400", badge1: "bg-purple-600/20 text-purple-300 border-purple-500/30", accentBorder: "hover:border-purple-500/40", pointBg: "bg-purple-900/20 border-purple-700/30", updateBadge: "bg-purple-600/20 text-purple-300 border-purple-500/30" },
  indigo: { nav: "text-indigo-400", badge1: "bg-indigo-600/20 text-indigo-300 border-indigo-500/30", accentBorder: "hover:border-indigo-500/40", pointBg: "bg-indigo-900/20 border-indigo-700/30", updateBadge: "bg-indigo-600/20 text-indigo-300 border-indigo-500/30" },
  teal:   { nav: "text-teal-400",   badge1: "bg-teal-600/20 text-teal-300 border-teal-500/30",     accentBorder: "hover:border-teal-500/40",   pointBg: "bg-teal-900/20 border-teal-700/30",   updateBadge: "bg-teal-600/20 text-teal-300 border-teal-500/30"   },
  amber:  { nav: "text-amber-400",  badge1: "bg-amber-600/20 text-amber-300 border-amber-500/30",   accentBorder: "hover:border-amber-500/40",  pointBg: "bg-amber-900/20 border-amber-700/30",  updateBadge: "bg-amber-600/20 text-amber-300 border-amber-500/30"  },
};

const BADGE_COLORS = [
  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "bg-slate-500/20 text-slate-300 border-slate-500/30",
  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30",
];
const RANK_COLORS = ["text-amber-400", "text-slate-400", "text-orange-400", "text-blue-400", "text-purple-400"];

const BADGE_LABELS = ["編集部イチオシ", "高コスパ", "バランス型", "定番人気", "玄人向け"];

const NG_WORDS = ["保護フィルム", "保護フィルター", "ガラスフィルム", "液晶保護", "カバー", "ケース", "中古", "ジャンク", "互換", "ステッカー"];

function isGenuineProduct(name) {
  const normalized = name.replace(/[\s　]/g, "");
  return !NG_WORDS.some((ng) => normalized.includes(ng.replace(/[\s　]/g, "")));
}

// ── ランキングページ TSX テンプレート生成 ───────────────────────────────────
function generatePageTsx(config, products) {
  const theme = COLOR_THEMES[config.accentColor] || COLOR_THEMES.violet;
  const pageName = config.slug.charAt(0).toUpperCase() + config.slug.slice(1).replace(/-./g, (m) => m[1].toUpperCase());

  const editorialsCode = products.slice(0, 5).map((p, i) => `  {
    keyword: ${JSON.stringify(p.keyword)},
    badge: ${JSON.stringify(BADGE_LABELS[i] || `第${i + 1}位`)},
    badgeColor: ${JSON.stringify(BADGE_COLORS[i])},
    rankColor: ${JSON.stringify(RANK_COLORS[i])},
    score: ${(4.8 - i * 0.1).toFixed(1)},
    // TODO: おすすめポイント・メリット・デメリットを実際の使用感に基づいて編集してください
    point: "（おすすめポイントをここに入力してください）",
    pros: ["特徴1", "特徴2", "特徴3"],
    cons: ["注意点1", "注意点2"],
    specs: [
      { label: "スペック1", value: "値1" },
      { label: "スペック2", value: "値2" },
    ],
  }`).join(",\n");

  const choosingGuideCode = (config.choosingGuide || []).map((g) => `        <div>
            <h3 className="font-semibold text-white mb-1">${g.title}</h3>
            <p>${g.body}</p>
          </div>`).join("\n");

  const faqsCode = (config.faqs || []).map((f) => `    {
      question: ${JSON.stringify(f.question)},
      answer: ${JSON.stringify(f.answer)},
    }`).join(",\n");

  return `// ⚠️ このファイルは auto-category.mjs によって自動生成されました（${new Date().toLocaleDateString("ja-JP")}）
// pros / cons / specs / point / authorComment を実際の使用感に基づいてカスタマイズしてください。

import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";

export const metadata: Metadata = {
  title: "${config.title}おすすめランキング${new Date().getFullYear()} | ゲーミング比較ラボ",
  description: ${JSON.stringify(config.description)},
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
${editorialsCode}
];

export default function ${pageName}Page() {
  const { items, updatedAt } = getProducts("${config.slug}");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "${config.title}おすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: \`\${SITE_ORIGIN}/${config.slug}\`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "JPY",
          url: product.affiliateUrl,
        },
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "${config.title}ランキング", item: \`\${SITE_ORIGIN}/${config.slug}\` },
    ],
  };

  const faqs: Faq[] = [
${faqsCode}
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="${theme.nav}">${config.title}ランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block ${theme.updateBadge} text-xs font-semibold px-3 py-1 rounded-full border mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ${config.title}<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          ${config.categoryDescription}
          価格・在庫情報は楽天市場の最新データを自動取得しています。
        </p>
      </div>

      <AuthorCard comment=${JSON.stringify(config.authorComment)} />

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="${theme.accentBorder}"
            pointBg="${theme.pointBg}"
          />
        ))}
      </div>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">${config.title}の選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
${choosingGuideCode}
        </div>
      </section>
      <FaqSection faqs={faqs} />
    </div>
  );
}
`;
}

// ── メイン処理 ───────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔍 auto-category: カテゴリチェック開始" + (DRY_RUN ? " [ドライラン]" : ""));

  // 1. 記事を走査してカテゴリ別カウント
  const articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const counts = {};
  for (const file of articleFiles) {
    try {
      const article = JSON.parse(readFileSync(join(ARTICLES_DIR, file), "utf-8"));
      if (article.category) counts[article.category] = (counts[article.category] || 0) + 1;
    } catch { /* skip */ }
  }

  // 2. 既存カテゴリリスト
  const existingCategories = JSON.parse(readFileSync(CATEGORIES_JSON, "utf-8"));
  const existingSlugs = new Set(existingCategories.map((c) => c.slug));

  // 3. 新カテゴリ候補を抽出
  const newCandidates = Object.entries(counts)
    .filter(([slug, count]) => count >= THRESHOLD && !existingSlugs.has(slug))
    .map(([slug, count]) => ({ slug, count }));

  if (newCandidates.length === 0) {
    console.log("✅ 新しいカテゴリは検出されませんでした。\n");
    return;
  }

  console.log(`\n🆕 新カテゴリ候補: ${newCandidates.map((c) => `${c.slug}(${c.count}件)`).join(", ")}`);

  for (const { slug } of newCandidates) {
    const config = CATEGORY_CONFIG[slug];

    if (!config) {
      console.log(`\n⚠️  [${slug}] category-config.mjs に設定がありません。`);
      console.log(`   scripts/category-config.mjs に ${slug} の設定を追加してから再実行してください。`);
      continue;
    }

    console.log(`\n📦 [${slug}] ${config.title} を生成します...`);

    // 3a. 製品データを取得
    const productsPath = join(PRODUCTS_DIR, `${slug}.json`);
    let fetchedProducts = [];

    if (!existsSync(productsPath)) {
      if (DRY_RUN) {
        console.log(`   [ドライラン] data/products/${slug}.json を生成します`);
        fetchedProducts = config.keywords.slice(0, 5).map((kw, i) => ({ rank: i + 1, keyword: kw }));
      } else {
        console.log(`   楽天APIで製品データを取得中...`);
        const results = [];
        for (let i = 0; i < config.keywords.length; i++) {
          const keyword = config.keywords[i];
          process.stdout.write(`     [${i + 1}/${config.keywords.length}] ${keyword} ... `);
          try {
            let items = await searchItems(keyword, 10);
            if (items.length === 0) { await sleep(2500); items = await searchItems(keyword, 10); }
            const item = items.find((it) => isGenuineProduct(it.name));
            if (!item) { console.log("ヒットなし"); continue; }
            results.push({ rank: results.length + 1, keyword, ...item });
            console.log(`OK: ${item.name.slice(0, 35)}...`);
          } catch (err) {
            console.log(`エラー: ${err.message}`);
          }
          await sleep(2000);
        }
        fetchedProducts = results;
        writeFileSync(
          productsPath,
          JSON.stringify({ category: slug, title: config.title, updatedAt: new Date().toISOString(), items: fetchedProducts }, null, 2),
          "utf-8"
        );
        console.log(`   ✅ data/products/${slug}.json 保存 (${fetchedProducts.length}件)`);
      }
    } else {
      const existing = JSON.parse(readFileSync(productsPath, "utf-8"));
      fetchedProducts = existing.items;
      console.log(`   data/products/${slug}.json は既に存在します (${fetchedProducts.length}件)`);
    }

    // 3b. ページ TSX を生成
    const pageDir = join(APP_DIR, slug);
    const pagePath = join(pageDir, "page.tsx");

    if (!existsSync(pagePath)) {
      const tsx = generatePageTsx(config, fetchedProducts);
      if (DRY_RUN) {
        console.log(`   [ドライラン] app/${slug}/page.tsx を生成します`);
      } else {
        mkdirSync(pageDir, { recursive: true });
        writeFileSync(pagePath, tsx, "utf-8");
        console.log(`   ✅ app/${slug}/page.tsx 生成完了`);
      }
    } else {
      console.log(`   app/${slug}/page.tsx は既に存在します`);
    }

    // 3c. data/categories.json に追加
    if (!DRY_RUN) {
      existingCategories.push({
        slug: config.slug,
        title: config.title,
        navLabel: config.navLabel,
        navLabelShort: config.navLabelShort,
        accentColor: config.accentColor,
      });
      writeFileSync(CATEGORIES_JSON, JSON.stringify(existingCategories, null, 2), "utf-8");
      existingSlugs.add(slug);
      console.log(`   ✅ data/categories.json を更新しました`);
    } else {
      console.log(`   [ドライラン] data/categories.json に ${slug} を追加します`);
    }

    // 3d. scripts/fetch-products.mjs の CATEGORIES にも追加
    const fetchScript = join(ROOT, "scripts", "fetch-products.mjs");
    const fetchContent = readFileSync(fetchScript, "utf-8");
    if (!fetchContent.includes(`  ${slug}:`)) {
      const insertBefore = "};"; // CATEGORIES オブジェクトの末尾
      const newEntry = `  ${slug}: {\n    title: ${JSON.stringify(config.title)},\n    keywords: ${JSON.stringify(config.keywords, null, 6).replace(/\n/g, "\n    ")},\n  },\n`;
      if (!DRY_RUN) {
        const lastIndex = fetchContent.lastIndexOf(insertBefore);
        if (lastIndex !== -1) {
          const updated = fetchContent.slice(0, lastIndex) + newEntry + fetchContent.slice(lastIndex);
          writeFileSync(fetchScript, updated, "utf-8");
          console.log(`   ✅ scripts/fetch-products.mjs に ${slug} を追加しました`);
        }
      } else {
        console.log(`   [ドライラン] scripts/fetch-products.mjs に ${slug} を追加します`);
      }
    }

    console.log(`\n🎉 [${slug}] ${config.title} の生成が完了しました！`);
    console.log(`   次のステップ: app/${slug}/page.tsx の pros/cons/specs/point をカスタマイズしてください。`);
  }

  console.log("\n✅ auto-category 完了。\n");
}

main().catch((err) => {
  console.error("❌ auto-category エラー:", err.message);
  process.exit(1);
});
