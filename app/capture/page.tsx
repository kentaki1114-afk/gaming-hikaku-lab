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
  title: "キャプチャーボードおすすめランキング2026 | ゲーミング比較ラボ",
  description: "キャプチャーボードのおすすめランキング。Elgato・AVerMedia・I-O DATA・Razerなど人気モデルを徹底比較。PS5・Xbox配信に最適な一台を選ぼう。",
  alternates: { canonical: "/capture" },
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "I-O DATA GV-USB3HD キャプチャーボード",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.5,
    point: "日本メーカーI-O DATAの安心感と扱いやすさが人気。PS5・Xboxのゲーム配信を手軽に始めたい人に最適。",
    pros: ["日本語サポートが充実", "プラグアンドプレイ対応", "USB 3.0接続で安定転送", "コンパクト設計"],
    cons: ["4K HDRキャプチャー非対応", "ソフトウェアの機能がシンプル"],
    specs: [
      { label: "最大解像度", value: "1080p 60fps" },
      { label: "接続", value: "USB 3.0" },
    ],
  },
  {
    keyword: "AVerMedia Live Gamer ULTRA 2.1 キャプチャーボード",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "4K HDR対応",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    rankColor: "text-slate-400",
    score: 4.7,
    point: "PS5の4K HDR出力をそのままキャプチャーできる最上位クラス。高画質配信・録画に本気で取り組む人向け。",
    pros: ["4K HDR 60fps対応", "パススルー4K 144fps", "HDMI 2.1対応", "RECentral対応"],
    cons: ["価格が高い", "PCへの負荷が大きい"],
    specs: [
      { label: "最大解像度", value: "4K HDR 60fps" },
      { label: "接続", value: "PCIe / USB 3.1" },
    ],
  },
  {
    keyword: "Razer Ripsaw HD キャプチャーボード",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "Razer品質",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    rankColor: "text-orange-400",
    score: 4.3,
    point: "Razerブランドのシンプルなキャプチャーボード。ドライバ不要で接続するだけで使える手軽さが魅力。",
    pros: ["プラグアンドプレイ", "Synapse連携対応", "コンパクト設計", "Razerエコシステムに統合"],
    cons: ["1080p 60fps止まり", "他社製品より価格がやや高め"],
    specs: [
      { label: "最大解像度", value: "1080p 60fps" },
      { label: "接続", value: "USB 3.0" },
    ],
  },
  {
    keyword: "Elgato HD60 ゲームキャプチャー",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "定番の安心感",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rankColor: "text-blue-400",
    score: 4.4,
    point: "世界中のゲーム実況者が使う定番ブランドElgato。4KPassthrough対応で画質とゲームプレイを両立。",
    pros: ["4Kパススルー対応", "ソフトウェア「4K Capture Utility」が使いやすい", "OBS・XSplit対応", "信頼性が高い"],
    cons: ["最大キャプチャーは1080p 60fps", "最新モデルより機能で劣る"],
    specs: [
      { label: "最大解像度", value: "1080p 60fps（4Kパススルー対応）" },
      { label: "接続", value: "USB 3.0" },
    ],
  },
  {
    keyword: "AVerMedia Live Gamer Portable ゲームキャプチャー",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "持ち運び対応",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    rankColor: "text-purple-400",
    score: 4.2,
    point: "PC不要でSDカードへ直接録画できるスタンドアロン機能付き。外出先や大会への持ち運びにも対応。",
    pros: ["PC不要でSDカード録画対応", "コンパクト・軽量", "1080p 60fps対応", "OBS連携可能"],
    cons: ["スタンドアロン録画は最大1080p 30fps", "上位モデルより画質で劣る"],
    specs: [
      { label: "最大解像度", value: "1080p 60fps" },
      { label: "スタンドアロン", value: "SDカード録画対応" },
    ],
  },
];

export default function CapturePage() {
  const { items, updatedAt } = getProducts("capture");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = buildItemListJsonLd(
    "キャプチャーボードおすすめランキング",
    SITE_ORIGIN,
    "/capture",
    merged
  );

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "ホーム", item: SITE_ORIGIN },
    { name: "キャプチャーボードランキング", item: `${SITE_ORIGIN}/capture` },
  ]);

  const faqs: Faq[] = [
    {
      question: "PS5でキャプチャーボードなしで配信はできますか？",
      answer: "はい、PS5はTwitchやYouTubeへの直接配信機能を内蔵しています。ただしPS5内蔵機能では画質・解像度に制限があります。高画質・高度な編集をしたい場合やPCと連携したい場合はキャプチャーボードが必要です。",
    },
    {
      question: "内部キャプチャーと外部キャプチャーボードの違いは何ですか？",
      answer: "内部キャプチャー（PCIe接続）はPCに直接取り付けるタイプで遅延が少なく高画質です。外部キャプチャーボードはUSB接続でPCなしでも使えるものもあり、設置が手軽です。PS5との接続にはどちらも対応しています。",
    },
    {
      question: "キャプチャーボードはスマホゲームの録画にも使えますか？",
      answer: "スマホゲームの録画は基本的にスマホの画面録画機能や、スマホのHDMI出力アダプターを使う方法が一般的です。キャプチャーボードはHDMI出力のある機器（PS5・Switch等）向けで、スマホ直接接続には対応していないものがほとんどです。",
    },
    {
      question: "初めてキャプチャーボードを選ぶ際に重要なことは何ですか？",
      answer: "①対応解像度（1080p/4K）、②接続方式（USB/PCIe）、③パススルー機能の有無（ゲームプレイ中に遅延なく映像を確認できるか）の3点を確認しましょう。初心者にはUSB接続でパススルー対応のElgato HD60やAVerMediaシリーズがおすすめです。",
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
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link> &gt; <span className="text-cyan-400">キャプチャーボードランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-cyan-600/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          キャプチャーボード<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・XboxのゲームプレイをYouTubeやTwitchで配信・録画するためのキャプチャーボードを、解像度・接続方式・使いやすさ・価格の観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
        </p>
      </div>

      <Suspense fallback={<RankingList items={merged} accentBorder="hover:border-cyan-500/40" pointBg="bg-cyan-900/20 border-cyan-700/30" />}>
        <PlatformFilteredRanking items={merged} accentBorder="hover:border-cyan-500/40" pointBg="bg-cyan-900/20 border-cyan-700/30" />
      </Suspense>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">キャプチャーボードの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① 解像度・フレームレートを確認</h3>
            <p>PS5は4K 60fps・1080p 120fps出力に対応しています。配信品質を最大限に活かすなら4K HDR対応モデルを、コスパ重視なら1080p 60fps対応モデルで十分です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② パススルー機能を確認</h3>
            <p>キャプチャーしながらゲームをプレイするには「パススルー出力」が必要です。パススルーがあれば、遅延なくテレビでゲームをしながら録画・配信できます。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ 内蔵型 vs 外付け型</h3>
            <p>外付けUSB型はノートPCでも使えて手軽ですが、PCIe内蔵型はより安定した高画質キャプチャーが可能です。配信を本格的にやるなら内蔵型が長期的におすすめです。</p>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />

      <RelatedArticles category="capture" />

      <AuthorCard comment="Apexの配信を始めたとき、キャプチャーボード選びで1週間悩みました。その経験をもとに、初心者が失敗しないための選択肢に絞っています。スペックより「使いやすさ」を優先しました。" />
    </div>
  );
}
