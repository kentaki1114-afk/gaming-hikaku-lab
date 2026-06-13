// 1日5本の記事を自動生成するスクリプト。
// data/products/*.json の実データ（画像・価格・アフィリエイトリンク付き）から商品を選び、
// あらかじめ用意したテーマ（選び方ガイド／比較／シーン別おすすめ）に当てはめて記事JSONを書き出す。
// 生成された記事は lib/articles.ts 経由で /articles/[slug] に自動表示される。
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { shortProductName, clampDescription } from "./product-name.mjs";

const ROOT = process.cwd();
const PRODUCTS_DIR = resolve(ROOT, "data", "products");
const ARTICLES_DIR = resolve(ROOT, "data", "articles");

const CATEGORY_TITLES = {
  controllers: "コントローラー",
  headsets: "ヘッドセット",
  monitors: "ゲーミングモニター",
  keyboards: "ゲーミングキーボード",
  mice: "ゲーミングマウス",
  chairs: "ゲーミングチェア",
  capture: "キャプチャーボード",
};

const ARTICLES_PER_DAY = 5;

function loadProducts(category) {
  const raw = readFileSync(resolve(PRODUCTS_DIR, `${category}.json`), "utf-8");
  return JSON.parse(raw).items;
}

function makeRng(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  const next = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
  for (let i = 0; i < 8; i++) next();
  return next;
}

function seedFromString(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) || 1;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickTwoDistinct(rng, arr) {
  const a = pick(rng, arr);
  let b = pick(rng, arr);
  let guard = 0;
  while (b.keyword === a.keyword && guard < 10) {
    b = pick(rng, arr);
    guard++;
  }
  return [a, b];
}

