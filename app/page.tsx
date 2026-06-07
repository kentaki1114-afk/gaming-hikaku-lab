import Link from "next/link";

const categories = [
  {
    href: "/controllers",
    emoji: "🕹️",
    title: "コントローラー",
    description: "PS5・Xbox対応のおすすめコントローラーを徹底比較。純正から高機能サードパーティ製まで。",
    badge: "人気No.1カテゴリ",
    color: "from-violet-600/20 to-violet-900/10 border-violet-500/30 hover:border-violet-400/60",
  },
  {
    href: "/headsets",
    emoji: "🎧",
    title: "ヘッドセット",
    description: "3Dオーディオ対応・ワイヤレスなど、PS5・Xbox向けゲーミングヘッドセットを比較。",
    badge: "没入感が変わる",
    color: "from-blue-600/20 to-blue-900/10 border-blue-500/30 hover:border-blue-400/60",
  },
  {
    href: "/monitors",
    emoji: "🖥️",
    title: "ゲーミングモニター",
    description: "4K・144Hz・1msなど、PS5・Xbox向けの高性能モニターをスペック別に比較。",
    badge: "高単価・高報酬",
    color: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 hover:border-emerald-400/60",
  },
];

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
            コントローラー・ヘッドセット・モニターをPS5・Xboxユーザー目線で徹底比較。
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
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative bg-gradient-to-br ${cat.color} border rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1`}
            >
              <span className="text-4xl mb-4 block">{cat.emoji}</span>
              <span className="inline-block text-xs font-semibold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full mb-3">
                {cat.badge}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{cat.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                ランキングを見る →
              </span>
            </Link>
          ))}
        </div>
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

      {/* Why this site */}
      <section className="max-w-6xl mx-auto px-4 py-16">
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
      </section>
    </>
  );
}
