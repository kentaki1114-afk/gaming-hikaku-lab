import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { ProductRankingCard, type Editorial } from "@/app/components/ProductRankingCard";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";

export const metadata: Metadata = {
  title: "PS5・Xboxゲーミングモニターおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応ゲーミングモニターのおすすめランキング。Acer Nitro・JAPANNEXT・I-O DATA・Samsung Odysseyなどを徹底比較。",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

const editorials: Editorial[] = [
  {
    keyword: "Acer Nitro ゲーミングモニター 27インチ IPS WQHD 200Hz",
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    rankColor: "text-amber-400",
    score: 4.7,
    point: "200HzのIPSパネルでPS5の120fps出力も滑らかに表示。コスパと性能のバランスが◎。",
    pros: ["200Hzで滑らかな表示", "IPSパネルで色再現性が高い", "WQHD解像度で高精細", "HDR対応"],
    cons: ["スタンドの高さ調整が簡易的", "スピーカーは付属しない"],
    specs: [
      { label: "サイズ", value: "27インチ" },
      { label: "リフレッシュレート", value: "200Hz" },
    ],
  },
  {
    keyword: "JAPANNEXT 27インチ WQHD 165Hz IPSパネル ゲーミングモニター",
    badge: "コスパ最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rankColor: "text-slate-400",
    score: 4.4,
    point: "価格を抑えつつWQHD・165Hzを実現。初めてのゲーミングモニターに最適。",
    pros: ["価格が手ごろ", "WQHD高解像度", "165Hzで応答性良好", "国内サポートあり"],
    cons: ["発色は上位機種にやや劣る", "HDRは簡易対応"],
    specs: [
      { label: "サイズ", value: "27インチ" },
      { label: "リフレッシュレート", value: "165Hz" },
    ],
  },
  {
    keyword: "JAPANNEXT 27インチ 4K 165Hz IPSパネル ゲーミングモニター",
    badge: "高画質志向",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    rankColor: "text-orange-400",
    score: 4.6,
    point: "4K解像度と165Hzを両立。PS5の4K/120fps出力を最大限活かせる一台。",
    pros: ["4K高精細表示", "165Hzで滑らかな動き", "IPSパネルで視野角が広い", "据え置き利用に最適"],
    cons: ["価格はやや高め", "PCで4K/165Hzを出すには高性能GPUが必要"],
    specs: [
      { label: "サイズ", value: "27インチ" },
      { label: "解像度", value: "4K (3840×2160)" },
    ],
  },
  {
    keyword: "I-O DATA 144Hz対応27型ゲーミングモニター GigaCrysta",
    badge: "信頼の国産",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    rankColor: "text-purple-400",
    score: 4.3,
    point: "国内メーカーならではの安心サポート。144Hzで快適なプレイ環境を構築できる。",
    pros: ["国内メーカーで安心", "144Hzで応答性が良い", "ゲームに適した低遅延設計", "サポート体制が充実"],
    cons: ["解像度はフルHD〜WQHDが中心", "デザインはシンプル"],
    specs: [
      { label: "サイズ", value: "27インチ" },
      { label: "リフレッシュレート", value: "144Hz" },
    ],
  },
  {
    keyword: "Samsung Odyssey G5 C34G55T ウルトラワイド",
    badge: "没入感No.1",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    rankColor: "text-teal-400",
    score: 4.5,
    point: "ウルトラワイド湾曲画面で圧倒的な没入感。レースゲームやRPGとの相性が抜群。",
    pros: ["34インチウルトラワイド", "湾曲パネルで没入感が高い", "165Hzで滑らかな表示", "コスパが良い"],
    cons: ["設置スペースが必要", "対応ゲームによっては表示比率の調整が必要"],
    specs: [
      { label: "サイズ", value: "34インチ（ウルトラワイド）" },
      { label: "リフレッシュレート", value: "165Hz" },
    ],
  },
];

export default function MonitorsPage() {
  const { items, updatedAt } = getProducts("monitors");
  const merged = editorials
    .map((ed) => {
      const product = items.find((it) => it.keyword === ed.keyword);
      return product ? { product, editorial: ed } : null;
    })
    .filter((v): v is { product: (typeof items)[number]; editorial: Editorial } => v !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PS5・Xboxゲーミングモニターおすすめランキング",
    itemListElement: merged.map(({ product }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.imageUrl || undefined,
        url: `${SITE_ORIGIN}/monitors`,
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
      { "@type": "ListItem", position: 2, name: "モニターランキング", item: `${SITE_ORIGIN}/monitors` },
    ],
  };

  const faqs: Faq[] = [
    {
      question: "PS5は4Kモニターに対応していますか？",
      answer: "はい、PS5はHDMI 2.1経由で4K/120Hzに対応しています。ただし4K対応ゲームとモニター両方が対応している必要があります。4K非対応でも1080p/144Hzのモニターで快適にプレイできます。",
    },
    {
      question: "144Hzと240Hzのリフレッシュレートは体感できる差がありますか？",
      answer: "144Hzから240Hzへの差は60Hzから144Hzほど劇的ではありませんが、FPSなどで画面が滑らかに感じられます。PS5は最大120Hzのため、PC向けのゲームをする方に240Hzは特に有効です。",
    },
    {
      question: "応答速度（ms）はどれくらいが良いですか？",
      answer: "ゲーム用途では1ms〜5msが目安です。1msのTNパネルは最速ですが色再現性が低め、IPSパネルは1〜4msで色鮮やかさを両立できます。一般的なゲームでは5ms以下であれば問題ありません。",
    },
    {
      question: "テレビとゲーミングモニター、ゲームにはどちらが向いていますか？",
      answer: "ゲーミングモニターの方が入力遅延が少なく応答速度が速いため、FPSや格闘ゲームでは有利です。テレビは大画面でRPGや映像重視のゲームを楽しむのに向いています。用途に応じて使い分けが理想的です。",
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
        <span>ホーム</span> &gt; <span className="text-violet-400">モニターランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-emerald-600/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xboxゲーミングモニター<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox対応のゲーミングモニターを、リフレッシュレート・解像度・パネル種類・サイズの観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
          参考サイト：<a href="https://my-best.com/3138" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://kakaku.com/pc/monitor/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">価格.com</a>・
          <a href="https://gamewith.jp/ps5/article/show/3198" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      <AuthorCard comment="60Hzから144Hzに切り替えたときの感動は今でも覚えています。Apexのような動きの激しいFPSだと、リフレッシュレートの差は本当に体感できます。予算と用途のバランスで選ぶのが正直なところです。" />

      <div className="space-y-6">
        {merged.map(({ product, editorial }) => (
          <ProductRankingCard
            key={editorial.keyword}
            product={product}
            editorial={editorial}
            accentBorder="hover:border-emerald-500/40"
            pointBg="bg-emerald-900/20 border-emerald-700/30"
          />
        ))}
      </div>

      <section className="mt-16 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">ゲーミングモニターの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① リフレッシュレートを確認</h3>
            <p>PS5は120fps出力に対応しているため、120Hz以上のモニターを選ぶことで滑らかな映像を楽しめます。FPSなど動きの速いゲームほど高リフレッシュレートが有利です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② 解像度とパネルの種類</h3>
            <p>WQHDや4Kは映像の精細さが向上しますが、PS5側の出力設定や対応ゲームのフレームレートとのバランスを考える必要があります。IPSパネルは発色や視野角に優れています。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ サイズと設置環境</h3>
            <p>27インチが標準的なサイズですが、没入感を求めるならウルトラワイドモニターも選択肢になります。設置スペースと視聴距離を確認してから選びましょう。</p>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />
    </div>
  );
}
