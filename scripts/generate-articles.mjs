// 1日5本の記事を自動生成するスクリプト。
// data/products/*.json の実データ（画像・価格・アフィリエイトリンク付き）から商品を選び、
// あらかじめ用意したテーマ（選び方ガイド／比較／シーン別おすすめ）に当てはめて記事JSONを書き出す。
// 生成された記事は lib/articles.ts 経由で /articles/[slug] に自動表示される。
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const ROOT = process.cwd();
const PRODUCTS_DIR = resolve(ROOT, "data", "products");
const ARTICLES_DIR = resolve(ROOT, "data", "articles");

const CATEGORY_TITLES = {
  controllers: "コントローラー",
  headsets: "ヘッドセット",
  monitors: "ゲーミングモニター",
  keyboards: "ゲーミングキーボード",
  mice: "ゲーミングマウス",
  chairs: "ゲーミングチェア",
  capture: "キャプチャーボード",
};

const ARTICLES_PER_DAY = 5;

function loadProducts(category) {
  const raw = readFileSync(resolve(PRODUCTS_DIR, `${category}.json`), "utf-8");
  return JSON.parse(raw).items;
}

// 日付からシードを作り、同じ日に複数回実行しても同じ組み合わせになるようにする
// （翌日になれば自然に別の組み合わせが選ばれる）
function makeRng(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  const next = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
  // 近いシード同士でも序盤の出力が相関しないよう、生成直後に空打ちして拡散させる
  for (let i = 0; i < 8; i++) next();
  return next;
}

// FNV-1a ハッシュ：1文字違いでも出力が大きく変わるよう拡散させる
function seedFromString(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) || 1;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickTwoDistinct(rng, arr) {
  const a = pick(rng, arr);
  let b = pick(rng, arr);
  let guard = 0;
  while (b.keyword === a.keyword && guard < 10) {
    b = pick(rng, arr);
    guard++;
  }
  return [a, b];
}

