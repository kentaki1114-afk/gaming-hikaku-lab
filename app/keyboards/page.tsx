import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";

export const metadata: Metadata = {
  title: "ゲーミングキーボードおすすめランキング2026 | ゲーミング比較ラボ",
  description: "ゲーミングキーボードのおすすめランキング。Logicool G913・Razer BlackWidow・SteelSeries Apex Proなど人気モデルを徹底比較。",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "Logicool G913 TKL ゲーミングキーボード ワイヤレス",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ゲーミングキーボードおすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${SITE_ORIGIN}/keyboards`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "JPY",
          url: product.affiliateUrl,
        },
      },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="text-orange-400">ゲーミングキーボードランキング</span>
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

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="hover:border-orange-500/40"
            pointBg="bg-orange-900/20 border-orange-700/30"
          />
        ))}
      </div>

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
    </div>
  );
}