// ---- FAQデータ ----
const CATEGORY_FAQS = {
  controllers: [
    { q: "有線と無線のコントローラー、どちらが遅延が少ないですか？", a: "有線の方が理論上は遅延が少ないですが、最新の無線コントローラーは遅延が2ms以下と実用上ほぼ差がありません。FPSの競技シーンでは有線派も多いですが、カジュアルなプレイなら無線で十分です。" },
    { q: "PS5純正コントローラー以外でPS5は使えますか？", a: "はい、PS5はサードパーティ製コントローラーにも対応しています。ただし純正以外はアダプティブトリガーやハプティクスフィードバックなど一部機能が使えない場合があります。ゲームパッドの場合は動作確認済みモデルを選ぶのが安心です。" },
    { q: "コントローラーのスティックドリフトを防ぐ方法はありますか？", a: "スティックドリフトは経年劣化で起きやすく、完全な防止は難しいです。キャリブレーション機能で軽度なら改善できます。デッドゾーン設定を広げる、定期的に清掃するのも効果的です。高品質なサードパーティ製コントローラーの方が耐久性が高い場合もあります。" },
  ],
  headsets: [
    { q: "ゲーミングヘッドセットと普通のヘッドホンの違いは何ですか？", a: "ゲーミングヘッドセットはマイクが内蔵されており、ゲーム内のコミュニケーションに特化しています。また空間オーディオや7.1chサラウンドに対応したものが多く、足音や銃声の方向把握に優れています。普通のヘッドホンは音楽鑑賞向けに調整されていることが多いです。" },
    { q: "PS5の3Dオーディオを使うにはどのヘッドセットが必要ですか？", a: "PS5の3Dオーディオ（Tempest 3Dオーディオ）は3.5mm接続のヘッドセットでも利用可能です。ただし最大限に活かすにはSONY純正のPULSE EliteやPULSE 3Dなど専用設計モデルが推奨されます。対応しているかは必ずPS5の公式対応リストで確認してください。" },
    { q: "無線ヘッドセットのバッテリーが長持ちする製品の選び方は？", a: "バッテリー持続時間は製品スペックに記載されていますが、実際の使用時は仕様より10〜20%短くなることが多いです。長時間プレイには20時間以上のモデルを選ぶか、HyperX Cloud Alpha Wirelessのように300時間超えの製品、またはAstro A50 Xのような充電台置き型を選ぶのが便利です。" },
  ],
  monitors: [
    { q: "PS5に最適なモニターのリフレッシュレートは？", a: "PS5は最大120Hzの出力に対応しているため、144Hz以上のモニターを選ぶとPS5の性能を最大限に活かせます。ただしゲームタイトルによって60Hz止まりのものも多いため、まず120Hz対応タイトルを確認してから選ぶのが賢明です。" },
    { q: "ゲーミングモニターのパネル種類（IPS・VA・TN）の違いは？", a: "TNパネルは応答速度が最速で競技向きですが視野角が狭いです。IPSパネルは色再現性が高く視野角も広いですが応答速度がやや遅め。VAパネルは最もコントラスト比が高く映画鑑賞向きです。現在はIPSの高速化が進み、FPS用途でもIPS Fast系が主流になっています。" },
    { q: "HDRに対応したモニターを選ぶメリットは？", a: "HDR対応モニターは明暗の差（コントラスト比）が大きく、暗所の視認性が上がるためFPSで有利なシーンがあります。ただし安価なモニターの「HDR対応」は表示品質が低いことが多いです。本物のHDR体験にはDisplayHDR 600以上の認証を取得したモデルを選ぶことをおすすめします。" },
  ],
  keyboards: [
    { q: "ゲーミングキーボードのスイッチ（軸）はどれを選べばいい？", a: "FPSなど速い入力が求められるゲームには軽い赤軸（リニア）がおすすめです。打鍵感にこだわりたいなら茶軸（タクタイル）、大きなクリック感が好きなら青軸（クリッキー）を選びましょう。最初の一台なら赤軸か茶軸が無難です。" },
    { q: "テンキーレス（TKL）とフルサイズキーボード、どちらがゲームに向いていますか？", a: "マウスの可動域を広く取りたいゲーマーにはテンキーレスが人気です。デスクスペースが広く確保でき、右手のマウスと左手のキーボードの距離が縮まります。テンキーを日常的に使う場合はフルサイズが便利です。" },
    { q: "ゲーミングキーボードのポーリングレートとは何ですか？", a: "ポーリングレートとはキーボードがPCに入力を報告する頻度です。1000Hzなら1秒間に1000回入力を送信します。標準的なゲーミングキーボードは1000Hzで、FPS競技では8000Hzモデルも登場しています。通常プレイでは1000Hzで十分です。" },
  ],
  mice: [
    { q: "ゲーミングマウスの重さはどのくらいが適切ですか？", a: "軽量マウス（50〜70g）は素早い動作に向いており、FPSプレイヤーに人気です。重いマウス（100g以上）は安定性が増し、長時間プレイでも疲れにくい人もいます。60〜80gのマウスはバランスが良く最初の一台に向いています。" },
    { q: "ゲーミングマウスのDPIはどのくらいに設定すればいいですか？", a: "FPS（Apex・Valorantなど）では400〜1600DPIが一般的です。低DPIは精密な照準が取りやすく、高DPIは素早い視点移動に向きます。センシはゲームの感度設定と組み合わせて調整するため、まず400〜800DPIで試してみることをおすすめします。" },
    { q: "有線と無線ゲーミングマウス、ゲームで遅延の差はありますか？", a: "最新の高品質無線マウス（Logicool LIGHTSPEED・Razer HyperSpeed等）は遅延が1ms以下で有線と実質同等です。プロゲーマーも無線マウスを使用するケースが増えており、ケーブルが邪魔にならない分むしろ快適という意見もあります。" },
  ],
  chairs: [
    { q: "ゲーミングチェアと普通のオフィスチェア、どちらが腰に良いですか？", a: "長時間のゲームプレイには腰サポートが充実したゲーミングチェアが向いています。ただし安価なゲーミングチェアよりも高品質なオフィスチェア（ハーマンミラーなど）の方が腰への負担が少ないケースもあります。重要なのはブランドよりも自分の体格に合ったサイズ選びです。" },
    { q: "ゲーミングチェアの対応体重・身長はどこで確認できますか？", a: "各製品のスペック欄に「対応体重」「対応身長」が記載されています。必ず購入前に自分の体格と照合してください。特に対応身長が低い製品はシートが高くなりすぎて足が届かないことがあります。" },
    { q: "ゲーミングチェアのリクライニングはどのくらい倒れますか？", a: "製品によって異なりますが、多くのゲーミングチェアは90〜155度程度のリクライニングに対応しています。仮眠も考えているなら150度以上倒れるモデルを、デスクワーク中心なら100〜120度で固定できるモデルが便利です。" },
  ],
  capture: [
    { q: "PS5の映像をキャプチャーするためには何が必要ですか？", a: "PS5の映像をPCに取り込むにはキャプチャーボードが必要です。PS5のHDMI出力をキャプチャーボードに接続し、キャプチャーボードをPCのUSBに繋ぎます。OBSなどのキャプチャーソフトで映像を受信して録画・配信を行います。パススルー出力があるモデルならゲームプレイの遅延もありません。" },
    { q: "キャプチャーボードなしでPS5の配信はできますか？", a: "はい、PS5にはTwitch・YouTube Live・Niconico Live Broadcastingへの直接配信機能が内蔵されています。ただしPS5単体配信は解像度・ビットレートに制限があります。高画質でPC上で管理しながら配信したい場合はキャプチャーボードが必要です。" },
    { q: "4K対応キャプチャーボードを選ぶべきですか？", a: "PS5の4K出力を録画・配信したい場合は4K対応モデルが必要です。ただし4K配信にはPCのスペック（特にCPU）も高性能なものが必要で、配信プラットフォームも4K配信には制限がある場合があります。まずは1080p 60fps対応モデルで始めて、慣れてから4K対応へアップグレードするのが現実的です。" },
  ],
};

