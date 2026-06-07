import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";

export const metadata: Metadata = {
  title: "PS5・Xboxコントローラーおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応コントローラーのおすすめランキング。DualSense Edge・Xbox Elite Series 2・SCUF Reflexなど人気製品を徹底比較。",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

// keyword は data/products/controllers.json の各商品と対応させるためのキー
const editorials: Editorial[] = [
  {
    keyword: "DualSense Edge コントローラー",
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.8,
    point: "カスタマイズ性最高峰のPS5純正プロコン。FPSプレイヤーに特におすすめ。",
    pros: ["背面ボタン付き", "スティック感度・デッドゾーン調整可能", "トリガーストップ機能", "プロファイル保存機能"],
    cons: ["価格が高い", "バッテリー持続がやや短め"],
    specs: [
      { label: "対応機種", value: "PS5 / PC" },
      { label: "接続方式", value: "USB-C / ワイヤレス" },
    ],
  },
  {
    keyword: "DualSense ワイヤレスコントローラー PS5",
    badge: "コスパ最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rankColor: "text-slate-400",
    score: 4.5,
    point: "PS5を買ったらまず持つべき定番コントローラー。ゲーム体験がひと味違う。",
    pros: ["アダプティブトリガー搭載", "ハプティクスフィードバック", "内蔵スピーカー・マイク", "コスパが高い"],
    cons: ["背面ボタンなし", "長時間使用でドリフトが出やすい"],
    specs: [
      { label: "対応機種", value: "PS5 / PC" },
      { label: "接続方式", value: "USB-C / ワイヤレス" },
    ],
  },
  {
    keyword: "Xbox Eliteコントローラー Series2",
    badge: "Xbox最強",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    rankColor: "text-orange-400",
    score: 4.7,
    point: "Xbox・PC環境なら最高峰の選択肢。40時間バッテリーが圧倒的な強み。",
    pros: ["背面パドル4つ", "トリガー・スティック感度調整可", "圧倒的バッテリー持続", "充電スタンド付属"],
    cons: ["PS5は変換器が必要", "重さがやや気になる"],
    specs: [
      { label: "対応機種", value: "Xbox / PC" },
      { label: "バッテリー", value: "約40時間" },
    ],
  },
  {
    keyword: "SCUF Reflex Pro コントローラー",
    badge: "グリップ最高",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    rankColor: "text-purple-400",
    score: 4.3,
    point: "ProコンとしてDualSense Edgeの代替候補。グリップ感が特に優れる。",
    pros: ["背面パドル搭載", "グリップが握りやすい", "ラバーグリップ標準装備", "カラーバリエーション豊富"],
    cons: ["DualSense EdgeよりXBボタン配置が異なる", "アダプティブトリガーなし"],
    specs: [
      { label: "対応機種", value: "PS5 / PC" },
      { label: "接続方式", value: "USB-C / ワイヤレス" },
    ],
  },
  {
    keyword: "8BitDo Ultimate Controller",
    badge: "コスパ王",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    rankColor: "text-teal-400",
    score: 4.4,
    point: "Xbox・PCユーザーでコストを抑えたい人に最適。性能と価格のバランスが◎。",
    pros: ["コスパ最高クラス", "背面ボタン2つ付き", "アプリでカスタマイズ可", "2.4GHz接続で遅延少ない"],
    cons: ["PS5非対応（Xbox・PC向け）", "アダプティブトリガーなし"],
    specs: [
      { label: "対応機種", value: "Xbox / PC" },
      { label: "バッテリー", value: "約22時間" },
    ],
  },
];

export default function ControllersPage() {
  const { items, updatedAt } = getProducts("controllers");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PS5・Xboxコントローラーおすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${SITE_ORIGIN}/controllers`,
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
        <span>ホーム</span> &gt; <span className="text-violet-400">コントローラーランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-violet-600/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xboxコントローラー<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox対応のコントローラーを、接続方式・カスタマイズ性・バッテリー持続・価格の観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
          参考サイト：<a href="https://my-best.com/32755" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://gamewith.jp/gaming-pc/526454" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>・
          <a href="https://kamigame.jp/gaming/7780.html" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">神ゲー攻略</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="hover:border-violet-500/40"
            pointBg="bg-violet-900/20 border-violet-700/30"
          />
        ))}
      </div>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">コントローラーの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① 対応プラットフォームを確認</h3>
            <p>PS5専用・Xbox専用・両対応など、対応機種を必ず確認しましょう。変換アダプターを使えば流用できる場合もありますが、一部機能が制限されることがあります。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② プロコンが必要かどうか</h3>
            <p>FPSやアクションゲームを本気でやるなら、背面ボタン・デッドゾーン調整ができるプロコンが有利です。カジュアル向けなら通常版DualSenseで十分です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ バッテリー持続時間</h3>
            <p>長時間プレイするなら40時間持つXbox Elite Series 2が断然おすすめ。DualSenseは約12時間なので、長時間プレイ時は充電スタンドを併用するのがベターです。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
