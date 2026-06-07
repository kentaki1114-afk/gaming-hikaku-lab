import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PS5・Xboxコントローラーおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応コントローラーのおすすめランキング。DualSense Edge・Xbox Elite Series 2・SCUF Reflexなど人気製品を徹底比較。",
};

const controllers = [
  {
    rank: 1,
    name: "DualSense Edge",
    maker: "Sony（純正）",
    compatible: ["PS5", "PC"],
    price: "¥29,980",
    connection: "USB-C / ワイヤレス",
    battery: "約12時間",
    pros: ["背面ボタン付き", "スティック感度・デッドゾーン調整可能", "トリガーストップ機能", "プロファイル保存機能"],
    cons: ["価格が高い", "バッテリー持続がやや短め"],
    point: "カスタマイズ性最高峰のPS5純正プロコン。FPSプレイヤーに特におすすめ。",
    score: 4.8,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-amber-400",
    badge: "編集部イチオシ",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    rank: 2,
    name: "DualSense（通常版）",
    maker: "Sony（純正）",
    compatible: ["PS5", "PC"],
    price: "¥9,878",
    connection: "USB-C / ワイヤレス",
    battery: "約12時間",
    pros: ["アダプティブトリガー搭載", "ハプティクスフィードバック", "内蔵スピーカー・マイク", "コスパが高い"],
    cons: ["背面ボタンなし", "長時間使用でドリフトが出やすい"],
    point: "PS5を買ったらまず持つべき定番コントローラー。ゲーム体験がひと味違う。",
    score: 4.5,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-slate-400",
    badge: "コスパ最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    rank: 3,
    name: "Xbox Elite ワイヤレス コントローラー Series 2",
    maker: "Microsoft（純正）",
    compatible: ["Xbox", "PC", "PS5※要変換"],
    price: "¥18,578",
    connection: "USB-C / ワイヤレス / Bluetooth",
    battery: "約40時間",
    pros: ["背面パドル4つ", "トリガー・スティック感度調整可", "圧倒的バッテリー持続", "充電スタンド付属"],
    cons: ["PS5は変換器が必要", "重さがやや気になる"],
    point: "Xbox・PC環境なら最高峰の選択肢。40時間バッテリーが圧倒的な強み。",
    score: 4.7,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-orange-400",
    badge: "Xbox最強",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  {
    rank: 4,
    name: "SCUF Reflex Pro",
    maker: "SCUF Gaming",
    compatible: ["PS5", "PC"],
    price: "¥24,980",
    connection: "USB-C / ワイヤレス",
    battery: "約10時間",
    pros: ["背面パドル搭載", "グリップが握りやすい", "ラバーグリップ標準装備", "カラーバリエーション豊富"],
    cons: ["DualSense EdgeよりもXBボタン配置が異なる", "アダプティブトリガーなし"],
    point: "ProコンとしてDualSense Edgeの代替候補。グリップ感が特に優れる。",
    score: 4.3,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-purple-400",
    badge: "グリップ最高",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    rank: 5,
    name: "8BitDo Ultimate Controller",
    maker: "8BitDo",
    compatible: ["Xbox", "PC", "Android"],
    price: "¥8,980",
    connection: "USB-C / ワイヤレス 2.4GHz",
    battery: "約22時間",
    pros: ["コスパ最高クラス", "背面ボタン2つ付き", "アプリでカスタマイズ可", "2.4GHz接続で遅延少ない"],
    cons: ["PS5非対応（Xbox・PC向け）", "アダプティブトリガーなし"],
    point: "Xbox・PCユーザーでコストを抑えたい人に最適。性能と価格のバランスが◎。",
    score: 4.4,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-teal-400",
    badge: "コスパ王",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
];

function Stars({ score }: { score: number }) {
  const full = Math.floor(score);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= full ? "text-amber-400" : "text-slate-600"}>★</span>
      ))}
      <span className="ml-1 text-sm font-semibold text-amber-400">{score}</span>
    </div>
  );
}

export default function ControllersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="text-violet-400">コントローラーランキング</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <span className="inline-block bg-violet-600/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30 mb-4">
          2026年6月 最新版
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xboxコントローラー<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox対応のコントローラー全5製品を、接続方式・カスタマイズ性・バッテリー持続・価格の観点で徹底比較しました。
          参考サイト：<a href="https://my-best.com/32755" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://gamewith.jp/gaming-pc/526454" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>・
          <a href="https://kamigame.jp/gaming/7780.html" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">神ゲー攻略</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      {/* Ranking */}
      <div className="space-y-6">
        {controllers.map((item) => (
          <div
            key={item.rank}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-violet-500/40 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 text-center">
                <span className={`text-5xl font-black ${item.rankColor}`}>
                  #{item.rank}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  {item.compatible.map(c => (
                    <span key={c} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{item.name}</h2>
                <p className="text-slate-400 text-sm mb-3">{item.maker}</p>
                <Stars score={item.score} />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">価格</span>
                    <span className="text-violet-400 font-bold">{item.price}</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">接続方式</span>
                    <span className="text-white text-xs">{item.connection}</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">バッテリー</span>
                    <span className="text-white text-xs">{item.battery}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm bg-violet-900/20 border border-violet-700/30 rounded-lg px-4 py-3 mb-4">
                  💡 {item.point}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-green-400 text-sm font-semibold mb-2">✓ メリット</h4>
                    <ul className="space-y-1">
                      {item.pros.map(p => (
                        <li key={p} className="text-slate-300 text-sm flex gap-2"><span className="text-green-400">+</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-400 text-sm font-semibold mb-2">✗ デメリット</h4>
                    <ul className="space-y-1">
                      {item.cons.map(c => (
                        <li key={c} className="text-slate-300 text-sm flex gap-2"><span className="text-red-400">-</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={item.amazonLink}
                    className="flex-1 min-w-[140px] text-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
                  >
                    Amazonで見る
                  </a>
                  <a
                    href={item.rakutenLink}
                    className="flex-1 min-w-[140px] text-center bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors"
                  >
                    楽天で見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide */}
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
