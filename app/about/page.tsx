import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/categories";

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

export const metadata: Metadata = {
  title: "このサイトについて・編集方針 | ゲーミング比較ラボ",
  description: "ゲーミング比較ラボの編集方針・レビュー基準・運営者情報。Apex Legends プレデター・フォートナイト アンリアル達成のけんたきが実際にプレイして選んだゲーミングデバイスを紹介しています。",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${SITE_ORIGIN}/about`,
    title: "このサイトについて・編集方針 | ゲーミング比較ラボ",
    description: "ゲーミング比較ラボの編集方針・レビュー基準・運営者情報。",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "けんたき",
  description: "ゲーム歴10年以上。Apex Legends（パッドプレイ）でプレデター4シーズン維持、フォートナイト（キーボード&マウス）でアンリアル達成。複数のゲーム機・デバイスを長期間実際に使用した経験をもとにレビューを執筆。",
  url: `${SITE_ORIGIN}/about`,
  knowsAbout: [
    "ゲーミングデバイス",
    "PS5周辺機器",
    "ゲーミングヘッドセット",
    "ゲーミングコントローラー",
    "ゲーミングモニター",
    "Apex Legends",
    "フォートナイト",
  ],
  sameAs: [],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_ORIGIN },
    { "@type": "ListItem", position: 2, name: "このサイトについて", item: `${SITE_ORIGIN}/about` },
  ],
};

const REVIEW_CRITERIA = [
  {
    icon: "🎮",
    title: "実際のプレイ経験を重視",
    body: "スペック表だけで判断するのではなく、実際にゲームをプレイした際の体感（遅延・装着感・音質・操作感）を重視しています。特にFPS（Apex Legends・フォートナイト）でのガチプレイ目線での評価を行っています。",
  },
  {
    icon: "📊",
    title: "複数のデータソースで総合判断",
    body: "楽天市場・Amazonの実際の販売価格とユーザーレビュー数・評価点を参照しながら、編集部のスコア（5点満点）を設定しています。価格変動は楽天APIで毎日自動更新しています。",
  },
  {
    icon: "🔍",
    title: "メリット・デメリットを正直に記載",
    body: "アフィリエイト収入のために都合の良い情報だけを書くことはしません。実際に気になった点・デメリット・「こんな人には向かない」という情報も正直に記載しています。",
  },
  {
    icon: "🔄",
    title: "情報の定期更新",
    body: "商品価格・在庫情報は楽天APIを使って毎日自動更新しています。ランキングや記事の内容も定期的に見直し、新製品が出た際には順位を更新します。",
  },
  {
    icon: "⚡",
    title: "プラットフォーム別の実用性を評価",
    body: "「PS5で使えるか」「Switch携帯モードで使えるか」など、実際の使用シーン別の対応状況を確認してランキングを作成しています。カタログスペックではなく実際の互換性を重視しています。",
  },
];

export default function AboutPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link>
        {" "}&gt;{" "}
        <span className="text-slate-300">このサイトについて</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">
        このサイトについて
      </h1>

      {/* 運営者プロフィール */}
      <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-bold text-white mb-6">運営者プロフィール</h2>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white">
            K
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xl font-bold text-white">けんたき</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-3 py-0.5 font-semibold">
                Apex プレデター ×4
              </span>
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full px-3 py-0.5 font-semibold">
                フォートナイト アンリアル
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              ゲーム歴10年以上。PS5・Xbox・Switch・PCの全プラットフォームで複数タイトルを日常的にプレイしています。Apex Legends はパッドでプレデターを4シーズン維持、フォートナイトはキーボード&マウスでアンリアルを達成した実績があります。
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              ゲーミングデバイスは「スペックより実際の使い心地」が大事だと考えており、実際に長期間使い込んだ製品だけを自信を持っておすすめしています。このサイトでは自分が実際に経験した情報をもとに、あなたの「失敗しない買い物」をサポートすることを目標にしています。
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Apex Legends", value: "パッド / プレデター" },
            { label: "フォートナイト", value: "キーマウ / アンリアル" },
            { label: "使用機種", value: "PS5 / Xbox / Switch / PC" },
            { label: "ゲーム歴", value: "10年以上" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-700/50 rounded-lg p-3 text-center">
              <span className="block text-xs text-slate-400 mb-1">{label}</span>
              <span className="text-xs font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* サイト概要 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">ゲーミング比較ラボについて</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            「ゲーミング比較ラボ」は、PS5・Xbox・Switch・PCのゲーミング周辺機器を実際のプレイ経験をもとに比較・紹介するレビューサイトです。コントローラー・ヘッドセット・ゲーミングモニター・ゲーミングキーボード・マウス・ゲーミングチェア・キャプチャーボードの7カテゴリを扱っています。
          </p>
          <p>
            ゲーミングデバイスは「高ければ良い」わけでも「人気があれば合う」わけでもありません。自分のゲームスタイル・使う機種・予算によって最適解が変わります。このサイトはそれを明確にするための情報を提供することを目的としています。
          </p>
          <p>
            商品リンクには楽天アフィリエイトおよびAmazonアソシエイトを使用しています。購入された際にサイト運営費の一部をいただく場合がありますが、広告収入がランキングや評価に影響することはありません。
          </p>
        </div>
      </section>

      {/* レビュー基準 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">レビュー・評価基準</h2>
        <div className="space-y-4">
          {REVIEW_CRITERIA.map(({ icon, title, body }) => (
            <div key={title} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <span>{icon}</span>
                <span>{title}</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* スコア基準 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">評価スコアの基準（5点満点）</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { score: "4.8〜5.0", label: "傑作・最強候補", desc: "このカテゴリで最も満足度が高い製品" },
            { score: "4.5〜4.7", label: "非常に優秀", desc: "多くのユーザーに自信を持っておすすめできる" },
            { score: "4.2〜4.4", label: "優秀", desc: "コスパ・機能のバランスが良い" },
            { score: "4.0〜4.1", label: "良い", desc: "特定の用途・予算帯で光る製品" },
            { score: "3.5〜3.9", label: "普通", desc: "悪くはないが他に優れた選択肢がある" },
            { score: "〜3.4", label: "要検討", desc: "購入前に代替品と十分に比較を" },
          ].map(({ score, label, desc }) => (
            <div key={score} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-amber-400 font-bold">{score}</span>
                <span className="text-white text-sm font-semibold">{label}</span>
              </div>
              <p className="text-slate-400 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* カテゴリ一覧 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">取り扱いカテゴリ</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm px-4 py-2 rounded-xl transition-colors"
            >
              {cat.navLabel}
            </Link>
          ))}
        </div>
      </section>

      {/* お問い合わせ */}
      <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center">
        <h2 className="text-lg font-bold text-white mb-2">お問い合わせ</h2>
        <p className="text-slate-400 text-sm mb-4">
          掲載内容に誤りがある場合、または掲載削除のご要望は下記までお知らせください。
        </p>
        <a
          href="mailto:kentaki1114@gmail.com"
          className="inline-block bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
        >
          メールで問い合わせる
        </a>
      </section>
    </div>
  );
}
