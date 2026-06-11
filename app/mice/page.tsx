import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";

export const metadata: Metadata = {
  title: "ゲーミングマウスおすすめランキング2026 | ゲーミング比較ラボ",
  description: "ゲーミングマウスのおすすめランキング。Razer DeathAdder・ASUS ROG・Logicool・SteelSeriesなど人気モデルを徹底比較。",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "Razer DeathAdder V3 Pro ゲーミングマウス",
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.8,
    point: "プロゲーマー使用率No.1クラスのエルゴノミクスマウス。ワイヤレスで遅延ゼロ級の応答性。",
    pros: ["HyperSpeed 2.4GHzワイヤレス", "63g軽量設計", "エルゴノミクス形状で長時間快適", "30000DPI Focus Pro センサー"],
    cons: ["左手持ち不可（右手専用）", "価格がやや高め"],
    specs: [
      { label: "接続方式", value: "ワイヤレス / USB有線" },
      { label: "重量", value: "約63g" },
    ],
  },
  {
    keyword: "ASUS ROG Gladius III Wireless ゲーミングマウス",
    badge: "カスタマイズ性最高",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    rankColor: "text-slate-400",
    score: 4.5,
    point: "三接続方式（ワイヤレス・Bluetooth・有線）に対応。スイッチ交換も可能なカスタマイズ特化モデル。",
    pros: ["トリプルコネクション対応", "プッシュフィットスイッチソケット採用", "ROG充電ドック対応", "左右対称デザイン"],
    cons: ["本体がやや重め", "充電ドックは別売り"],
    specs: [
      { label: "接続方式", value: "ワイヤレス / BT / USB" },
      { label: "センサー", value: "ROG AimPoint Pro" },
    ],
  },
  {
    keyword: "Logicool G703h ゲーミングマウス",
    badge: "コスパ重視",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rankColor: "text-orange-400",
    score: 4.3,
    point: "LOGIBOLTワイヤレスで安定した接続と長時間バッテリーを両立。コスパ重視派に人気。",
    pros: ["LIGHTSPEED 2.4GHz対応", "POWERPLAY充電マット対応", "95g程度で扱いやすい重さ", "G HUBソフトウェア対応"],
    cons: ["センサー精度は最上位より劣る", "やや旧世代モデル"],
    specs: [
      { label: "接続方式", value: "ワイヤレス / USB有線" },
      { label: "バッテリー", value: "最大35時間" },
    ],
  },
  {
    keyword: "SteelSeries Aerox ゲーミングマウス ワイヤレス",
    badge: "超軽量",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    rankColor: "text-cyan-400",
    score: 4.4,
    point: "穴あきハニカムデザインで超軽量を実現。FPSで素早い動作が求められる場面に最適。",
    pros: ["68g以下の超軽量", "防塵防水設計（IEC 60529）", "量子光学センサー採用", "200時間以上バッテリー"],
    cons: ["穴あき設計でホコリが入りやすい", "グリップ感は好み分かれる"],
    specs: [
      { label: "接続方式", value: "ワイヤレス / USB有線" },
      { label: "重量", value: "約68g以下" },
    ],
  },
  {
    keyword: "Razer Basilisk V3 Pro ゲーミングマウス",
    badge: "多ボタン派に最適",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    rankColor: "text-green-400",
    score: 4.6,
    point: "チルトホイール＋11ボタンで、MMO・RPGユーザーに最適な多機能ワイヤレスマウス。",
    pros: ["3接続方式（有線 / BT / 2.4GHz）", "チルトホイール搭載", "11個のプログラマブルボタン", "Razer Chroma RGB対応"],
    cons: ["重量127gとやや重め", "ボタン数が多く初心者には慣れが必要"],
    specs: [
      { label: "接続方式", value: "有線 / BT / 2.4GHz" },
      { label: "重量", value: "約127g" },
    ],
  },
];

export default function MicePage() {
  const { items, updatedAt } = getProducts("mice");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ゲーミングマウスおすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${SITE_ORIGIN}/mice`,
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
      { "@type": "ListItem", position: 2, name: "マウスランキング", item: `${SITE_ORIGIN}/mice` },
    ],
  };

  const faqs: Faq[] = [
    {
      question: "ゲーミングマウスのDPIはどれくらいに設定するのが良いですか？",
      answer: "FPSでは400〜1600DPIが一般的です。DPIが低いほど精密な操作がしやすく、高いほど速い動作に向きます。自分のマウスパッドのサイズや感度の好みに合わせて調整しましょう。",
    },
    {
      question: "ワイヤレスマウスはゲームで遅延が気になりますか？",
      answer: "最新の2.4GHzワイヤレスは遅延が1ms以下で有線と体感差はほぼありません。ただしBluetoothは遅延が大きいためゲームには不向きです。専用レシーバー付きのワイヤレスモデルを選びましょう。",
    },
    {
      question: "軽量マウスと重いマウス、どちらがゲームに有利ですか？",
      answer: "FPSなど素早いエイムが必要なゲームでは60〜80gの軽量マウスが有利です。手首への負担も軽減できます。一方、MMOなど多ボタン操作が中心なら重みがあっても安定感のあるマウスが向いています。",
    },
    {
      question: "ゲーミングマウスと普通のマウスは何が違いますか？",
      answer: "ゲーミングマウスは高精度センサー・高ポーリングレート（報告頻度）・低遅延設計が特徴です。普通のマウスと比べてカーソルの追従精度が高く、激しい動作でも正確に操作できます。",
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
        <span>ホーム</span> &gt; <span className="text-rose-400">ゲーミングマウスランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-rose-600/20 text-rose-300 text-xs font-semibold px-3 py-1 rounded-full border border-rose-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ゲーミングマウス<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          FPS・TPS・MMOなど用途別に最適なゲーミングマウスを、重量・センサー精度・接続方式・価格の観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
        </p>
      </div>

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="hover:border-rose-500/40"
            pointBg="bg-rose-900/20 border-rose-700/30"
          />
        ))}
      </div>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">ゲーミングマウスの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① 重量を確認する</h3>
            <p>FPSなど素早い操作が求められるゲームでは60〜70g以下の軽量マウスが有利です。手首への負担も軽減でき、長時間プレイでも疲れにくくなります。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② 形状・持ち方で選ぶ</h3>
            <p>かぶせ持ち・つかみ持ち・つまみ持ちによって最適な形状が変わります。エルゴノミクス形状は右手専用が多いため、左手持ちの方は左右対称デザインを選びましょう。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ 有線 vs ワイヤレス</h3>
            <p>最近のゲーミングワイヤレスは遅延が極めて少なく、有線とほぼ同等の応答性を持ちます。ケーブルによる引っかかりが気になる方はワイヤレスを検討しましょう。</p>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />

      <AuthorCard comment="フォートナイトでアンリアルに到達したのはキーマウに切り替えてからです。マウスの重さとセンサー精度だけは絶対に妥協しないほうがいい、と体で覚えました。" />
    </div>
  );
}
