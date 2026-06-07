import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";

export const metadata: Metadata = {
  title: "PS5・Xboxゲーミングヘッドセットおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応ゲーミングヘッドセットのおすすめランキング。PULSE Elite・SteelSeries Arctis Nova Pro・Astro A50 Xなどを徹底比較。",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "PULSE Elite ワイヤレスヘッドセット",
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
    badge: "両対応最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rankColor: "text-slate-400",
    score: 4.7,
    point: "PS5・Xbox両方持ちなら最強の選択肢。バッテリー交換式で充電切れゼロ。",
    pros: ["PS5・Xbox両対応", "交換式バッテリーで無限使用可", "Active Noise Cancelling搭載", "音質が非常に高い"],
    cons: ["価格が高い", "本体がやや重い"],
    specs: [
      { label: "対応機種", value: "PS5 / Xbox / PC" },
      { label: "バッテリー", value: "交換式で無制限" },
    ],
  },
  {
    keyword: "Astro A50X ヘッドセット",
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="text-violet-400">ヘッドセットランキング</span>
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

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="hover:border-blue-500/40"
            pointBg="bg-blue-900/20 border-blue-700/30"
          />
        ))}
      </div>

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
    </div>
  );
}
