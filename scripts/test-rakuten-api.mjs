import { readFileSync } from "fs";
import { resolve } from "path";

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

const env = loadEnvLocal();
const appId = env.RAKUTEN_APP_ID;
const affiliateId = env.RAKUTEN_AFFILIATE_ID;
const accessKey = env.RAKUTEN_ACCESS_KEY;

if (!appId || appId.includes("ここに")) {
  console.error("RAKUTEN_APP_ID が設定されていません");
  process.exit(1);
}
if (!accessKey || accessKey.includes("ここに")) {
  console.error("RAKUTEN_ACCESS_KEY が設定されていません");
  process.exit(1);
}

const params = new URLSearchParams({
  format: "json",
  keyword: "DualSense Edge",
  applicationId: appId,
  accessKey: accessKey,
  affiliateId: affiliateId ?? "",
  hits: "3",
});

const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?${params.toString()}`;

const res = await fetch(url);
const data = await res.json();

if (data.error) {
  console.error("APIエラー:", data.error, data.error_description);
  process.exit(1);
}

console.log(`ヒット件数: ${data.count}`);
for (const wrapper of data.Items ?? []) {
  const item = wrapper.Item;
  console.log("---");
  console.log("商品名:", item.itemName);
  console.log("価格:", item.itemPrice);
  console.log("アフィリエイトURL有無:", Boolean(item.affiliateUrl));
  console.log("URL:", item.affiliateUrl || item.itemUrl);
}
