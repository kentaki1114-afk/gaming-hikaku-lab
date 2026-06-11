import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | ゲーミング比較ラボ",
  description: "ゲーミング比較ラボのプライバシーポリシーです。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">プライバシーポリシー</h1>

      <div className="space-y-10 text-slate-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3">運営者情報</h2>
          <p>サイト名：ゲーミング比較ラボ<br />運営者：けんたき<br />お問い合わせ：kentaki1114@gmail.com</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">個人情報の取り扱いについて</h2>
          <p>当サイトでは、お問い合わせなどの際に氏名・メールアドレス等の個人情報をご提供いただく場合があります。取得した個人情報は、お問い合わせへの回答のみに使用し、第三者への提供は行いません。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">Cookieの使用について</h2>
          <p>当サイトでは、アクセス解析のためにGoogle Analytics（Googleが提供するサービス）を利用しています。Google AnalyticsはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。</p>
          <p className="mt-3">Cookieの収集を拒否したい場合は、ブラウザの設定からCookieを無効にすることができます。また、<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Google Analytics オプトアウトアドオン</a>を導入することでも無効化できます。</p>
          <p className="mt-3">Google Analyticsの利用規約・プライバシーポリシーについては<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Googleのサイト</a>をご確認ください。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">アフィリエイトについて</h2>
          <p>当サイトは、楽天市場のアフィリエイトプログラム（楽天アフィリエイト）に参加しています。記事内に掲載された商品リンクから購入いただいた場合、当サイトが一定の報酬を受け取ることがあります。</p>
          <p className="mt-3">なお、掲載している商品の評価・ランキングは報酬の有無にかかわらず、編集部の独自基準に基づいて作成しています。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">免責事項</h2>
          <p>当サイトの情報は可能な限り正確を期していますが、内容の正確性・完全性・有用性を保証するものではありません。当サイトの情報を参考にした結果生じたいかなる損害についても、運営者は責任を負いかねます。</p>
          <p className="mt-3">また、当サイトからリンクされている外部サイトの内容については、当サイトが管理するものではなく、一切の責任を負いません。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">著作権について</h2>
          <p>当サイトに掲載されているテキスト・画像等のコンテンツの著作権は、運営者または正当な権利を有する第三者に帰属します。無断転載・複製はご遠慮ください。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">プライバシーポリシーの変更</h2>
          <p>本ポリシーは必要に応じて改訂することがあります。改訂後のポリシーはこのページに掲載した時点から効力を生じるものとします。</p>
        </section>

        <p className="text-slate-500 text-sm">制定日：2026年6月9日</p>
      </div>
    </div>
  );
}
