import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/categories";
import { getProducts, type Product } from "@/lib/products";
import { ArticleProductCard } from "@/app/components/ArticleProductCard";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";

// 「PS5 周辺機器 おすすめ」「ゲーミングデバイス おすすめ」「ゲーム用品」など
// 複数カテゴリ横断の検索クエリを受けるピラーページ。
// 各カテゴリの詳細ランキングページへ内部リンクを張るハブとして機能する。

export const metadata: Metadata = {
  title: "PS5・Xbox周辺機器おすすめ総まとめ2026｜ゲーミングデバイス7カテゴリ比較 | ゲーミング比較ラボ",
  description:
    "PS5・Xbox対応のゲーミングデバイス（ゲーム用品）を7カテゴリ横断で総まとめ。コントローラー・ヘッドセット・モニター・キーボード・マウス・チェア・キャプチャーボードのおすすめと、揃える優先順位を解説します。",
  alternates: { canonical: "/ps5-accessories" },
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.com";

// カテゴリslug → このページでの見出し・リード文（検索語句に寄せた表現にする）
const SECTIONS: Record<string, { heading: string; lead: string }> = {
  controllers: {
    heading: "ゲーミングコントローラーのおすすめ",
    lead: "操作の土台になる最重要デバイス。FPSで勝ちたいなら背面ボタン付きのプロコン、まずは純正の使い心地を知りたいなら標準モデルがおすすめです。",
  },
  headsets: {
    heading: "ゲーミングヘッドセットのおすすめ",
    lead: "足音・銃声の方向が分かるだけで勝率が変わります。PS5の3Dオーディオ対応モデルや、長時間でも疲れにくい軽量ワイヤレスが人気です。",
  },
  monitors: {
    heading: "ゲーミングモニターのおすすめ",
    lead: "PS5・Xboxの120fps出力を活かすには144Hz対応モニターが必須。応答速度1ms・HDMI 2.1対応かどうかが選びの分かれ目です。",
  },
  keyboards: {
    heading: "ゲーミングキーボードのおすすめ",
    lead: "PCも併用するキーマウ勢に。打鍵感を決めるスイッチ（軸）と、デスクを広く使えるテンキーレス（TKL）かどうかをまず決めましょう。",
  },
  mice: {
    heading: "ゲーミングマウスのおすすめ",
    lead: "エイムの精度に直結するデバイス。FPS用途なら軽量ワイヤレス＋高精度センサーの組み合わせが現在の主流です。",
  },
  chairs: {
    heading: "ゲーミングチェアのおすすめ",
    lead: "長時間プレイの腰・背中を守る投資。ランバーサポートの有無と、レザーかファブリックかの素材選びがポイントです。",
  },
  capture: {
    heading: "キャプチャーボードのおすすめ",
    lead: "PS5・Xboxの配信や録画に必須の機材。遅延なくプレイしながら録画できる「パススルー対応」モデルを選びましょう。",
  },
};

const DEFAULT_SECTION = {
  heading: "のおすすめ",
  lead: "PS5・Xbox向けのおすすめモデルをランキング形式で比較しています。",
};

const FAQS: Faq[] = [
  {
    question: "PS5の周辺機器は何から揃えるべきですか？",
    answer:
      "ゲーム体験への影響が大きい順に、①コントローラー（操作性）→②ヘッドセット（音の情報量）→③モニター（120fps対応）の順がおすすめです。チェアやキャプチャーボードはプレイ時間や配信の予定に応じて後から追加すれば十分です。",
  },
  {
    question: "PS5とXboxで周辺機器は共用できますか？",
    answer:
      "ヘッドセット・モニター・チェア・キャプチャーボードは多くの場合両方で使えます。一方、コントローラーは基本的に互換性がなく、それぞれ専用のものが必要です。購入前に対応プラットフォームを必ず確認しましょう。",
  },
  {
    question: "ゲーミングデバイス一式を揃える予算はどのくらい必要ですか？",
    answer:
      "コスパ重視なら合計5〜8万円程度（純正コントローラー＋1万円前後のヘッドセット＋3万円台のモニター）で一通り揃います。本格派構成ならプロコン・ハイエンドヘッドセット・4K/144Hzモニターで合計15万円以上が目安です。",
  },
  {
    question: "ゲーム用品はどこで買うのが安いですか？",
    answer:
      "楽天市場・Amazonなどの大手ECはセール時の割引やポイント還元が大きく、型番を指定して買うなら有力です。当サイトのランキングは楽天市場の最新価格を毎日自動取得しているので、相場の確認にも使えます。",
  },
];

export default function Ps5AccessoriesPage() {
  const categories = getAllCategories();
  // 各カテゴリの1位商品（rank順の先頭）をピックアップ
  const picks = categories
    .map((cat) => {
      try {
        const { items, updatedAt } = getProducts(cat.slug);
        const top: Product | undefined = items[0];
        return top ? { cat, top, updatedAt } : null;
      } catch {
        return null;
      }
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  const latestUpdatedAt = picks
    .map((p) => p.updatedAt)
    .sort()
    .at(-1);

  // 7カテゴリのランキングページを束ねる ItemList（ハブページであることを伝える）
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PS5・Xbox周辺機器おすすめ総まとめ",
    itemListElement: categories.map((cat, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${cat.title}おすすめランキング`,
      url: `${SITE_ORIGIN}/${cat.slug}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "周辺機器まとめ", item: `${SITE_ORIGIN}/ps5-accessories` },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link> &gt;{" "}
        <span className="text-violet-400">周辺機器まとめ</span>
      </nav>

      <div className="mb-10">
        {latestUpdatedAt ? (
          <span className="inline-block bg-violet-600/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30 mb-4">
            {new Date(latestUpdatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
          </span>
        ) : null}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xbox周辺機器<br className="md:hidden" />おすすめ総まとめ【2026年版】
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          コントローラーからキャプチャーボードまで、PS5・Xbox向けゲーミングデバイス（ゲーム用品）を7カテゴリ横断でまとめました。
          各カテゴリの「今いちばんおすすめの一台」と選び方の要点を紹介します。じっくり比較したい方は各カテゴリのランキングページをご覧ください。
          価格・在庫情報は楽天市場の最新データを毎日自動取得しています。
        </p>
      </div>

      {/* 揃える優先順位 */}
      <section className="mb-12 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-4">周辺機器を揃える優先順位</h2>
        <ol className="space-y-3 text-slate-300 text-sm leading-relaxed list-none">
          {[
            { rank: "1", text: "コントローラー — 毎秒触れる操作の土台。プレイの快適さに最も直結する" },
            { rank: "2", text: "ヘッドセット — 足音・方向の情報量が増え、FPSの勝率に直接効く" },
            { rank: "3", text: "モニター — PS5・Xboxの120fps出力は144Hz対応モニターがないと活かせない" },
            { rank: "4", text: "チェア — 長時間プレイするなら腰・背中を守る投資として優先度が上がる" },
            { rank: "5", text: "キーボード・マウス／キャプチャーボード — PC併用派・配信を始めたい人向け" },
          ].map((item) => (
            <li key={item.rank} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 text-xs font-bold flex items-center justify-center">
                {item.rank}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* カテゴリ別ベストピック */}
      <div className="space-y-12">
        {picks.map(({ cat, top }) => {
          const section = SECTIONS[cat.slug] ?? { ...DEFAULT_SECTION, heading: `${cat.title}${DEFAULT_SECTION.heading}` };
          return (
            <section key={cat.slug}>
              <h2 className="text-2xl font-bold text-white mb-3">{section.heading}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-2 max-w-3xl">{section.lead}</p>
              <ArticleProductCard product={top} note={`${cat.title}カテゴリの現在の人気No.1モデルです。`} />
              <Link
                href={`/${cat.slug}`}
                className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium"
              >
                {cat.title}おすすめランキングをすべて見る →
              </Link>
            </section>
          );
        })}
      </div>

      <FaqSection faqs={FAQS} />

      <AuthorCard comment="周辺機器は「全部一気に最高級」より、コントローラー→ヘッドセット→モニターの順に1つずつ上げていくのが満足度の高い揃え方です。私自身もこの順番でアップグレードしてきました。" />
    </div>
  );
}