// ---- 記事の型（テーマ）定義 ----
// それぞれのテーマは products から商品を選び、blocks（本文ブロック）を組み立てる関数
const THEMES = {
  selectionGuide: {
    label: "選び方ガイド",
    build(category, products, rng) {
      const [main, sub] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const title = `${catTitle}の選び方完全ガイド｜${main.name.split(" ")[0]}と${sub.name.split(" ")[0]}を例に解説`;
      const description = `${catTitle}選びで失敗しないためのチェックポイントを、人気モデル「${main.name}」「${sub.name}」を例にしながら解説します。`;
      const blocks = [
        { type: "paragraph", text: `${catTitle}は種類が多く、何を基準に選べばいいか迷ってしまう人も多いはずです。この記事では、購入前に確認しておきたいポイントを整理しながら、実際に人気の高いモデルを例に選び方のコツを紹介します。` },
        { type: "heading", text: "購入前に確認しておきたいポイント" },
        { type: "list", items: [
          "対応プラットフォーム（PS5・Xbox・PCのどれで使うか）",
          "価格と性能のバランス（必要な機能を見極める）",
          "長時間使用したときの快適さ（重さ・装着感・バッテリー）",
        ] },
        { type: "heading", text: `まず候補にしたい「${main.name}」` },
        { type: "paragraph", text: `価格・レビュー評価ともにバランスが良く、初めて検討する場合にも選びやすいモデルです。スペックや実際の価格は下記から確認できます。` },
        { type: "product", category, keyword: main.keyword, note: "価格・在庫状況は変動するため、購入前に最新情報を確認しておきましょう。" },
        { type: "heading", text: `比較候補としておすすめの「${sub.name}」` },
        { type: "paragraph", text: `先ほどのモデルと用途や特徴が異なるため、比較することで自分に合った基準が見えてきます。気になる場合は実際のレビューや価格もあわせてチェックしてみてください。` },
        { type: "product", category, keyword: sub.keyword, note: "用途や好みに応じて、上のモデルと比較しながら検討してみてください。" },
        { type: "heading", text: "まとめ" },
        { type: "paragraph", text: `${catTitle}選びは「対応機種」「価格と性能のバランス」「長時間使用時の快適さ」の3点を軸に考えると失敗しにくくなります。さらに詳しい比較情報は[ランキングページ](/${category})もあわせてご覧ください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "選び方", "比較"] };
    },
  },

  headToHead: {
    label: "比較レビュー",
    build(category, products, rng) {
      const [a, b] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const title = `「${a.name.split(" ")[0]}」と「${b.name.split(" ")[0]}」を徹底比較｜どちらを選ぶべき？`;
      const description = `人気${catTitle}「${a.name}」と「${b.name}」を比較し、それぞれどんな人におすすめかを解説します。`;
      const blocks = [
        { type: "paragraph", text: `今回は人気の高い${catTitle}「${a.name}」と「${b.name}」を比較しながら、それぞれどんなプレイスタイルの人に向いているのかを解説します。どちらを選ぶか迷っている人の参考になれば幸いです。` },
        { type: "heading", text: `「${a.name}」の特徴` },
        { type: "paragraph", text: `レビュー評価${a.reviewAverage ?? "高評価"}を獲得している人気モデルです。価格や販売状況は下記から確認できます。` },
        { type: "product", category, keyword: a.keyword, note: "まず最初の候補として検討したいモデルです。" },
        { type: "heading", text: `「${b.name}」の特徴` },
        { type: "paragraph", text: `先ほどのモデルとは異なる強みを持つ製品で、比較することで自分の優先順位が明確になります。` },
        { type: "product", category, keyword: b.keyword, note: "予算や用途に応じて、こちらも有力な候補になります。" },
        { type: "heading", text: "結局どちらを選ぶべき？" },
        { type: "paragraph", text: `価格をできるだけ抑えたい、あるいは特定の機能を重視したいなど、自分が何を優先するかによって最適な選択は変わってきます。両方の特徴を踏まえたうえで、[ランキングページ](/${category})も参考にしながら自分に合った一台を見つけてみてください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "比較", "レビュー"] };
    },
  },

  useCase: {
    label: "シーン別おすすめ",
    build(category, products, rng) {
      const scenarios = {
        controllers: ["FPSタイトルで勝率を上げたい人", "長時間のRPGプレイを快適にしたい人", "コスパ重視で初めての一台を探している人"],
        headsets: ["足音や銃声の方向を正確に聞き取りたいFPSプレイヤー", "長時間プレイでも疲れにくいヘッドセットを探している人", "PS5・Xboxを併用しているマルチプラットフォーム派"],
        monitors: ["PS5の120fps出力を活かしたいハイスペック志向の人", "コストを抑えつつ高リフレッシュレートを体験したい人", "映画やオープンワールド系で没入感を重視したい人"],
        keyboards: ["タイピングの打鍵感にこだわりたい人", "コンパクトなTKLレイアウトで省スペースにしたい人", "ワイヤレスでスッキリしたデスク環境を作りたい人"],
        mice: ["FPSで精密なエイムを追求したい人", "長時間プレイでも手が疲れにくいマウスを探している人", "軽量ワイヤレスでケーブルレスを実現したい人"],
        chairs: ["長時間ゲームをしても腰や背中が痛くなりにくい椅子を探している人", "部屋のインテリアに合うおしゃれなゲーミングチェアが欲しい人", "コスパ重視でゲーミングチェアを初めて購入したい人"],
        capture: ["PS5・XboxのゲームプレイをYouTubeやTwitchで配信したい人", "高画質4K映像をキャプチャして保存したい人", "手軽に配信を始めたい初心者向けキャプチャーボードを探している人"],
      };
      const scenario = pick(rng, scenarios[category] ?? scenarios.controllers);
      const [main, sub] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const title = `${scenario}向け${catTitle}おすすめ2選｜目的別に厳選`;
      const description = `「${scenario}」におすすめの${catTitle}を2つ厳選して紹介します。自分の目的に合った一台を見つける参考にしてください。`;
      const blocks = [
        { type: "paragraph", text: `${catTitle}選びは、自分がどんな場面で使うことが多いかを軸に考えると失敗しにくくなります。今回は「${scenario}」に向けて、特におすすめできる2モデルを紹介します。` },
        { type: "heading", text: `おすすめ①：${main.name}` },
        { type: "paragraph", text: `この用途においてバランスの良い性能を備えたモデルです。価格や販売状況は下記から確認できます。` },
        { type: "product", category, keyword: main.keyword, note: `「${scenario}」に適した特徴を持つモデルです。` },
        { type: "heading", text: `おすすめ②：${sub.name}` },
        { type: "paragraph", text: `予算やこだわりたいポイントによっては、こちらのモデルも有力な選択肢になります。` },
        { type: "product", category, keyword: sub.keyword, note: "用途や予算に応じて、上のモデルと比較しながら検討してみてください。" },
        { type: "heading", text: "まとめ" },
        { type: "paragraph", text: `「${scenario}」を想定するなら、上記の2モデルはどちらも有力な候補です。より幅広い製品を比較したい場合は[ランキングページ](/${category})もあわせてチェックしてみてください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "シーン別", "おすすめ"] };
    },
  },
};

const THEME_KEYS = Object.keys(THEMES);
const CATEGORY_KEYS = Object.keys(CATEGORY_TITLES);

function slugify(category, themeKey, dateStr, index) {
  return `${category}-${themeKey}-${dateStr}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function todayDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function generateForDate(date) {
  const dateStr = todayDateStr(date);
  const productsByCategory = Object.fromEntries(CATEGORY_KEYS.map((c) => [c, loadProducts(c)]));

  if (!existsSync(ARTICLES_DIR)) mkdirSync(ARTICLES_DIR, { recursive: true });

  const created = [];
  for (let i = 0; i < ARTICLES_PER_DAY; i++) {
    const rng = makeRng(seedFromString(`${dateStr}-${i}`));
    const category = CATEGORY_KEYS[i % CATEGORY_KEYS.length];
    const themeKey = pick(rng, THEME_KEYS);
    const theme = THEMES[themeKey];
    const products = productsByCategory[category];

    const slug = slugify(category, themeKey, dateStr, i);
    const filePath = resolve(ARTICLES_DIR, `${slug}.json`);
    if (existsSync(filePath)) {
      console.log(`スキップ（既存）: ${slug}`);
      continue;
    }

    const { title, description, blocks, tags } = theme.build(category, products, rng);
    const article = {
      slug,
      title,
      description,
      category,
      publishedAt: dateStr,
      updatedAt: dateStr,
      tags,
      blocks,
    };

    writeFileSync(filePath, JSON.stringify(article, null, 2) + "\n", "utf-8");
    created.push(slug);
    console.log(`生成: ${slug}  [${theme.label} / ${CATEGORY_TITLES[category]}]`);
  }

  return created;
}

const created = generateForDate(new Date());
console.log(`\n完了: ${created.length}本の記事を新規生成しました。`);
