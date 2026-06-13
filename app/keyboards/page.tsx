import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { Suspense } from "react";
import type { Editorial } from "@/app/components/ProductRankingCard";
import { PlatformFilteredRanking, RankingList } from "@/app/components/PlatformFilteredRanking";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";
import { RelatedArticles } from "@/app/components/RelatedArticles";
import { buildItemListJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "ゲーミングキーボードおすすめランキング2026 | ゲーミング比較ラボ",
  description: "ゲーミングキーボードのおすすめランキング。Logicool G913・Razer BlackWidow・SteelSeries Apex Proなど人気モデルを徹底比較。",
  alternates: { canonical: "/keyboards" },
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "Logicool G913 TKL ゲーミングキーボード ワイヤレス",
    platforms: ["ps5", "xbox", "pc"],
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.7,
    point: "薄型・ワイヤレス・高級感の三拍子が揃ったTKLキーボード。長時間タイピングも快適。",
    pros: ["低遅延LIGHTSPEEDワイヤレス", "薄型GXスイッチで打鍵感◎", "最大40時間バッテリー", "コンパクトなTKLレイアウト"],
    cons: ["価格が高め", "テンキーなし"],
    specs: [
      { label: "接続方式", value: "ワイヤレス / USB" },
      { label: "スイッチ", value: "GX薄型メカニカル" },
    ],
  },
  {
    keyword: "Razer BlackWidow V4 Pro ゲーミングキーボード",
    platforms: ["ps5", "xbox", "pc"],
    badge: "高速入力最強",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    rankColor: "text-slate-400",
    score: 4.6,
    point: "Razer独自スイッチの軽快な打鍵感と高精度が人気。RGB演出も圧倒的。",
    pros: ["Razer独自メカニカルスイッチ", "マルチファンクションローラー搭載", "豊富なRGBカスタマイズ", "しっかりした打鍵感"],
    cons: ["フルサイズで場所を取る", "価格が高め"],
    specs: [
      { label: "接続方式", value: "USB有線" },
      { label: "スイッチ", value: "Razerメカニカル" },
    ],
  },
  {
    keyword: "SteelSeries Apex Pro TKL ゲーミングキーボード",
    platforms: ["ps5", "xbox", "pc"],
    badge: "アクチュエーション可変",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    rankColor: "text-orange-400",
    score: 4.5,
    point: "キー1つずつの反応深さを調整できる唯一無二の機能。FPSとMMO両立できる。",
    pros: ["アクチュエーションポイント調整対応", "OLED小型ディスプレイ搭載", "TKLで省スペース", "プロゲーマー使用率高"],
    cons: ["価格が最高クラス", "設定アプリが必要"],
    specs: [
      { label: "接続方式", value: "USB有線" },
      { label: "スイッチ", value: "OmniPointマグネットスイッチ" },
    ],
  },
  {
    keyword: "HyperX Alloy Origins Core ゲーミングキーボード",
    platforms: ["ps5", "xbox", "pc"],
    badge: "コスパ重視",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    rankColor: "text-red-400",
    score: 4.3,
    point: "HyperX製メカニカルを手頃な価格で体験できるコスパ最強モデル。FF14推奨。",
    pros: ["コスパが高い", "HyperX独自赤軸スイッチ", "アルミ合金ボディ", "FF14推奨周辺機器"],
    cons: ["ワイヤレス非対応", "マクロキーなし"],
    specs: [
      { label: "接続方式", value: "USB有線" },
      { label: "スイッチ", value: "HyperX赤軸" },
    ],
  },
  {
    keyword: "CORSAIR K70 RGB PRO ゲーミングキーボード",
    platforms: ["ps5", "xbox", "pc"],
    badge: "定番フルサイズ",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    rankColor: "text-yellow-400",
    score: 4.4,
    point: "コンパクト60%レイアウトでワイヤレス対応。ホットスワップ対応でキースイッチ交換も可能。",
    pros: ["ホットスワップ対応", "ワイヤレス対応60%モデル", "豊富なスイッチ選択肢", "CORSAIRエコシステム連携"],
    cons: ["テンキー・Fキーなし", "価格が高め"],
    specs: [
      { label: "接続方式", value: "ワイヤレス / USB" },
      { label: "レイアウト", value: "60%コンパクト" },
    ],
  },
];

