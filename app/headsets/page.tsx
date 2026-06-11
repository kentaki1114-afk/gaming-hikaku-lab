import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { Suspense } from "react";
import type { Editorial } from "@/app/components/ProductRankingCard";
import { PlatformFilteredRanking, RankingList } from "@/app/components/PlatformFilteredRanking";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";
import { RelatedArticles } from "@/app/components/RelatedArticles";

export const metadata: Metadata = {
  title: "PS5・Xboxゲーミングヘッドセットおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応ゲーミングヘッドセットのおすすめランキング。PULSE Elite・SteelSeries Arctis Nova Pro・Astro A50 Xなどを徹底比較。",
  alternates: { canonical: "/headsets" },
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "PULSE Elite ワイヤレスヘッドセット",
    platforms: ["ps5", "pc"],
    badge: "PS5最強",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.8,
    point: "PS5ユーザーが最初に買うべきヘッドセット。3Dオーディオの体験が圧倒的。",
    pros: ["PS5の3Dオーディオ完全対応", "ロスレス接続対応", "折りたたみ式で携帯性◎", "マルチポイント接続可能"],
    cons: ["PS5・PC特化でXbox非推奨", "ノイズキャンセリングなし"],
    specs: [
      { label: "対応機種", value: "PS5 / PC" },
      { label: "接続方式", value: "ワイヤレス（2.4GHz/Bluetooth）" },
    ],
  },
  {
    keyword: "SteelSeries Arctis Nova Pro Wireless",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "両対応最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rankColor: "text-slate-400",
    score: 4.7,
    point: "PS5・Xbox両方持ちなら最強の選択肢。バッテリー交換式で充電切れゼロ。",
    pros: ["PS5・Xbox・Switchに対応", "交換式バッテリーで無限使用可", "Active Noise Cancelling搭載", "音質が非常に高い"],
    cons: ["価格が高い", "本体がやや重い"],
    specs: [
      { label: "対応機種", value: "PS5 / Xbox / Switch / PC" },
      { label: "バッテリー", value: "交換式で無制限" },
    ],
  },
  {
    keyword: "Astro A50X ヘッドセット",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "全機種対応",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    rankColor: "text-orange-400",
    score: 4.6,
    point: "全ゲーム機に対応したプレミアムヘッドセット。置くだけ充電が非常に便利。",
    pros: ["全プラットフォーム対応", "充電ベースで置くだけ充電", "Dolby Atmos対応", "音の分離感が優秀"],
    cons: ["価格が最高クラス", "充電ベースが場所を取る"],
    specs: [
      { label: "対応機種", value: "PS5 / Xbox / PC / Switch" },
      { label: "バッテリー", value: "約24時間" },
    ],
  },
  {
    keyword: "HyperX Cloud Alpha Wireless",
    platforms: ["ps5", "pc"],
    badge: "バッテリー最長",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    rankColor: "text-purple-400",
    score: 4.5,
    point: "バッテリーが300時間持つという驚異的なスペック。コスパ最強クラス。",
    pros: ["300時間バッテリーが異次元", "軽量で長時間装着が快適", "音質がこの価格帯では最高クラス", "コスパが優秀"],
    cons: ["Xboxワイヤレス非対応", "ノイズキャンセリングなし"],
    specs: [
      { label: "対応機種", value: "PS5 / PC" },
      { label: "バッテリー", value: "約300時間" },
    ],
  },
  {
    keyword: "Xbox ワイヤレス ヘッドセット 純正",
    platforms: ["xbox", "pc"],
    badge: "Xbox入門向け",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    rankColor: "text-teal-400",
    score: 4.2,
    point: "Xboxユーザーのエントリー向け。純正ならではのコントローラー連携が快適。",
    pros: ["Xbox・PC向け純正品", "コントローラーで音量調整できる", "空間サウンド対応", "価格が手ごろ"],
    cons: ["PS5非推奨", "音質は価格相応"],
    specs: [
      { label: "対応機種", value: "Xbox / PC" },
      { label: "バッテリー", value: "約15時間" },
    ],
  },
  {
    keyword: "HyperX Cloud III ゲーミングヘッドセット",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "有線万能型",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    rankColor: "text-red-400",
    score: 4.4,
    point: "3.5mm接続で全機種に挿すだけ。Switchの携帯モードでも使える万能有線モデル。",
    pros: ["3.5mm/USB接続で全プラットフォーム対応", "Switch携帯モードでも使用可能", "装着感に定評のあるCloudシリーズ", "充電不要の有線で扱いが楽"],
    cons: ["ケーブルの取り回しが必要", "ノイズキャンセリングなし"],
    specs: [
      { label: "対応機種", value: "PS5 / Xbox / Switch / PC" },
      { label: "接続方式", value: "3.5mm / USB" },
    ],
  },
  {
    keyword: "Razer BlackShark V2X ゲーミングヘッドセット",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "1万円以下の定番",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    rankColor: "text-emerald-400",
    score: 4.3,
    point: "eスポーツ向け軽量設計の3.5mm有線モデル。1万円以下で全機種に対応するコスパの良さが光る。",
    pros: ["240gの軽量設計で長時間も快適", "3.5mm接続で全プラットフォーム対応", "遮音性の高いイヤーカップ", "1万円以下の手頃な価格"],
    cons: ["マイク取り外し不可", "バーチャルサラウンドはPC接続時のみ"],
    specs: [
      { label: "対応機種", value: "PS5 / Xbox / Switch / PC" },
      { label: "接続方式", value: "3.5mm有線" },
    ],
  },
  {
    keyword: "Logicool G335 ゲーミングヘッドセット",
    platforms: ["ps5", "xbox", "switch", "pc"],
    badge: "軽量コスパ",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    rankColor: "text-cyan-400",
    score: 4.2,
    point: "わずか240gの超軽量3.5mm有線モデル。フリップミュート付きでSwitch携帯モードでも使いやすい。",
    pros: ["240gの超軽量で疲れにくい", "3.5mm接続で全プラットフォーム対応", "フリップミュートマイクが便利", "カラーバリエーションが豊富"],
    cons: ["低音はやや控えめ", "サラウンド非対応"],
    specs: [
      { label: "対応機種", value: "PS5 / Xbox / Switch / PC" },
      { label: "接続方式", value: "3.5mm有線" },
    ],
  },
];

