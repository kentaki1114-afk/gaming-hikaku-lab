import { readFileSync } from "fs";
import { resolve } from "path";
import https from "https";

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const content = readFileSync(path, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

const env = { ...loadEnvLocal(), ...process.env };

const APP_ID = env.RAKUTEN_APP_ID;
const ACCESS_KEY = env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = env.RAKUTEN_AFFILIATE_ID;

if (!APP_ID || !ACCESS_KEY) {
  throw new Error("RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が設定されていません（.env.local を確認してください）");
}

function requestJson(path) {
  return new Promise((resolvePromise, reject) => {
    const options = {
      hostname: "openapi.rakuten.co.jp",
      path,
      method: "GET",
      headers: {
        Origin: SITE_ORIGIN,
        Referer: `${SITE_ORIGIN}/`,
        "User-Agent": "Mozilla/5.0 (compatible; GamingHikakuLabBot/1.0)",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.error || json.errors) {
            reject(new Error(`楽天APIエラー: ${JSON.stringify(json.error || json.errors)}`));
            return;
          }
          resolvePromise(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

/**
 * 商品をキーワード検索し、サイト掲載用の形に整形して返す
 * @param {string} keyword 検索キーワード
 * @param {number} hits 取得件数（最大30）
 */
export async function searchItems(keyword, hits = 5) {
  const params = new URLSearchParams({
    format: "json",
    keyword,
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    affiliateId: AFFILIATE_ID ?? "",
    hits: String(hits),
    sort: "-reviewCount",
    imageFlag: "1",
  });
  const path = `/ichibams/api/IchibaItem/Search/20220601?${params.toString()}`;
  const json = await requestJson(path);

  return (json.Items ?? []).map(({ Item }) => ({
    name: Item.itemName,
    price: Item.itemPrice,
    priceLabel: `¥${Number(Item.itemPrice).toLocaleString()}`,
    imageUrl: (Item.mediumImageUrls?.[0]?.imageUrl ?? "").replace(/\?_ex=\d+x\d+$/, ""),
    affiliateUrl: Item.affiliateUrl || Item.itemUrl,
    itemUrl: Item.itemUrl,
    shopName: Item.shopName,
    reviewAverage: Item.reviewAverage,
    reviewCount: Item.reviewCount,
  }));
}

// API呼び出し間隔（楽天APIはレート制限があるため間隔を空ける）
export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