// ---- プラットフォーム別アドバイス ----
const PLATFORM_ADVICE = {
  controllers: {
    ps5: "PS5でプレイするなら、アダプティブトリガーとハプティクスフィードバックに対応した純正DualSenseまたはDualSense Edgeを検討しましょう。",
    xbox: "Xboxシリーズでは純正Xbox ワイヤレスコントローラーが最も安定した接続性を提供します。Xbox Game PassのPCゲームにも使えます。",
    switch: "Nintendo Switch向けには、Proコントローラーかライセンス品を選ぶことでジャイロセンサーやNFC（amiibo）に対応できます。",
    pc: "PCゲームにはXinputに対応したコントローラーが汎用性が高く、Steamとの相性も抜群です。",
  },
  headsets: {
    ps5: "PS5向けにはPULSE Eliteなど3Dオーディオ対応モデルが最も音響体験を活かせます。USB接続もしくはPS5専用ワイヤレスに対応したモデルを選びましょう。",
    xbox: "Xboxではワイヤレス接続にXbox ワイヤレスプロトコルを使うモデルが安定します。SteelSeries・HyperXはXbox公式ライセンス品を多く展開しています。",
    switch: "Switch（携帯モード）では3.5mm有線接続が確実です。HyperX Cloud IIIなど3.5mmに対応したヘッドセットがSwitchでも手軽に使えます。",
    pc: "PCではUSBヘッドセットが高音質かつ安定した接続性を発揮します。DTS:X Ultra・Dolby Atmosなどの空間オーディオも活用できます。",
  },
  monitors: {
    ps5: "PS5には4K/120Hzか1440p/165Hzが最適です。HDMI 2.1対応を確認しましょう。VRR（可変リフレッシュレート）対応モデルを選ぶとティアリングを防げます。",
    xbox: "Xbox Series X向けもPS5同様HDMI 2.1対応が理想です。FreeSync Premiumに対応しているとXboxのVRRとの相性が最高です。",
    switch: "Switchは1080p/60Hz出力が上限のためフルHD/60Hzモニターで十分です。Switch用途では価格を抑えてコントローラーやヘッドセットに投資するのが賢明です。",
    pc: "PCゲームには144Hz以上のモニターをおすすめします。グラボの性能と合わせて解像度（FHD/QHD/4K）を選択してください。",
  },
  keyboards: {
    ps5: "PS5でキーボードを使う場合はUSB接続またはBluetooth接続のものを選びましょう。ゲームによって対応状況が異なります。",
    xbox: "Xboxもキーボード接続に対応しています。ゲームタイトルによっては対応していない場合もあるため確認が必要です。",
    switch: "SwitchはUSBキーボードに対応していますが、主にゲームの入力ではなくオンラインチャット用途が中心です。",
    pc: "PCゲームではキーボードが主役です。メカニカルスイッチの種類（軸）で打鍵感と応答速度が変わります。用途に合わせて選びましょう。",
  },
  mice: {
    ps5: "PS5はマウス接続に対応していますが、ゲームタイトルによって対応状況が異なります。FPS系タイトルでの使用が多いです。",
    xbox: "Xboxでもマウス＆キーボードに対応しているタイトルがあります。Xbox Game Pass対応PCゲームでは通常通りマウスが使えます。",
    switch: "SwitchはUSBマウスには対応していません。PCゲームでのみ使用してください。",
    pc: "PCゲームではマウスの性能がダイレクトに勝率に影響します。センサーの精度・重量・形状が自分のプレイスタイルに合っているか確認しましょう。",
  },
  chairs: {
    ps5: "PS5でテレビ前プレイなら少し離れた位置での姿勢が大事です。背もたれがしっかり機能するモデルを選びましょう。",
    xbox: "同上、テレビ前での長時間プレイに対応したモデルを選んでください。",
    switch: "Switchは携帯モードで使うことも多いため、椅子の上でのリラックス姿勢にも対応したモデルが便利です。",
    pc: "PCデスクの前で長時間作業・ゲームをする場合はランバーサポート（腰当て）と高さ調整が充実したモデルを最優先で選んでください。",
  },
  capture: {
    ps5: "PS5のHDMI 2.1出力を活かすためには、HDMI 2.1パススルーに対応したキャプチャーボードを選びましょう。4K/60fps録画にはAVerMedia Live Gamer ULTRA 2.1がおすすめです。",
    xbox: "Xbox Series X/Sも同様にHDMI 2.1出力をサポートしています。PS5と同じキャプチャーボードで使い回せます。",
    switch: "SwitchはHDMI出力で最大1080p/60fpsです。外付けUSBキャプチャーボードで十分録画できます。コストを抑えるならElgato HD60Xがコスパ良好です。",
    pc: "PCゲームの録画にはOBSの画面キャプチャで対応可能なため、PCゲーム専用であればキャプチャーボードは不要です。他機種との兼用なら外付けUSB型を選ぶと便利です。",
  },
};