export default function HeadsetsPage() {
  const { items, updatedAt } = getProducts("headsets");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PS5・Xboxゲーミングヘッドセットおすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${SITE_ORIGIN}/headsets`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "JPY",
          url: product.affiliateUrl,
        },
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "ヘッドセットランキング", item: `${SITE_ORIGIN}/headsets` },
    ],
  };

  const faqs: Faq[] = [
    {
      question: "ゲーミングヘッドセットと普通のヘッドフォンの違いは何ですか？",
      answer: "ゲーミングヘッドセットはマイク内蔵・サラウンドサウンド対応・低遅延設計が特徴です。普通のヘッドフォンでもゲームはできますが、ボイスチャットや方向音感の把握で不利になることがあります。",
    },
    {
      question: "ワイヤレスと有線、ゲームにはどちらが向いていますか？",
      answer: "最新のゲーミングワイヤレスは遅延が極めて少なく、有線とほぼ同等です。ケーブルの煩わしさが気になる方はワイヤレスがおすすめです。ただし充電管理が必要になる点は注意しましょう。",
    },
    {
      question: "PS5用ヘッドセットはPCでも使えますか？",
      answer: "USB接続モデルはPCでも利用可能です。PS5専用の3.5mmジャック接続モデルもPCに3.5mmポートがあれば使えます。ただしPS5特有の空間オーディオ機能はPC上では動作しない場合があります。",
    },
    {
      question: "サラウンドサウンドはFPSゲームで有利になりますか？",
      answer: "はい、サラウンドサウンド対応ヘッドセットは敵の足音や銃声の方向を正確に把握しやすくなります。特にPS5の『テンペスト3Dオーディオ』対応機種では効果が顕著です。",
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
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link> &gt; <span className="text-violet-400">ヘッドセットランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-blue-600/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xboxゲーミングヘッドセット<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox対応ゲーミングヘッドセットを、音質・バッテリー・接続方式・対応プラットフォームで徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
          参考サイト：<a href="https://my-best.com/25348" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://gamewith.jp/ps5/article/show/3107" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>・
          <a href="https://picky-s.jp/ps5-headset/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Picky&apos;s</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      <Suspense fallback={<RankingList items={merged} accentBorder="hover:border-blue-500/40" pointBg="bg-blue-900/20 border-blue-700/30" />}>
        <PlatformFilteredRanking items={merged} accentBorder="hover:border-blue-500/40" pointBg="bg-blue-900/20 border-blue-700/30" />
      </Suspense>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">ゲーミングヘッドセットの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① 接続方式（有線・ワイヤレス）</h3>
            <p>遅延を気にするFPSプレイヤーは有線または2.4GHzワイヤレスが◎。Bluetoothは遅延が大きいため、ゲーム中は避けた方が良いです。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② PS5の3Dオーディオ対応かどうか</h3>
            <p>PS5の3Dオーディオ（Tempest 3D）に完全対応しているのはSONY純正品のみです。敵の位置音などを正確に聞きたいFPSプレイヤーはPULSE Eliteがおすすめ。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ バッテリー持続時間</h3>
            <p>長時間プレイするなら30時間以上が目安。HyperX Cloud Alpha Wirelessは300時間という驚異的なスペックで、充電の手間がほぼゼロになります。</p>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />

      <RelatedArticles category="headsets" />

      <AuthorCard comment="FPSで足音を正確に拾えるかどうかが勝率に直結します。Apexでプレデターまで上り詰めた中で、ヘッドセットの音質差に何度も助けられました。このランキングは音の定位感を特に重視して選んでいます。" />
    </div>
  );
}
