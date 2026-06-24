import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { Suspense } from "react";
import type { Editorial } from "@/app/components/ProductRankingCard";
import { PlatformFilteredRanking, RankingList } from "@/app/components/PlatformFilteredRanking";
import { FaqSection, type Faq } from "@/app/components/FaqSection";
import { AuthorCard } from "@/app/components/AuthorCard";
import { RelatedArticles } from "@/app/components/RelatedArticles";
import { buildItemListJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "PS5・Switch・Xboxコントローラーおすすめランキング2026 | ゲーミング比較ラボ",
  description: "PS5・Switch・Xbox対応コントローラーのおすすめランキング。DualSense Edge・Switch Proコントローラー・Xbox Elite Series 2など人気製品を徹底比較。",
  alternates: { canonical: "/controllers" },
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.com";

// keyword は data/products/controllers.json の各商品と対応させるためのキー
const editorials: Editorial[] = [
  {
    keyword: "DualSense Edge コントローラー",
    platforms: ["ps5", "pc"],
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
    platforms: ["ps5", "pc"],
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
    platforms: ["xbox", "pc"],
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
    keyword: "Nintendo Switch Proコントローラー 純正",
    platforms: ["switch", "pc"],
    badge: "Switch定番",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    rankColor: "text-red-400",
    score: 4.6,
    point: "Switchユーザーの第一候補。ジャイロ・HD振動・amiibo対応の任天堂純正プロコン。",
    pros: ["任天堂純正の安心感", "ジャイロ操作が高精度でスプラトゥーンに最適", "約40時間の長時間バッテリー", "PCでもSteam経由で使用可能"],
    cons: ["PS5・Xbox非対応", "背面ボタンなし"],
    specs: [
      { label: "対応機種", value: "Switch / PC" },
      { label: "バッテリー", value: "約40時間" },
    ],
  },
  {
    keyword: "8BitDo Ultimate Controller",
    platforms: ["xbox", "switch", "pc"],
    badge: "コスパ王",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    rankColor: "text-teal-400",
    score: 4.4,
    point: "Switch・Xbox・PC向けにモデル展開する高コスパ機。性能と価格のバランスが◎。",
    pros: ["コスパ最高クラス", "背面ボタン2つ付き", "アプリでカスタマイズ可", "充電ドック付きで管理が楽"],
    cons: ["PS5非対応", "対応機種がモデルにより異なる（購入時に要確認）"],
    specs: [
      { label: "対応機種", value: "Switch / Xbox / PC（モデル別）" },
      { label: "バッテリー", value: "約22時間" },
    ],
  },
  {
    keyword: "SCUF Reflex Pro コントローラー",
    platforms: ["ps5", "pc"],
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
    keyword: "Xbox ワイヤレス コントローラー カーボンブラック",
    platforms: ["xbox", "pc"],
    badge: "Xbox定番",
    badgeColor: "bg-lime-500/20 text-lime-300 border-lime-500/30",
    rankColor: "text-lime-400",
    score: 4.5,
    point: "Xbox Series X|S純正の定番コントローラー。PCでもそのまま使える完成度の高さが魅力。",
    pros: ["Microsoft純正の安心感", "握りやすいグリップ形状", "PC・スマホでも使える汎用性", "価格が手頃"],
    cons: ["背面ボタンなし", "充電式バッテリーは別売り（単3電池駆動）"],
    specs: [
      { label: "対応機種", value: "Xbox Series X|S / Xbox One / PC" },
      { label: "接続方式", value: "ワイヤレス / Bluetooth / USB-C" },
    ],
  },
  {
    keyword: "Victrix Pro BFG コントローラー PS5",
    platforms: ["ps5", "pc"],
    badge: "モジュール式",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    rankColor: "text-cyan-400",
    score: 4.4,
    point: "スティックやボタン配置を組み替えられるモジュール式PS5ライセンスプロコン。格ゲー用6ボタンモジュールも付属。",
    pros: ["モジュール交換でレイアウト自由自在", "背面ボタン4つ搭載", "格闘ゲーム向け6ボタンパッド付属", "有線・無線両対応"],
    cons: ["価格が高め", "重量がやや重い"],
    specs: [
      { label: "対応機種", value: "PS5 / PS4 / PC" },
      { label: "接続方式", value: "ワイヤレス / 有線USB" },
    ],
  },
  {
    keyword: "ナコン レボリューション5プロ コントローラー PS5",
    platforms: ["ps5", "pc"],
    badge: "プロ向け",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    rankColor: "text-indigo-400",
    score: 4.3,
    point: "ホールエフェクトスティック採用でドリフト知らずのPS5公式ライセンスプロコン。",
    pros: ["ホールエフェクトスティックでドリフトに強い", "背面ボタン4つ搭載", "重量カスタマイズ可能", "非対称スティック配置も選べる"],
    cons: ["価格が高い", "アダプティブトリガー非対応"],
    specs: [
      { label: "対応機種", value: "PS5 / PS4 / PC" },
      { label: "接続方式", value: "ワイヤレス / 有線USB" },
    ],
  },
  {
    keyword: "Razer Wolverine V2 Xbox 有線",
    platforms: ["xbox", "pc"],
    badge: "eスポーツ向け",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    rankColor: "text-emerald-400",
    score: 4.2,
    point: "メカタクタイルボタン搭載のXboxライセンス有線プロコン。応答速度重視の競技勢に。",
    pros: ["メカタクタイルボタンで高速入力", "背面ボタン・トリガーストップ搭載", "有線接続で遅延なし", "Razer Chroma RGB対応"],
    cons: ["有線専用", "価格が高め"],
    specs: [
      { label: "対応機種", value: "Xbox Series X|S / Xbox One / PC" },
      { label: "接続方式", value: "有線USB" },
    ],
  },
  {
    keyword: "8BitDo Pro2 コントローラー",
    platforms: ["switch", "pc"],
    badge: "Switchコスパ",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    rankColor: "text-orange-400",
    score: 4.3,
    point: "ホールエフェクトスティック搭載のSwitch対応高コスパ機。背面ボタン付きで1万円以下。",
    pros: ["ホールエフェクトスティックでドリフトに強い", "背面ボタン2つ搭載", "アプリで細かくカスタマイズ可", "Switch・PC・スマホ対応"],
    cons: ["PS5・Xbox非対応", "ジャイロ精度は純正プロコンに一歩譲る"],
    specs: [
      { label: "対応機種", value: "Switch / PC / スマホ" },
      { label: "接続方式", value: "Bluetooth / 有線USB" },
    ],
  },
  {
    keyword: "ホリパッド ターボ for Nintendo Switch",
    platforms: ["switch", "pc"],
    badge: "連射機能付き",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    rankColor: "text-rose-400",
    score: 4.1,
    point: "連射・連射ホールド機能を備えた任天堂ライセンスの有線パッド。軽量で長時間プレイも快適。",
    pros: ["任天堂公式ライセンス品", "連射・連射ホールド機能搭載", "軽量で疲れにくい", "価格が安くサブ用にも最適"],
    cons: ["有線専用", "HD振動・amiibo非対応"],
    specs: [
      { label: "対応機種", value: "Switch / PC" },
      { label: "接続方式", value: "有線USB" },
    ],
  },
  {
    keyword: "PowerA 有線コントローラー Xbox",
    platforms: ["xbox", "pc"],
    badge: "Xbox入門向け",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    rankColor: "text-sky-400",
    score: 4.0,
    point: "1万円以下で買えるXboxライセンス有線コントローラー。背面ボタン付きで入門に最適。",
    pros: ["Xbox公式ライセンス品", "背面ボタン2つ搭載", "価格が手頃", "3.5mmヘッドセット端子付き"],
    cons: ["有線専用", "振動はやや簡素"],
    specs: [
      { label: "対応機種", value: "Xbox Series X|S / Xbox One / PC" },
      { label: "接続方式", value: "有線USB" },
    ],
  },
  {
    keyword: "ホリパッド for Nintendo Switch",
    platforms: ["switch"],
    badge: "Switch入門向け",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    rankColor: "text-pink-400",
    score: 4.1,
    point: "任天堂ライセンス取得の定番サードパーティ製。純正より手頃な価格で買える入門機。",
    pros: ["任天堂公式ライセンス品", "純正プロコンより安価", "十字キーの操作感に定評", "軽量で子ども・サブ用にも◎"],
    cons: ["HD振動・amiibo非対応", "モデルによりジャイロ非搭載に注意"],
    specs: [
      { label: "対応機種", value: "Switch" },
      { label: "タイプ", value: "ワイヤレス / 有線（モデル別）" },
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

  const jsonLd = buildItemListJsonLd(
    "PS5・Switch・Xboxコントローラーおすすめランキング",
    SITE_ORIGIN,
    "/controllers",
    merged
  );

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "ホーム", item: SITE_ORIGIN },
    { name: "コントローラーランキング", item: `${SITE_ORIGIN}/controllers` },
  ]);

  const faqs: Faq[] = [
    {
      question: "PS5のコントローラーはPCでも使えますか？",
      answer: "はい、DualSenseはUSB-CケーブルまたはBluetoothでPCに接続できます。ただし、アダプティブトリガーなど一部機能はPS5専用タイトルでのみ動作します。",
    },
    {
      question: "プロコン（高性能コントローラー）は初心者にも必要ですか？",
      answer: "初心者には通常のDualSenseで十分です。プロコンはFPSなどで競技的にプレイしたい方向けです。まず標準コントローラーで慣れてから検討するのをおすすめします。",
    },
    {
      question: "コントローラーのスティックが勝手に動く（ドリフト）のはなぜですか？",
      answer: "スティック内部のセンサーが摩耗することで発生します。DualSenseは保証期間内であればメーカー修理が可能です。予防策として、使わないときはスティックを倒しっぱなしにしないことが大切です。",
    },
    {
      question: "PS5とXboxのコントローラーは互換性がありますか？",
      answer: "基本的に互換性はありません。PS5にはDualSense、XboxにはXboxコントローラーが必要です。ただしPC用途では変換アダプターを使うことで両方利用できる場合があります。",
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
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link> &gt; <span className="text-violet-400">コントローラーランキング</span>
      </nav>

      <div className="mb-10">
        <span className="inline-block bg-violet-600/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30 mb-4">
          {new Date(updatedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })} 更新
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          PS5・Switch・Xboxコントローラー<br className="md:hidden" />おすすめランキング
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Switch・Xbox対応のコントローラーを、接続方式・カスタマイズ性・バッテリー持続・価格の観点で徹底比較しました。
          価格・在庫情報は楽天市場の最新データを自動取得しています。
          参考サイト：<a href="https://my-best.com/32755" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">マイベスト</a>・
          <a href="https://gamewith.jp/gaming-pc/526454" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">ゲームウィズ</a>・
          <a href="https://kamigame.jp/gaming/7780.html" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">神ゲー攻略</a>ほか信頼性の高いサイトを参考にしています。
        </p>
      </div>

      <Suspense fallback={<RankingList items={merged} accentBorder="hover:border-violet-500/40" pointBg="bg-violet-900/20 border-violet-700/30" />}>
        <PlatformFilteredRanking items={merged} accentBorder="hover:border-violet-500/40" pointBg="bg-violet-900/20 border-violet-700/30" />
      </Suspense>

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
      <FaqSection faqs={faqs} />

      <RelatedArticles category="controllers" />

      <AuthorCard comment="Apex歴10年、プレデター帯を4シーズン維持してきた経験から、実際にパフォーマンスに差が出ると感じた製品だけ選んでいます。コントローラーは手に馴染むまで時間がかかるので、最初の1本選びは慎重に。" />
    </div>
  );
}