export default function KeyboardsPage() {
  const { items, updatedAt } = getProducts("keyboards");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = buildItemListJsonLd(
    "ゲーミングキーボードおすすめランキング",
    SITE_ORIGIN,
    "/keyboards",
    merged
  );

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "ホーム", item: SITE_ORIGIN },
    { name: "キーボードランキング", item: `${SITE_ORIGIN}/keyboards` },
  ]);

  const faqs: Faq[] = [
    {
      question: "赤軸・青軸・茶軸の違いは何ですか？",
      answer: "赤軸はクリック感なし・静音で長時間タイピング向き、青軸はカチカチ音でタイピングの気持ちよさ重視、茶軸は両者の中間でゲームにも文字入力にも使いやすいバランス型です。ゲーム向けには赤軸が人気です。",
    },
    {
      question: "テンキーレスと通常サイズ、ゲームにはどちらが向いていますか？",
      answer: "ゲームにはテンキーレス（TKL）がおすすめです。マウスの可動域を広く取れるため、FPSなどで有利になります。数字入力が多い作業も兼ねる場合はフルサイズを検討しましょう。",
    },
    {
      question: "メカニカルとメンブレン、ゲームに向いているのはどちらですか？",
      answer: "ゲームにはメカニカルキーボードが向いています。キーごとに独立したスイッチで誤入力が少なく、同時押し（Nキーロールオーバー）への対応も優れています。メンブレンは静音・低価格が利点です。",
    },
    {
      question: "ゲーミングキーボードはPS5でも使えますか？",
      answer: "はい、PS5はUSBキーボードに対応しています。チャット入力やブラウザ操作に便利です。ただしゲームのキャラクター操作はコントローラーが基本で、キーボード操作に対応していないゲームも多いです。",
    },
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
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link> &gt; <span className="text-orange-400">ゲーミングキーボードランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-orange-600/20 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ゲーミングキーボード<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          FPS・MMO・配信など用途別に最適なゲーミングキーボードを、スイッチの種類・接続方式・価格の観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
        </p>
      </div>

      <Suspense fallback={<RankingList items={merged} accentBorder="hover:border-orange-500/40" pointBg="bg-orange-900/20 border-orange-700/30" />}>
        <PlatformFilteredRanking items={merged} accentBorder="hover:border-orange-500/40" pointBg="bg-orange-900/20 border-orange-700/30" />
      </Suspense>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">ゲーミングキーボードの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① スイッチの種類を確認</h3>
            <p>メカニカルスイッチの種類（赤軸・青軸・茶軸など）によって打鍵感・音が大きく変わります。静音重視なら赤軸・ピンク軸、クリック感重視なら青軸がおすすめです。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② レイアウト（サイズ）を決める</h3>
            <p>フルサイズ・TKL（テンキーレス）・60%コンパクトの3種類が主流です。省スペースならTKLか60%が人気。マウスの移動範囲も広くなりFPSに有利です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ 有線 vs ワイヤレス</h3>
            <p>遅延を気にするなら有線が安定ですが、最近のゲーミングワイヤレスは遅延も十分低く実用的です。デスクをスッキリさせたいならワイヤレスが快適です。</p>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />

      <RelatedArticles category="keyboards" />

      <AuthorCard comment="フォートナイトのアンリアルはキーマウで取りましたが、キーボード選びには相当悩みました。打鍵感の好みは人によって全然違うので、軸の種類だけは必ずチェックしてほしいポイントです。" />
    </div>
  );
}
