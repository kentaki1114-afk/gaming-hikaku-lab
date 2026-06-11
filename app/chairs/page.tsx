import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";

export const metadata: Metadata = {
  title: "ゲーミングチェアおすすめランキング2026 | ゲーミング比較ラボ",
  description: "ゲーミングチェアのおすすめランキング。AKRacing・DXRacer・Secretlab・GTRacingなど人気モデルを徹底比較。",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "AKRacing Pro-X V2 ゲーミングチェア",
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.7,
    point: "日本のゲーマーに最も選ばれているAKRacingの定番モデル。高さ調整・リクライニング全部入り。",
    pros: ["腰部・頸部サポート付属", "180度リクライニング対応", "4Dアームレスト調整", "高耐久PUレザー"],
    cons: ["重量が重め（組み立てが大変）", "価格は中〜高価格帯"],
    specs: [
      { label: "座面高さ", value: "調整可（約37〜47cm）" },
      { label: "リクライニング", value: "最大180度" },
    ],
  },
  {
    keyword: "DXRacer Formula Series ゲーミングチェア",
    badge: "デザイン重視",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    rankColor: "text-slate-400",
    score: 4.5,
    point: "レーシングカーをモチーフにした鮮やかなデザインが人気。カラーバリエーション豊富。",
    pros: ["個性的なパステルカラー展開", "しっかりしたランバーサポート", "コンパクトで軽め", "組み立てが比較的簡単"],
    cons: ["長時間座ると硬さが気になる場合も", "大柄な体格には狭い"],
    specs: [
      { label: "対応体重", value: "〜100kg" },
      { label: "素材", value: "PUレザー" },
    ],
  },
  {
    keyword: "Secretlab TITAN Evo ゲーミングチェア",
    badge: "プレミアム品質",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    rankColor: "text-orange-400",
    score: 4.8,
    point: "eスポーツ大会公式採用の最高品質チェア。価格は高いが耐久性・快適性ともにトップクラス。",
    pros: ["コールドフォームスポンジで長時間快適", "磁気式ヘッドレスト", "4ウェイランバーサポート", "多彩なコラボデザイン"],
    cons: ["価格が高い", "日本国内での入手性がやや限られる"],
    specs: [
      { label: "素材", value: "SoftWEAVEファブリック / NEO" },
      { label: "対応身長", value: "約157〜193cm" },
    ],
  },
  {
    keyword: "GTRACING ゲーミングチェア GT002",
    badge: "入門コスパ",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    rankColor: "text-green-400",
    score: 4.0,
    point: "初めてのゲーミングチェアとして手頃な価格帯でリクライニング・アームレスト全部入り。",
    pros: ["コスパが高い", "リクライニング対応", "フットレスト付き", "組み立てマニュアルが分かりやすい"],
    cons: ["長時間使用での耐久性は中級品に劣る", "素材の質感がやや低め"],
    specs: [
      { label: "対応体重", value: "〜150kg" },
      { label: "リクライニング", value: "90〜170度" },
    ],
  },
  {
    keyword: "AKRacing Wolf ゲーミングチェア",
    badge: "スポーティ",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    rankColor: "text-red-400",
    score: 4.3,
    point: "AKRacingのミドルレンジモデル。赤を基調としたスポーティなデザインとコスパのバランスが良い。",
    pros: ["AKRacingブランドの信頼性", "ランバー・ヘッドレストクッション付属", "幅広い座面設計", "正規販売店取扱"],
    cons: ["上位モデルに比べてアームレスト調整が少ない", "重量がある"],
    specs: [
      { label: "対応体重", value: "〜150kg" },
      { label: "素材", value: "PUレザー" },
    ],
  },
];

export default function ChairsPage() {
  const { items, updatedAt } = getProducts("chairs");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ゲーミングチェアおすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${SITE_ORIGIN}/chairs`,
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
      { "@type": "ListItem", position: 2, name: "ゲーミングチェアランキング", item: `${SITE_ORIGIN}/chairs` },
    ],
  };

  const faqs: Faq[] = [
    {
      question: "ゲーミングチェアは腰痛の改善に効果がありますか？",
      answer: "ランバーサポート（腰当て）とリクライニング機能が腰への負担を軽減します。ただし長時間同じ姿勢は腰痛の原因になるため、定期的に立ち上がることも大切です。腰痛が重い場合は医師への相談もおすすめします。",
    },
    {
      question: "ゲーミングチェアとオフィスチェアの違いは何ですか？",
      answer: "ゲーミングチェアはバケットシート形状で長時間のゲームプレイに特化し、フルリクライニングが特徴です。オフィスチェアは座面の奥行き調整など作業姿勢に最適化されています。在宅ワーク兼用ならオフィスチェア寄りの設計のモデルがおすすめです。",
    },
    {
      question: "在宅ワークとゲームの兼用でゲーミングチェアは使えますか？",
      answer: "十分に使えます。特にAKRacingやSecretlabのハイエンドモデルはオフィス用途も考慮した設計で、長時間のデスクワークにも向いています。アームレストの調整幅が広いモデルを選ぶと快適度が上がります。",
    },
    {
      question: "ゲーミングチェアを選ぶときの耐荷重の目安は？",
      answer: "自分の体重より20〜30kg以上の耐荷重があるモデルを選ぶと安心です。多くのモデルは100〜150kgに対応しています。体格が大きい方はXLサイズや耐荷重150kg以上のモデルを検討しましょう。",
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
        <span>ホーム</span> &gt; <span className="text-yellow-400">ゲーミングチェアランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-yellow-600/20 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ゲーミングチェア<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          長時間のゲームプレイでも疲れにくいゲーミングチェアを、腰サポート・リクライニング・耐久性・価格の観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
        </p>
      </div>

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="hover:border-yellow-500/40"
            pointBg="bg-yellow-900/20 border-yellow-700/30"
          />
        ))}
      </div>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">ゲーミングチェアの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① 対応体重・座面サイズを確認</h3>
            <p>体格に合ったサイズを選ぶことが重要です。小柄な方は小さめのモデル、体格の良い方はXLサイズ対応モデルを選ぶと姿勢が安定します。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② ランバーサポートの有無をチェック</h3>
            <p>腰痛予防のためにランバーサポート（腰当て）は必須です。調整式のものであれば自分の体型に合わせやすくなります。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ 素材で選ぶ（レザー vs ファブリック）</h3>
            <p>PUレザーは掃除しやすく見た目がスタイリッシュですが、夏は蒸れやすいです。ファブリック（布地）は通気性が良く長時間でも快適ですが、汚れが付きやすいです。</p>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />

      <AuthorCard comment="毎日数時間ゲームをする生活を10年続けてきて、椅子の差がいかに体に影響するかを痛感しました。腰を壊してプレイを中断した経験から、チェア選びは正直一番後悔したくないカテゴリです。" />
    </div>
  );
}
