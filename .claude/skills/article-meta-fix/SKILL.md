---
name: article-meta-fix
description: 自動生成記事のtitle・description・見出しから楽天商品名由来のセール文言(【スーパーSALE】【送料無料】等)を除去し、descriptionを160字以内に正規化するスキル。seo-auditで「description超過」や「titleにセール文言混入」のWARNが出たとき、検索結果のタイトル表示が崩れていると報告されたとき、generate-articles.mjsやfetch-products.mjsを変更した後の検証時に使う。
---

# 記事メタ修復スキル

ゲーミング比較ラボの記事は `scripts/generate-articles.mjs` が楽天APIの商品データから毎日自動生成する。
楽天の商品名には「【スーパーSALE】」「【税込送料無料】」のようなセール文言が付くため、
そのままtitle/descriptionに使うと検索結果(SERP)の表示が壊れ、descriptionが160字を超える。

## 仕組み(3層の防御)

| 層 | ファイル | 役割 |
|---|---|---|
| 予防 | `scripts/generate-articles.mjs` + `scripts/product-name.mjs` | 生成時に `shortProductName()` で短縮名を使い、`clampDescription()` で160字以内に収める |
| 検知 | `scripts/seo-audit.mjs` (項目3) | description超過・titleへのセール文言混入をWARNとして検出 |
| 修復 | `scripts/fix-article-meta.mjs` | 既存記事JSONを一括修復(冪等) |

## 修復手順

```bash
# 1. まず変更内容を確認(書き込みなし)
node scripts/fix-article-meta.mjs --dry

# 2. 問題なければ本実行
node scripts/fix-article-meta.mjs

# 3. WARNが消えたか確認
node scripts/seo-audit.mjs
```

fix-article-meta.mjs がやること:
- slugからテーマ(selectionguide / headtohead)を判定し、title/descriptionを短縮商品名でテンプレート再構築
- 全テキストブロックで生の商品名→短縮名に置換、残った【...】を除去(markdownリンクの `[]` には触らない)
- 修正した記事の `updatedAt` を当日に更新(sitemapのlastModifiedへ反映)

## 注意点

- 商品名の短縮ルールを変えるときは `scripts/product-name.mjs` だけを修正する(生成側・修復側の両方から使われる共有モジュール)
- 修復スクリプトは `data/products/<category>.json` のkeywordで商品名を引くため、商品データが更新で入れ替わった後だと一部記事の商品が見つからず再構築をスキップする(その場合はクリーニングのみ適用される)
- 修復後は `npx next build` で記事ページが正常にプリレンダーされることを確認する