// ---- 記事の型（テーマ）定義 ----
const THEMES = {
  selectionGuide: {
    label: "選び方ガイド",
    build(category, products, rng) {
      const [main, sub] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const mainShort = shortProductName(main.name);
      const subShort = shortProductName(sub.name);
      const platforms = PLATFORM_ADVICE[category] ?? PLATFORM_ADVICE.controllers;
      const faqs = CATEGORY_FAQS[category] ?? CATEGORY_FAQS.controllers;
      const title = `${catTitle}の選び方完全ガイド2026｜${mainShort}と${subShort}を徹底比較`;
      const description = clampDescription(`${catTitle}選びで失敗しないためのチェックポイントを、人気モデル「${mainShort}」「${subShort}」を例に解説。プラットフォーム別のおすすめや購入前に確認すべきポイントをまとめました。`);
      const blocks = [
        { type: "paragraph", text: `${catTitle}は種類が多く、何を基準に選べばいいか迷ってしまう人も多いはずです。この記事では、購入前に確認しておきたいポイントを整理しながら、実際に人気の高いモデルを例に選び方のコツを詳しく紹介します。初めて購入する方はもちろん、買い替えを検討している方にも役立つ情報をまとめました。` },
        { type: "paragraph", text: `${catTitle}選びで最も大切なのは「自分がどのゲーム機で・どんなゲームを・どのくらいの時間プレイするか」を明確にすることです。この3点を整理するだけで、自分に合った一台が格段に絞り込めます。` },
        { type: "heading", text: "購入前に必ず確認しておきたい5つのポイント" },
        { type: "list", items: [
          "対応プラットフォーム（PS5・Xbox・Switch・PCのどれで使うか）",
          "有線か無線か（遅延を重視するか、ケーブルレスの快適さを重視するか）",
          "価格帯（エントリー・ミドル・ハイエンドで機能が大きく異なる）",
          "長時間使用したときの快適さ（重さ・バッテリー持続時間・装着感）",
          "保証・サポート体制（安心して長く使えるブランドを選ぶ）",
        ] },
        { type: "heading", text: "プラットフォーム別おすすめの考え方" },
        { type: "paragraph", text: platforms.ps5 },
        { type: "paragraph", text: platforms.xbox },
        { type: "paragraph", text: platforms.switch },
        { type: "paragraph", text: platforms.pc },
        { type: "heading", text: `まず候補にしたい「${mainShort}」` },
        { type: "paragraph", text: `価格・レビュー評価ともにバランスが良く、初めて検討する場合にも選びやすいモデルです。楽天市場での評価も高く、実際のユーザーから支持されています。スペックや実際の価格は下記から確認できます。` },
        { type: "paragraph", text: `特にこのモデルが向いているのは、コストパフォーマンスを重視しつつも品質を妥協したくない方です。初めての${catTitle}として購入した後も長く使い続けられる耐久性が評価されています。` },
        { type: "product", category, keyword: main.keyword, note: "価格・在庫状況は変動するため、購入前に最新情報を確認しておきましょう。" },
        { type: "heading", text: `比較候補としておすすめの「${subShort}」` },
        { type: "paragraph", text: `先ほどのモデルとは異なる強みを持っており、用途や優先順位によってはこちらの方が満足度が高くなる場合があります。比較することで自分に合った基準が明確になります。` },
        { type: "paragraph", text: `このモデルは特定の機能やデザインにこだわりたい方、または先に紹介したモデルの弱点をカバーしたい方に向いています。気になる場合は実際のレビューや価格もあわせてチェックしてみてください。` },
        { type: "product", category, keyword: sub.keyword, note: "用途や好みに応じて、上のモデルと比較しながら検討してみてください。" },
        { type: "heading", text: "どちらを選ぶべき？シーン別アドバイス" },
        { type: "list", items: [
          `「とにかく失敗したくない・定番を選びたい」→ ${mainShort}`,
          `「特定の機能にこだわりがある・上位機能を試したい」→ ${subShort}`,
          `「まず予算を抑えたい・試しに使ってみたい」→ 価格が安い方から入る`,
          `「長く使い続けたい・投資として考える」→ 評価・レビュー数が多い方を選ぶ`,
        ] },
        { type: "heading", text: "よくある質問" },
        { type: "faq", items: faqs },
        { type: "heading", text: "まとめ" },
        { type: "paragraph", text: `${catTitle}選びは「対応機種」「価格と性能のバランス」「長時間使用時の快適さ」の3点を軸に考えると失敗しにくくなります。今回紹介した2モデルはどちらも実績のある人気製品なので、予算と用途に合わせて選んでみてください。さらに詳しい比較情報は[ランキングページ](/${category})もあわせてご覧ください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "選び方", "比較", "2026"] };
    },
  },

  headToHead: {
    label: "比較レビュー",
    build(category, products, rng) {
      const [a, b] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const aShort = shortProductName(a.name);
      const bShort = shortProductName(b.name);
      const faqs = CATEGORY_FAQS[category] ?? CATEGORY_FAQS.controllers;
      const title = `「${aShort}」vs「${bShort}」徹底比較2026｜どちらを選ぶべき？`;
      const description = clampDescription(`人気${catTitle}「${aShort}」と「${bShort}」を5つの観点で比較。価格差・性能差・どんな人に向いているかを解説します。`);
      const blocks = [
        { type: "paragraph", text: `今回は${catTitle}の中でも特に人気の高い「${aShort}」と「${bShort}」を徹底比較します。価格帯が近く、どちらにしようか迷っている方が多いこの2製品について、実際のスペックとユーザー評価を踏まえて解説します。` },
        { type: "paragraph", text: `結論から言うと、どちらが優れているかはプレイスタイルと用途によって変わります。この記事を読めば「自分にはどちらが合うか」が明確になるはずです。` },
        { type: "heading", text: "2製品の主な違い" },
        { type: "list", items: [
          `価格帯: ${aShort}（楽天市場で確認）vs ${bShort}（楽天市場で確認）`,
          "対応プラットフォーム: 各製品の対応機種を購入前に確認",
          "接続方式・ワイヤレス有無",
          "保証期間・サポート体制",
        ] },
        { type: "heading", text: `「${aShort}」の特徴と強み` },
        { type: "paragraph", text: `楽天市場でのレビュー評価が高い実績モデルです。特に「使いやすさ」「コストパフォーマンス」の点で高い評価を得ています。デザインもシンプルで日本のゲーマーに馴染みやすいシルエットです。` },
        { type: "paragraph", text: `このモデルが特に向いているのは、初めて本格的な${catTitle}を購入する方や、複数のゲーム機で使い回したい方です。汎用性の高さが最大の魅力と言えます。` },
        { type: "product", category, keyword: a.keyword, note: "まず最初の候補として検討したいモデルです。" },
        { type: "heading", text: `「${bShort}」の特徴と強み` },
        { type: "paragraph", text: `先ほどのモデルとは異なるアプローチで設計されており、特定の用途では圧倒的な強みを発揮します。比較することで自分の優先順位が明確になります。` },
        { type: "paragraph", text: `このモデルは特定の機能にこだわりたい方、またはより上位のスペックを求める方に向いています。予算が許すなら長期的な満足度が高い選択肢になり得ます。` },
        { type: "product", category, keyword: b.keyword, note: "予算や用途に応じて、こちらも有力な候補になります。" },
        { type: "heading", text: "どちらを選ぶべき？ユーザータイプ別の答え" },
        { type: "list", items: [
          `初めての購入・コスパ優先 → 価格が安い方から試す`,
          `長く使いたい・高品質を求める → レビュー件数・評価が高い方`,
          `特定のゲーム機専用で使う → そのプラットフォーム対応が明確な方`,
          `複数機種で使い回したい → マルチプラットフォーム対応の方`,
        ] },
        { type: "heading", text: "よくある質問" },
        { type: "faq", items: faqs },
        { type: "heading", text: "まとめ" },
        { type: "paragraph", text: `「${aShort}」と「${bShort}」はどちらも優れた${catTitle}ですが、用途や予算によって向き不向きがあります。自分のプレイスタイルを基準に、後悔しない選択をしてください。さらに多くのモデルと比較したい場合は[ランキングページ](/${category})もあわせてチェックしてみてください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "比較", "レビュー", "2026"] };
    },
  },

  useCase: {
    label: "シーン別おすすめ",
    build(category, products, rng) {
      const scenarios = {
        controllers: ["FPSタイトルで勝率を上げたい人", "長時間のRPGプレイを快適にしたい人", "コスパ重視で初めての一台を探している人"],
        headsets: ["足音や銃声の方向を正確に聞き取りたいFPSプレイヤー", "長時間プレイでも疲れにくいヘッドセットを探している人", "PS5・Xboxを併用しているマルチプラットフォーム派"],
        monitors: ["PS5の120fps出力を活かしたいハイスペック志向の人", "コストを抑えつつ高リフレッシュレートを体験したい人", "映画やオープンワールド系で没入感を重視したい人"],
        keyboards: ["タイピングの打鍵感にこだわりたい人", "コンパクトなTKLレイアウトで省スペースにしたい人", "ワイヤレスでスッキリしたデスク環境を作りたい人"],
        mice: ["FPSで精密なエイムを追求したい人", "長時間プレイでも手が疲れにくいマウスを探している人", "軽量ワイヤレスでケーブルレスを実現したい人"],
        chairs: ["長時間ゲームをしても腰や背中が痛くなりにくい椅子を探している人", "部屋のインテリアに合うおしゃれなゲーミングチェアが欲しい人", "コスパ重視でゲーミングチェアを初めて購入したい人"],
        capture: ["PS5・XboxのゲームプレイをYouTubeやTwitchで配信したい人", "高画質4K映像をキャプチャして保存したい人", "手軽に配信を始めたい初心者向けキャプチャーボードを探している人"],
      };
      const scenario = pick(rng, scenarios[category] ?? scenarios.controllers);
      const [main, sub] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const mainShort = shortProductName(main.name);
      const subShort = shortProductName(sub.name);
      const faqs = CATEGORY_FAQS[category] ?? CATEGORY_FAQS.controllers;
      const title = `${scenario}向け${catTitle}おすすめ2選2026｜目的別に厳選`;
      const description = clampDescription(`「${scenario}」におすすめの${catTitle}を2つ厳選。選び方のポイントから実際の使用感まで詳しく解説します。`);
      const blocks = [
        { type: "paragraph", text: `${catTitle}選びは、自分がどんな場面で使うことが多いかを軸に考えると失敗しにくくなります。今回は「${scenario}」を想定した方に向けて、特に満足度の高い2モデルを紹介します。` },
        { type: "paragraph", text: `ゲーミングデバイスは一度購入すると数年使い続けることになるため、「今の自分の用途に本当に合っているか」を慎重に見極めることが大切です。この記事では用途ベースで具体的なモデルを紹介するので、迷っている方の判断材料にしてください。` },
        { type: "heading", text: `「${scenario}」に最適な${catTitle}の選び方` },
        { type: "list", items: [
          "まず対応プラットフォームを絞る（PS5・Xbox・Switch・PC）",
          "価格帯を決める（エントリー・ミドル・ハイエンド）",
          "この用途で特に重要なスペックを確認する",
          "実際のユーザーレビュー数と評価点をチェックする",
        ] },
        { type: "heading", text: `おすすめ①：${mainShort}` },
        { type: "paragraph", text: `この用途においてバランスの良い性能を備えたモデルです。「${scenario}」というシーンで実際にユーザーからの評価が高く、長期間使っても満足度が落ちにくい設計になっています。` },
        { type: "paragraph", text: `価格と性能のバランスが優れており、コストパフォーマンス重視の方にもおすすめできます。楽天市場でのレビュー評価も参考にしながら、購入前に最新価格を確認してください。` },
        { type: "product", category, keyword: main.keyword, note: `「${scenario}」に適した特徴を持つモデルです。` },
        { type: "heading", text: `おすすめ②：${subShort}` },
        { type: "paragraph", text: `予算やこだわりたいポイントによっては、こちらのモデルも有力な選択肢になります。先ほどのモデルと比べて異なる強みを持っており、特定の用途では上回るパフォーマンスを発揮します。` },
        { type: "paragraph", text: `特にこのモデルは「${scenario}」という場面で頻繁に言及されるモデルで、実際に使っているユーザーからの口コミも充実しています。` },
        { type: "product", category, keyword: sub.keyword, note: "用途や予算に応じて、上のモデルと比較しながら検討してみてください。" },
        { type: "heading", text: "どちらが自分に向いているか判断するポイント" },
        { type: "list", items: [
          `「${scenario}」が主な用途で予算を抑えたい → ${mainShort}から試す`,
          `長く使い続けたい・少し予算を出せる → ${subShort}を検討`,
          `複数のゲーム機で使い回したい → 対応プラットフォームが多い方を選ぶ`,
          `まず試したい → 返品・保証が充実しているショップで購入する`,
        ] },
        { type: "heading", text: "よくある質問" },
        { type: "faq", items: faqs },
        { type: "heading", text: "まとめ" },
        { type: "paragraph", text: `「${scenario}」を想定するなら、上記の2モデルはどちらも有力な候補です。最終的には自分の予算とプレイスタイルに合わせて選んでください。より幅広い製品を比較したい場合は[ランキングページ](/${category})もあわせてチェックしてみてください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "シーン別", "おすすめ", "2026"] };
    },
  },

  budgetGuide: {
    label: "予算別おすすめ",
    build(category, products, rng) {
      const [a, b] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const cheaper = a.price <= b.price ? a : b;
      const premium = a.price <= b.price ? b : a;
      const budgets = {
        controllers: ["1万円以下", "1〜2万円", "2万円以上"],
        headsets: ["1万円以下", "1〜3万円", "3万円以上"],
        monitors: ["3万円以下", "3〜6万円", "6万円以上"],
        keyboards: ["1万円以下", "1〜2万円", "2万円以上"],
        mice: ["5千円以下", "5千〜1万5千円", "1万5千円以上"],
        chairs: ["2万円以下", "2〜5万円", "5万円以上"],
        capture: ["1万円以下", "1〜3万円", "3万円以上"],
      };
      const budgetList = budgets[category] ?? budgets.controllers;
      const cheaperShort = shortProductName(cheaper.name);
      const premiumShort = shortProductName(premium.name);
      const faqs = CATEGORY_FAQS[category] ?? CATEGORY_FAQS.controllers;
      const title = `${catTitle}を予算で選ぶ2026｜${cheaperShort}vs${premiumShort}を徹底比較`;
      const description = clampDescription(`${catTitle}を予算で選ぶ際のポイントを解説しながら、コスパ重視モデルと本格派モデルの2択を詳しく比較します。後悔しない選び方を教えます。`);
      const blocks = [
        { type: "paragraph", text: `${catTitle}は価格帯によって性能や機能が大きく変わります。この記事では「できるだけコスパよく揃えたい」「多少高くても満足できるものが欲しい」という2つのニーズに応える選び方と、具体的なおすすめモデルを紹介します。` },
        { type: "paragraph", text: `ゲーミングデバイスへの投資は「安いものを何度も買い替える」より「少し高くても長く使えるものを選ぶ」方が長期的にはコスパが良いケースが多いです。予算の上限と使用期間を考慮して決めることをおすすめします。` },
        { type: "heading", text: "価格帯ごとに何が変わるか" },
        { type: "list", items: [
          `${budgetList[0]}（エントリー）：必要最低限の機能は揃う。耐久性・音質・ビルドクオリティに妥協が生じる場合あり`,
          `${budgetList[1]}（ミドル）：コスパと性能のバランスが最も良い価格帯。長く使えるモデルが多い`,
          `${budgetList[2]}（ハイエンド）：プロ仕様の機能・素材・耐久性。長期間の使用や競技用途を想定`,
        ] },
        { type: "heading", text: `コスパ重視派におすすめ：${cheaperShort}` },
        { type: "paragraph", text: `価格を抑えつつも必要な機能をしっかり備えたモデルです。はじめての購入や予算を重視したい方に特におすすめです。安価だからといって品質を大きく妥協しているわけではなく、このカテゴリにおけるコストパフォーマンスの基準となる一台です。` },
        { type: "paragraph", text: `レビュー評価も高く、多くのユーザーが満足して使っているという実績があります。まず試してみたいという方にも向いており、入手しやすい価格帯で選びやすいのもメリットです。` },
        { type: "product", category, keyword: cheaper.keyword, note: "コスパ重視の定番候補。価格と性能のバランスが良いモデルです。" },
        { type: "heading", text: `本格派におすすめ：${premiumShort}` },
        { type: "paragraph", text: `価格は上がりますが、その分より高い性能・耐久性・快適さが得られます。長く使い続けることを考えると、こちらを選ぶのも賢明な選択です。ハイエンドな機能を体験することで、ゲームプレイ全体のクオリティが上がることを実感できます。` },
        { type: "paragraph", text: `初期投資は大きくなりますが、耐久性が高いため長期間使えることが多く、結果的にコスパが良くなるケースもあります。予算に余裕がある方や、趣味に投資するという考え方の方に向いています。` },
        { type: "product", category, keyword: premium.keyword, note: "長く使うなら投資する価値のある本格派モデルです。" },
        { type: "heading", text: "長期的なコストで考えるとどちらがお得？" },
        { type: "paragraph", text: `安いモデルを2〜3年で買い替える場合と、高いモデルを5〜6年使い続ける場合を比較すると、後者の方が年間コストが低くなることが多いです。${catTitle}は消耗品ではないため、品質の高いものを選ぶ「少数精鋭」の考え方が結果的に賢い選択になります。` },
        { type: "heading", text: "よくある質問" },
        { type: "faq", items: faqs },
        { type: "heading", text: "まとめ：どちらを選ぶべき？" },
        { type: "paragraph", text: `まず試してみたい・予算を抑えたいなら「${cheaperShort}」、長く使いたい・性能にこだわりたいなら「${premiumShort}」がおすすめです。どちらも実績のあるモデルなので、あとは自分の予算と用途で判断してください。他のモデルとも比較したい場合は[ランキングページ](/${category})もあわせてチェックしてみてください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "予算別", "コスパ", "2026"] };
    },
  },

  beginnerPick: {
    label: "初心者向けガイド",
    build(category, products, rng) {
      const [main] = pickTwoDistinct(rng, products);
      const catTitle = CATEGORY_TITLES[category];
      const checkpoints = {
        controllers: ["対応ゲーム機（PS5・Xbox・PC）を確認する", "有線か無線かを決める", "プロコンが必要かどうかを考える", "バッテリー持続時間を確認する"],
        headsets: ["有線か無線かを決める", "対応プラットフォームを確認する", "マイク性能が必要かどうかを考える", "装着感（密閉型 vs 開放型）を確認する"],
        monitors: ["対応解像度とリフレッシュレートを確認する", "接続端子（HDMI・DisplayPort）を確認する", "画面サイズと設置場所を測る", "応答速度（GTG）を確認する"],
        keyboards: ["スイッチの種類（赤・青・茶軸）を選ぶ", "レイアウト（フルサイズ・TKL・60%）を決める", "有線か無線かを選ぶ", "日本語配列か英語配列かを確認する"],
        mice: ["持ち方（かぶせ・つかみ・つまみ）を確認する", "重量（軽量か標準か）を選ぶ", "有線か無線かを選ぶ", "DPI（解像度）の調整機能を確認する"],
        chairs: ["対応体重・身長を確認する", "素材（レザー vs ファブリック）を選ぶ", "リクライニング角度を確認する", "アームレストの調整範囲を確認する"],
        capture: ["対応解像度（1080p か 4K か）を確認する", "パススルー機能があるか確認する", "接続方式（USB か PCIe か）を選ぶ", "スタンドアロン録画が必要かを考える"],
      };
      const mistakes = {
        controllers: ["対応機種を確認せず購入してゲーム機で使えなかった", "廉価品を選んでスティックドリフトに悩まされた", "無線の遅延が気になりすぎて有線に戻した"],
        headsets: ["マイクが別売りだと気づかず購入した", "PS5専用モデルをXboxで使おうとして動作しなかった", "装着感を試さずに購入して長時間使用がつらかった"],
        monitors: ["リフレッシュレートが低いモニターを買ってゲームに最適でなかった", "入力端子が合わずケーブルを追加購入した", "サイズが大きすぎてデスクに収まらなかった"],
        keyboards: ["軸の打鍵感が想像と違った（特に青軸の音の大きさ）", "英語配列を購入したが日本語入力で混乱した", "有線を選んだがケーブルの取り回しが煩わしかった"],
        mice: ["グリップスタイルに合わないマウスを選んで手が疲れた", "重すぎるマウスで長時間プレイが辛くなった", "センサー精度が低く狙い通りのエイムができなかった"],
        chairs: ["対応体重を超えていて座り心地が悪かった", "組み立てが一人では困難だった", "ランバーサポートの位置が合わず腰痛が改善しなかった"],
        capture: ["4K非対応のモデルを購入して後から後悔した", "パススルーなしを選んでゲームプレイ中の遅延が気になった", "PCスペックが不足していてソフトがカクカクした"],
      };
      const mistakeList = mistakes[category] ?? mistakes.controllers;
      const mainShort = shortProductName(main.name);
      const faqs = CATEGORY_FAQS[category] ?? CATEGORY_FAQS.controllers;
      const title = `${catTitle}初心者ガイド2026｜失敗しない選び方と最初の一台のおすすめ`;
      const description = `${catTitle}を初めて購入する方向けに、失敗しない選び方と最初の一台として最適なモデルを解説。初心者がよくやる失敗例もまとめました。`;
      const blocks = [
        { type: "paragraph", text: `「${catTitle}はどれを買えばいいかわからない」という初心者の方向けに、選ぶ際に押さえておきたいポイントと、実際に購入を検討しやすいモデルをまとめました。難しい専門知識がなくても読めるよう、シンプルに解説します。` },
        { type: "paragraph", text: `初めての${catTitle}購入で最も大切なのは「スペックより自分の用途に合っているか」です。高機能な製品が必ずしも自分に合うとは限りません。まずは自分のゲームスタイルと予算を明確にすることから始めましょう。` },
        { type: "heading", text: "初心者が陥りがちな失敗3選" },
        { type: "list", items: mistakeList },
        { type: "heading", text: "購入前に確認すべき4つのポイント" },
        { type: "list", items: checkpoints[category] ?? checkpoints.controllers },
        { type: "heading", text: "初心者におすすめの最初の一台" },
        { type: "paragraph", text: `上記のポイントを踏まえたうえで、初めての${catTitle}として特に選びやすいモデルを紹介します。価格・レビュー評価・使いやすさのバランスが良く、多くの方が満足しているモデルです。` },
        { type: "paragraph", text: `このモデルをおすすめする理由は、初めて使う方でも迷わないシンプルな設計と、万が一の際の保証・サポート体制が整っている点です。長く使える耐久性も兼ね備えており、初期投資として後悔しにくい一台です。` },
        { type: "product", category, keyword: main.keyword, note: `初めての${catTitle}として失敗しにくいバランスの良いモデルです。` },
        { type: "heading", text: "最初はこれで大丈夫、慣れたらアップグレードを検討" },
        { type: "paragraph", text: `最初から高価なモデルを買う必要はありません。まずは上記のモデルで${catTitle}の使い心地を体験してみて、「もっとこういう機能が欲しい」「ここが物足りない」と感じた段階でアップグレードを検討するのが失敗しにくい買い方です。` },
        { type: "paragraph", text: `ゲーミングデバイスは実際に使ってみて初めて「何が自分に必要か」がわかるものです。焦らず、まずは手の届く価格帯から始めることをおすすめします。さらに詳しい比較は[ランキングページ](/${category})もあわせてご覧ください。` },
        { type: "heading", text: "よくある質問" },
        { type: "faq", items: faqs },
        { type: "heading", text: "まとめ" },
        { type: "paragraph", text: `${catTitle}選びの最重要ポイントは「対応機種の確認」「自分の用途に合った機能を選ぶ」「最初から高価なものを買わない」の3点です。今回紹介したモデルはこれらすべてを満たした、初心者に最適な一台です。ぜひ参考にしてください。` },
      ];
      return { title, description, blocks, tags: [catTitle, "初心者", "入門", "2026"] };
    },
  },
};

