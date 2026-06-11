import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories, ACCENT_BADGE_CLASSES, DEFAULT_BADGE_CLASS } from "@/lib/categories";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// カテゴリカードの装飾(絵文字・キャッチ・説明文)。slugをキーに categories.json を補完する。
// 未定義の新カテゴリにはフォールバックが適用されるため、ここの追記は任意。
const CATEGORY_EXTRAS: Record<string, { emoji: string; badge: string; description: string }> = {
  controllers: {
    emoji: "🕹️",
    badge: "人気No.1カテゴリ",
    description: "PS5・Xbox対応のおすすめコントローラーを徹底比較。純正から高機能サードパーティ製まで。",
  },
  headsets: {
    emoji: "🎧",
    badge: "没入感が変わる",
    description: "3Dオーディオ対応・ワイヤレスなど、PS5・Xbox向けゲーミングヘッドセットを比較。",
  },
  monitors: {
    emoji: "🖥️",
    badge: "120fpsを活かす",
    description: "4K・144Hz・1msなど、PS5・Xbox向けの高性能モニターをスペック別に比較。",
  },
  keyboards: {
    emoji: "⌨️",
    badge: "キーマウ勢必見",
    description: "G913・Apex Proなど、FPSで戦えるゲーミングキーボードを軸・サイズ別に比較。",
  },
  mice: {
    emoji: "🖱️",
    badge: "エイムが変わる",
    description: "軽量ワイヤレスからコスパモデルまで、FPS向けゲーミングマウスを重量・センサーで比較。",
  },
  chairs: {
    emoji: "💺",
    badge: "腰を守る投資",
    description: "長時間プレイでも疲れにくいゲーミングチェアを、腰サポート・素材・価格で比較。",
  },
  capture: {
    emoji: "📹",
    badge: "配信デビューに",
    description: "PS5の配信・録画に必要なキャプチャーボードを、画質・パススルー対応で比較。",
  },
};

// accentColor → カードのグラデーションクラス(Tailwindは動的生成不可のためリテラル列挙)
const CARD_GRADIENTS: Record<string, string> = {
  violet: "from-violet-600/20 to-violet-900/10 border-violet-500/30 hover:border-violet-400/60",
  green: "from-green-600/20 to-green-900/10 border-green-500/30 hover:border-green-400/60",
  blue: "from-blue-600/20 to-blue-900/10 border-blue-500/30 hover:border-blue-400/60",
  orange: "from-orange-600/20 to-orange-900/10 border-orange-500/30 hover:border-orange-400/60",
  rose: "from-rose-600/20 to-rose-900/10 border-rose-500/30 hover:border-rose-400/60",
  yellow: "from-yellow-600/20 to-yellow-900/10 border-yellow-500/30 hover:border-yellow-400/60",
  cyan: "from-cyan-600/20 to-cyan-900/10 border-cyan-500/30 hover:border-cyan-400/60",
  purple: "from-purple-600/20 to-purple-900/10 border-purple-500/30 hover:border-purple-400/60",
  indigo: "from-indigo-600/20 to-indigo-900/10 border-indigo-500/30 hover:border-indigo-400/60",
  teal: "from-teal-600/20 to-teal-900/10 border-teal-500/30 hover:border-teal-400/60",
  amber: "from-amber-600/20 to-amber-900/10 border-amber-500/30 hover:border-amber-400/60",
};

const DEFAULT_EXTRA = {
  emoji: "🎮",
  badge: "新カテゴリ",
  description: "PS5・Xbox向けのおすすめ製品をランキング形式で比較しています。",
};

const topPicks = [
  {
    rank: 1,
    category: "コントローラー",
    name: "DualSense Edge（Sony純正）",
    price: "¥29,980",
    point: "カスタマイズ性と操作精度が段違い",
    href: "/controllers",
    rankColor: "text-amber-400",
  },
  {
    rank: 2,
    category: "ヘッドセット",
    name: "PULSE Elite（Sony純正）",
    price: "¥19,980",
    point: "PS5の3Dオーディオを最大限に体験",
    href: "/headsets",
    rankColor: "text-slate-400",
  },
  {
    rank: 3,
    category: "モニター",
    name: "INZONE M9（Sony）",
    price: "¥89,980",
    point: "PS5向け4K/144Hz、Auto HDR対応",
    href: "/monitors",
    rankColor: "text-orange-400",
  },
];

