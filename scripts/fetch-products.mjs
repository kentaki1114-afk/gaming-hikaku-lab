import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { searchItems, sleep } from "./lib/rakuten.mjs";

// カテゴリごとの検索キーワード（1キーワード = ランキング1製品として扱う）
const CATEGORIES = {
  controllers: {
    title: "コントローラー",
    keywords: [
      "DualSense Edge コントローラー",
      "DualSense ワイヤレスコントローラー PS5",
      "Xbox Eliteコントローラー Series2",
      "SCUF Reflex Pro コントローラー",
      "8BitDo Ultimate Controller",
    ],
  },
  headsets: {
    title: "ヘッドセット",
    keywords: [
      "PULSE Elite ワイヤレスヘッドセット",
      "SteelSeries Arctis Nova Pro Wireless",
      "Astro A50X ヘッドセット",
      "HyperX Cloud Alpha Wireless",
      "Xbox ワイヤレス ヘッドセット 純正",
    ],
  },
  monitors: {
    title: "ゲーミングモニター",
    keywords: [
      "Acer Nitro ゲーミングモニター 27インチ IPS WQHD 200Hz",
      "JAPANNEXT 27インチ WQHD 165Hz IPSパネル ゲーミングモニター",
      "JAPANNEXT 27インチ 4K 165Hz IPSパネル ゲーミングモニター",
      "I-O DATA 144Hz対応27型ゲーミングモニター GigaCrysta",
      "Samsung Odyssey G5 C34G55T ウルトラワイド",
    ],
  },
  keyboards: {
    title: "ゲーミングキーボード",
    keywords: [
      "Logicool G913 TKL ゲーミングキーボード ワイヤレス",
      "Razer BlackWidow V4 Pro ゲーミングキーボード",
      "SteelSeries Apex Pro TKL ゲーミングキーボード",
      "HyperX Alloy Origins Core ゲーミングキーボード",
      "CORSAIR K70 RGB PRO ゲーミングキーボード",
    ],
  },
  mice: {
    title: "ゲーミングマウス",
    keywords: [
      "Razer DeathAdder V3 Pro ゲーミングマウス",
      "ASUS ROG Gladius III Wireless ゲーミングマウス",
      "Logicool G703h ゲーミングマウス",
      "SteelSeries Aerox ゲーミングマウス ワイヤレス",
    ],
  },
  chairs: {
    title: "ゲーミングチェア",
    keywords: [
      "AKRacing Pro-X V2 ゲーミングチェア",
      "DXRacer Formula Series ゲーミングチェア",
      "Secretlab TITAN Evo ゲーミングチェア",
      "GTRACING ゲーミングチェア GT002",
      "AKRacing Wolf ゲーミングチェア",
    ],
  },
  capture: {
    title: "キャプチャーボード",
    keywords: [
      "I-O DATA GV-USB3HD キャプチャーボード",
      "AVerMedia Live Gamer ULTRA 2.1 キャプチャーボード",
      "Razer Ripsaw HD キャプチャーボード",
      "Elgato HD60 ゲームキャプチャー",
      "AVerMedia Live Gamer Portable ゲームキャプチャー",
    ],
  },
};

// 商品名にこれらの語が含まれる結果は除外する(本体ではない付属品・中古品などのノイズ除去。空白の有無を無視して判定)
const NG_WORDS = ["保護フィルム", "保護フィルター", "ガラスフィルム", "液晶保護", "カバー", "ケース", "中古", "ジャンク", "互換", "スタンド単体", "ステッカー", "アーム"];

function isGenuineProduct(name) {
  const normalized = name.replace(/[\s　]/g, "");
  return !NG_WORDS.some((ng) => normalized.includes(ng.replace(/[\s　]/g, "")));
}

const outDir = resolve(process.cwd(), "data", "products");
mkdirSync(outDir, { recursive: true });

for (const [categoryKey, category] of Object.entries(CATEGORIES)) {
  console.log(`\n=== ${category.title} (${categoryKey}) ===`);
  const results = [];

  for (let i = 0; i < category.keywords.length; i++) {
    const keyword = category.keywords[i];
    process.stdout.write(`  [${i + 1}/${category.keywords.length}] 検索: ${keyword} ... `);
    try {
      let items = await searchItems(keyword, 10);
      if (items.length === 0) {
        // レート制限等で空が返ることがあるため、間を空けて1回だけ再試行する
        await sleep(2500);
        items = await searchItems(keyword, 10);
      }
      const item = items.find((it) => isGenuineProduct(it.name));
      if (!item) {
        console.log(`ヒットなし（${items.length}件中、本体商品なし）`);
        continue;
      }
      results.push({
        rank: results.length + 1,
        keyword,
        ...item,
      });
      console.log(`OK: ${item.name.slice(0, 40)}... (${item.priceLabel})`);
    } catch (err) {
      console.log(`エラー: ${err.message}`);
    }
    // 楽天APIのレート制限対策（間隔を広めに取る）
    await sleep(2000);
  }

  const outPath = resolve(outDir, `${categoryKey}.json`);
  writeFileSync(outPath, JSON.stringify({ category: categoryKey, title: category.title, updatedAt: new Date().toISOString(), items: results }, null, 2), "utf-8");
  console.log(`  → 保存: data/products/${categoryKey}.json (${results.length}件)`);
}

console.log("\n完了。");
