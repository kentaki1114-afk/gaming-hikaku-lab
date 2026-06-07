import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PS5・Xbox対応ゲーミングモニターおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Xbox対応ゲーミングモニターのおすすめランキング。4K・144Hz・1ms対応モデルを徹底比較。INZONE M9・LG・ASUSなど人気5製品。",
};

const monitors = [
  {
    rank: 1,
    name: "INZONE M9 II",
    maker: "Sony",
    compatible: ["PS5", "Xbox"],
    price: "¥89,980",
    resolution: "4K（3840×2160）",
    refreshRate: "144Hz",
    responseTime: "1ms",
    panel: "IPS",
    pros: ["PS5向けAuto HDR Tone Mapping搭載", "4K/144Hz・HDMI 2.1対応", "VRR（可変リフレッシュレート）対応", "Anti-motion blur機能搭載"],
    cons: ["価格が高い", "主にPS5特化の機能"],
    point: "PS5向けに最適化された唯一無二のモニター。PS5ユーザーなら最高の選択肢。",
    score: 4.9,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-amber-400",
    badge: "PS5最適化",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    rank: 2,
    name: "LG 27GP850-B",
    maker: "LG",
    compatible: ["PS5", "Xbox", "PC"],
    price: "¥44,800",
    resolution: "WQHD（2560×1440）",
    refreshRate: "180Hz",
    responseTime: "1ms",
    panel: "Nano IPS",
    pros: ["180HzでPC・Xboxも快適", "Nano IPSで発色が優秀", "AMD FreeSync / G-Sync Compatible", "コスパが非常に高い"],
    cons: ["4K非対応", "PS5では120Hzが上限"],
    point: "コスパと性能のバランスが最高クラス。PC・Xboxと併用するなら最強候補。",
    score: 4.6,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-slate-400",
    badge: "コスパ最強",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    rank: 3,
    name: "ASUS TUF Gaming VG28UQL1A",
    maker: "ASUS",
    compatible: ["PS5", "Xbox", "PC"],
    price: "¥74,800",
    resolution: "4K（3840×2160）",
    refreshRate: "144Hz",
    responseTime: "1ms",
    panel: "IPS",
    pros: ["4K/144Hz・HDMI 2.1対応", "Xbox認定モニター", "DisplayHDR 400対応", "4入力同時表示（PBP）"],
    cons: ["価格がやや高い", "スタンドの調整範囲が狭い"],
    point: "Xboxの認定を受けた4Kゲーミングモニター。PS5・Xboxどちらでも性能を最大限に発揮。",
    score: 4.5,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-orange-400",
    badge: "Xbox認定",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  {
    rank: 4,
    name: "BenQ MOBIUZ EX2710Q",
    maker: "BenQ",
    compatible: ["PS5", "Xbox", "PC"],
    price: "¥48,980",
    resolution: "WQHD（2560×1440）",
    refreshRate: "165Hz",
    responseTime: "1ms",
    panel: "IPS",
    pros: ["内蔵スピーカーが高音質", "HDRi（自動HDR調整）搭載", "目に優しいアイケア機能", "デザインがスタイリッシュ"],
    cons: ["4K非対応", "HDMI 2.1非対応"],
    point: "スピーカー品質が群を抜いて優秀。ヘッドセットなしで楽しみたい人向け。",
    score: 4.4,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-purple-400",
    badge: "スピーカー最強",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    rank: 5,
    name: "PHILIPS 242E1GAEZ",
    maker: "PHILIPS",
    compatible: ["PS5", "Xbox", "PC"],
    price: "¥19,800",
    resolution: "FHD（1920×1080）",
    refreshRate: "165Hz",
    responseTime: "1ms",
    panel: "VA",
    pros: ["価格が非常に安い", "165Hzで動きが滑らか", "コントラスト比が高い（VAパネル）", "エントリー向け最適"],
    cons: ["4K・WQHDより解像度が低い", "色域がIPSより狭い"],
    point: "とにかく安くゲーミングモニターを導入したい人向け。まず始めの1台として最適。",
    score: 4.1,
    amazonLink: "#",
    rakutenLink: "#",
    rankColor: "text-teal-400",
    badge: "最安エントリー",
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

export default function MonitorsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="text-violet-400">モニターランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-emerald-600/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-4">
          2026年6月 最新版
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Xbox対応ゲーミングモニター<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox対応のゲーミングモニター全5製品を、解像度・リフレッシュレート・応答速度・価格で徹底比較しました。
          参考サイト：<a href="https://my-best.com/16253" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://gamewith.jp/gaming-pc/514193" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>・
          <a href="https://sakidori.co/article/903259" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">SAKIDORI</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      <div className="space-y-6">
        {monitors.map((item) => (
          <div
            key={item.rank}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/40 transition-all"
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">価格</span>
                    <span className="text-violet-400 font-bold">{item.price}</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">解像度</span>
                    <span className="text-white text-xs">{item.resolution}</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">リフレッシュレート</span>
                    <span className="text-white text-xs">{item.refreshRate}</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <span className="text-slate-400 block text-xs mb-1">応答速度</span>
                    <span className="text-white text-xs">{item.responseTime}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm bg-emerald-900/20 border border-emerald-700/30 rounded-lg px-4 py-3 mb-4">
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
        <h2 className="text-xl font-bold text-white mb-6">ゲーミングモニターの選び方</h2>
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-white mb-1">① HDMI 2.1対応かを確認</h3>
            <p>PS5・Xboxで4K/120Hz以上を出すにはHDMI 2.1が必須です。HDMI 2.0までのモニターでは4Kは60Hzまでに制限されます。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">② 解像度とリフレッシュレートのバランス</h3>
            <p>美しい映像を楽しむなら4K、なめらかな動きを重視するなら高リフレッシュレートを優先。FPSゲームには144Hz以上のWQHDが人気です。</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">③ VRR（可変リフレッシュレート）対応</h3>
            <p>PS5・XboxはともにVRRに対応しています。VRR対応モニターを使うと、ゲーム中のカクつきやティアリングが大幅に軽減されます。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
