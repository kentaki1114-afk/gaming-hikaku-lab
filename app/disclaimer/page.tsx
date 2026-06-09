import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項 | ゲーミング比較ラボ",
  description: "ゲーミング比較ラボの免責事項・サイトポリシーです。",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">免責事項</h1>

      <div className="space-y-10 text-slate-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3">情報の正確性について</h2>
          <p>当サイト（ゲーミング比較ラボ）に掲載している商品情報・価格・スペック等は、記事作成時点の情報をもとにしています。最新の情報は各販売ページにてご確認ください。</p>
          <p className="mt-3">価格・在庫状況は楽天市場のAPIを通じて定期的に更新していますが、実際の販売価格と異なる場合があります。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">広告・PR表記について</h2>
          <p>当サイトは楽天市場のアフィリエイトプログラムに参加しており、商品リンクから購入いただいた場合に報酬を受け取ることがあります（読者の購入価格には影響しません）。</p>
          <p className="mt-3">広告収益はサイトの運営・コンテンツ制作費用に充てています。掲載商品の評価はアフィリエイト報酬の有無にかかわらず、独自の基準に基づいて行っています。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">損害について</h2>
          <p>当サイトの情報を参考にして商品を購入した結果、利用者が損害を被った場合でも、当サイトおよび運営者は一切の責任を負いません。商品の購入はご自身の判断と責任においてお願いいたします。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">外部リンクについて</h2>
          <p>当サイトから外部サイトへのリンクを掲載していますが、リンク先の内容・サービスについては当サイトが管理するものではなく、責任を負いかねます。</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">お問い合わせ</h2>
          <p>当サイトに関するお問い合わせは下記までご連絡ください。</p>
          <p className="mt-2">運営者：けんたき<br />メール：<a href="mailto:kentaki1114@gmail.com" className="text-violet-400 hover:underline">kentaki1114@gmail.com</a></p>
        </section>

        <p className="text-slate-500 text-sm">制定日：2026年6月9日</p>
      </div>
    </div>
  );
}
