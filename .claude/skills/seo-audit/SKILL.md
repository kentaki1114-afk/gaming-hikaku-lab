---
name: seo-audit
description: ゲーミング比較ラボのSEO健全性を監査するスキル。canonical URL・構造化データ(JSON-LD)・記事と商品データの整合性(商品keyword参照切れ・slug不一致)・sitemap整合性・内部リンク(関連記事/パンくず)・画像alt属性・商品データ鮮度を一括チェックする。「SEOチェックして」「SEO監査」「検索順位対策の確認」と言われたとき、新カテゴリや記事を追加した後、自動生成パイプラインの変更後、デプロイ前の最終確認時に使う。
---

# SEO監査スキル

ゲーミング比較ラボ(gaming-hikaku-lab)のSEO状態を体系的にチェックする手順。

## ステップ1: 自動監査スクリプトを実行する

```bash
node scripts/seo-audit.mjs
```

このスクリプトは以下の7項目をチェックする(読み取り専用・依存パッケージ不要):

| # | 項目 | 検出する問題 |
|---|---|---|
| 1 | canonical URL | `alternates.canonical` 未設定のページ |
| 2 | 構造化データ | ItemList / BreadcrumbList / FAQPage / Article / WebSite JSON-LD の欠落 |
| 3 | 記事データ整合性 | slugとファイル名の不一致(404の原因)・slug重複・未登録カテゴリ・商品keyword参照切れ・description長(50〜160字推奨) |
| 4 | 商品データ品質 | 画像/アフィリエイトURL/価格の欠落、7日以上未更新のデータ(自動更新停止の兆候) |
| 5 | sitemap整合性 | categories.json ⇔ app/<slug>/page.tsx ⇔ data/products/<slug>.json の不一致 |
| 6 | 内部リンク | RelatedArticlesセクションやパンくず「ホーム」リンクの欠落 |
| 7 | 画像alt属性 | alt属性のない `<Image>` / `<img>` |

終了コード 1 = ERROR あり(必ず修正)。WARN は優先度を判断して対応。

## ステップ2: 結果の解釈と修正方針

- **ERROR は即修正**: canonical欠落・slug不一致・アフィリエイトURL欠落は検索流入と収益に直結する。
- **商品keyword参照切れ(WARN)**: 記事内の商品カードが描画されず空になる。`data/products/<category>.json` のkeywordと記事JSONの `blocks[].keyword` を一致させる。
- **description長すぎ(WARN)**: 検索結果で途切れる。記事JSONの `description` を50〜160字に要約し直す。自動生成記事で頻発する場合は生成プロンプト側(GitHub Actions)を修正する。
- **商品データ7日以上未更新(WARN)**: GitHub Actions の日次更新(21:00 JST)が止まっている。ワークフローの実行ログを確認する。

## ステップ3: ビルド検証(コード変更をした場合のみ)

```bash
npx tsc --noEmit
npx next build
```

`prebuild` で auto-category.mjs が走るため、新カテゴリの自動生成が意図せず発生していないかビルドログを確認する。

## ステップ4: スクリプトが見ない項目の手動確認(必要に応じて)

- **メタタイトル重複**: 各 `app/*/page.tsx` の `title` がページ間で重複していないか
- **OGP確認**: 主要ページの `openGraph` 設定(記事は `type: "article"` + publishedTime)
- **本番確認**: https://gaming-hikaku-lab.vercel.app/sitemap.xml と /robots.txt が返るか
- **リッチリザルト**: 変更した構造化データを https://search.google.com/test/rich-results で検証
- **Search Console**: カバレッジエラー・手動対策の有無(週1の定期確認)

## 新しいチェック項目の追加方針

サイト構造の変更でチェック項目が必要になったら `scripts/seo-audit.mjs` に追記する。
ok()/warn()/error() ヘルパーを使い、既存の7セクションの形式に合わせること。