const THEME_KEYS = Object.keys(THEMES);
const CATEGORY_KEYS = Object.keys(CATEGORY_TITLES);

function slugify(category, themeKey, dateStr, index) {
  return `${category}-${themeKey}-${dateStr}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function todayDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function generateForDate(date) {
  const dateStr = todayDateStr(date);
  const productsByCategory = Object.fromEntries(CATEGORY_KEYS.map((c) => [c, loadProducts(c)]));

  if (!existsSync(ARTICLES_DIR)) mkdirSync(ARTICLES_DIR, { recursive: true });

  const created = [];
  for (let i = 0; i < ARTICLES_PER_DAY; i++) {
    const rng = makeRng(seedFromString(`${dateStr}-${i}`));
    const category = CATEGORY_KEYS[i % CATEGORY_KEYS.length];
    const themeKey = pick(rng, THEME_KEYS);
    const theme = THEMES[themeKey];
    const products = productsByCategory[category];

    const slug = slugify(category, themeKey, dateStr, i);
    const filePath = resolve(ARTICLES_DIR, `${slug}.json`);
    if (existsSync(filePath)) {
      console.log(`スキップ（既存）: ${slug}`);
      continue;
    }

    const { title, description, blocks, tags } = theme.build(category, products, rng);
    const article = {
      slug,
      title,
      description,
      category,
      publishedAt: dateStr,
      updatedAt: dateStr,
      tags,
      blocks,
    };

    writeFileSync(filePath, JSON.stringify(article, null, 2) + "\n", "utf-8");
    created.push(slug);
    console.log(`生成: ${slug}  [${theme.label} / ${CATEGORY_TITLES[category]}]`);
  }

  return created;
}

const created = generateForDate(new Date());
console.log(`\n完了: ${created.length}本の記事を新規生成しました。`);