export default function Home() {
  const categories = getAllCategories();
  const latestArticles = getAllArticles().slice(0, 4);
  const badgeClassOf = (slug: string) => {
    const accent = categories.find((c) => c.slug === slug)?.accentColor;
    return (accent && ACCENT_BADGE_CLASSES[accent]) || DEFAULT_BADGE_CLASS;
  };
  const labelOf = (slug: string) =>
    categories.find((c) => c.slug === slug)?.navLabel ?? slug;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900 py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-violet-600/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30 mb-6">
            PS5 / Xbox コンソールゲーマー向け
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            最強の周辺機器を、<br className="md:hidden" />
            <span className="text-violet-400">ガチで比較</span>する
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            コントローラーからキャプチャーボードまで、全{categories.length}カテゴリをPS5・Xboxユーザー目線で徹底比較。
            あなたのゲームライフをワンランク上げる最適な一台を見つけよう。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/controllers"
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
            >
              コントローラーを探す
            </Link>
            <Link
              href="/headsets"
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm border border-slate-600"
            >
              ヘッドセットを探す
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-2">カテゴリから探す</h2>
        <p className="text-slate-400 mb-8">ジャンル別に最新のおすすめランキングをチェック</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const extra = CATEGORY_EXTRAS[cat.slug] ?? DEFAULT_EXTRA;
            const gradient = CARD_GRADIENTS[cat.accentColor] ?? CARD_GRADIENTS.violet;
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`group relative bg-gradient-to-br ${gradient} border rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1`}
              >
                <span className="text-4xl mb-4 block">{extra.emoji}</span>
                <span className="inline-block text-xs font-semibold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full mb-3">
                  {extra.badge}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{extra.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                  ランキングを見る →
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href="/ps5-accessories"
          className="mt-6 flex items-center justify-between bg-gradient-to-r from-violet-600/20 to-slate-800/40 border border-violet-500/30 hover:border-violet-400/60 rounded-2xl p-6 transition-all group"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-1">PS5・Xbox周辺機器おすすめ総まとめ【2026年版】</h3>
            <p className="text-slate-400 text-sm">7カテゴリの「今いちばんのおすすめ」と揃える優先順位をまとめてチェック</p>
          </div>
          <span className="text-violet-400 text-sm font-medium whitespace-nowrap group-hover:translate-x-1 transition-transform">
            まとめを見る →
          </span>
        </Link>
      </section>

      {/* Top Picks */}
      <section className="bg-slate-800/30 border-y border-slate-700/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-2">編集部イチオシ TOP3</h2>
          <p className="text-slate-400 mb-8">カテゴリを超えて、今一番おすすめの周辺機器</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPicks.map((item) => (
              <Link
                key={item.rank}
                href={item.href}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-violet-500/50 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-4xl font-black ${item.rankColor}`}>
                    #{item.rank}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                <p className="text-violet-400 font-semibold mb-3">{item.price}</p>
                <p className="text-slate-400 text-sm">{item.point}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">新着記事</h2>
            <p className="text-slate-400">選び方ガイドや製品比較の最新記事</p>
          </div>
          <Link
            href="/articles"
            className="text-violet-400 hover:text-violet-300 text-sm font-medium whitespace-nowrap"
          >
            すべての記事を見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {latestArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block bg-slate-800 border border-slate-700 hover:border-violet-500/40 rounded-2xl p-6 transition-all"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClassOf(article.category)}`}>
                  {labelOf(article.category)}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(article.publishedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <h3 className="font-bold text-white text-base md:text-lg mb-2 leading-snug">{article.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{article.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why this site */}
      <section className="bg-slate-800/30 border-y border-slate-700/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">ゲーミング比較ラボとは</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "🎮", title: "ゲーマー目線", desc: "PS5・Xboxを実際にプレイしているゲーマーが執筆。スペックだけでなく実際の使い心地を重視。" },
              { emoji: "📊", title: "スペックを徹底比較", desc: "接続方式・応答速度・バッテリー持続時間など、選ぶ際に重要な項目を横断比較。" },
              { emoji: "💰", title: "コスパも重視", desc: "高価な製品だけでなく、コストパフォーマンスに優れた製品もしっかり紹介。予算に合わせて選べる。" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
                <span className="text-4xl mb-4 block">{item.emoji}</span>
                <h3 className="font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
