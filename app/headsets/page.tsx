import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PS5・Xboxゲーミングヘッドセットおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応ゲーミングヘッドセットのおすすめランキング。PULSE Elite・SteelSeries Arctis Nova Pro・Astro A50 Xなどを徹底比較。",
};

const headsets = [
  {
    rank: 1,
    name: "PULSE Elite",
    maker: "Sony（純正）",
    compatible: ["PS5", "PC"],
    price: "¥19,980",
    connection: "ワイヤレス（2.4GHz / Bluetooth）",
    battery: "約30時間",
    pros: ["PS5の3Dオーディオ完全対応", "ロスレス接続対応", "折りたたみ式で携帯性◎", "マルチポイント接続可能"],
    cons: ["PS5・PC特化でXbox非推奨", "ノイズキャンセリングなし"],
    point: "PS5ユーザーが最初に買うべきヘッドセット。3Dオーディオの体験が圧倒的。",
    score: 4.8,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-amber-400",
    badge: "PS5最強",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    rank: 2,
    name: "SteelSeries Arctis Nova Pro Wireless",
    maker: "SteelSeries",
    compatible: ["PS5", "Xbox", "PC"],
    price: "¥39,800",
    connection: "ワイヤレス（2.4GHz）＋Bluetooth同時接続",
    battery: "交換式バッテリーで無制限",
    pros: ["PS5・Xbox両対応", "交換式バッテリーで無限使用可", "Active Noise Cancelling搭載", "音質が非常に高い"],
    cons: ["価格が高い", "本体がやや重い"],
    point: "PS5・Xbox両方持ちなら最強の選択肢。バッテリー交換式で充電切れゼロ。",
    score: 4.7,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-slate-400",
    badge: "両対応最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    rank: 3,
    name: "Astro A50 X",
    maker: "Astro Gaming",
    compatible: ["PS5", "Xbox", "PC", "Switch"],
    price: "¥49,980",
    connection: "ワイヤレス（2.4GHz）＋Bluetooth",
    battery: "約24時間（充電ベース付き）",
    pros: ["全プラットフォーム対応", "充電ベースで置くだけ充電", "Dolby Atmos対応", "音の分離感が優秀"],
    cons: ["価格が最高クラス", "充電ベースが場所を取る"],
    point: "全ゲーム機に対応したプレミアムヘッドセット。置くだけ充電が非常に便利。",
    score: 4.6,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-orange-400",
    badge: "全機種対応",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    rank: 4,
    name: "HyperX Cloud Alpha Wireless",
    maker: "HyperX",
    compatible: ["PS5", "PC"],
    price: "¥19,800",
    connection: "ワイヤレス（2.4GHz）",
    battery: "約300時間（驚異的）",
    pros: ["300時間バッテリーが異次元", "軽量で長時間装着が快適", "音質がこの価格帯では最高クラス", "コスパが優秀"],
    cons: ["Xboxワイヤレス非対応", "ノイズキャンセリングなし"],
    point: "バッテリーが300時間持つという驚異的なスペック。コスパ最強クラス。",
    score: 4.5,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-purple-400",
    badge: "バッテリー最長",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    rank: 5,
    name: "Xbox ワイヤレス ヘッドセット",
    maker: "Microsoft（純正）",
    compatible: ["Xbox", "PC"],
    price: "¥11,980",
    connection: "Xbox ワイヤレス＋Bluetooth",
    battery: "約15時間",
    pros: ["Xbox・PC向け純正品", "コントローラーで音量調整できる", "空間サウンド対応", "価格が手ごろ"],
    cons: ["PS5非推奨", "音質は価格相応"],
    point: "Xboxユーザーのエントリー向け。純正ならではのコントローラー連携が快適。",
    score: 4.2,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-teal-400",
    badge: "Xbox入門向け",
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

export default function HeadsetsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="text-violet-400">ヘッドセットランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-blue-600/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 mb-4">
          2026年6月 最新版
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xboxゲーミングヘッドセット<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox対応ゲーミングヘッドセット全5製品を、音質・バッテリー・接続方式・対応プラットフォームで徹底比較しました。
          参考サイト：<a href="https://my-best.com/25348" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://gamewith.jp/ps5/article/show/3107" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>・
          <a href="https://picky-s.jp/ps5-headset/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Picky&apos;s</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      <div className="space-y-6">
        {headsets.map((item) => (
          <div
            key={item.rank}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/40 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-shrink-0 text-center">
                <span className={`text-5xl font-black ${item.rankColor}`}>#{item.rank}</span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  {item.compatible.map(c => (
                    <span key={c} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{c}</span>
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

                <p className="text-slate-300 text-sm bg-blue-900/20 border border-blue-700/30 rounded-lg px-4 py-3 mb-4">
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
                  <a href={item.amazonLink} className="flex-1 min-w-[140px] text-center bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm py-2.5 px-4 rounded-xl transition-colors">
                    Amazonで見る
                  </a>
                  <a href={item.rakutenLink} className="flex-1 min-w-[140px] text-center bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-colors">
                    楽天で見る
                  </a>
                </div>
              </div>
            </div>
          </div>
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
