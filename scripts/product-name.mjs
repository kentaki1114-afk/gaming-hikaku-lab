// 商品名クリーニングの共有ヘルパー。
// 楽天の商品名には「【スーパーSALE】」「【税込送料無料】」のようなセール文言が
// 先頭に付くことが多く、そのまま記事のtitle/descriptionに使うと検索結果の表示が壊れる。
// SERPに出るメタ情報（title・description・h2見出し）では必ずクリーニング後の名前を使うこと。
// 利用箇所: generate-articles.mjs（生成時）/ fix-article-meta.mjs（既存記事の修復）

/** セール文言・型番括弧を除去し、空白を正規化した商品名を返す */
export function cleanProductName(name) {
  return String(name ?? "")
    .replace(/【[^】]*】/g, " ") // 【スーパーSALE】等のセール文言
    .replace(/\[[^\]]*\]/g, " ") // [型番表記] 等
    .replace(/\s+/g, " ")
    .trim();
}

/** タイトル・見出し用の短い商品名。クリーニング後、単語境界でmaxChars文字以内に切り詰める */
export function shortProductName(name, maxChars = 24) {
  const cleaned = cleanProductName(name);
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace >= 8 ? cut.slice(0, lastSpace) : cut).trim();
}

/** meta description をmaxChars字以内に収める（超過分は末尾を省略記号に） */
export function clampDescription(desc, maxChars = 160) {
  return desc.length <= maxChars ? desc : `${desc.slice(0, maxChars - 1)}…`;
}
