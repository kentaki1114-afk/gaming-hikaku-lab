import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { getAllCategories, ACCENT_BADGE_CLASSES, DEFAULT_BADGE_CLASS } from "@/lib/categories";

export const metadata: Metadata = {
  title: "記事一覧 | ゲーミング比較ラボ",
  description: "PS5・Xbox周辺機器に関する選び方ガイドやレビュー記事の一覧です。コントローラー・ヘッドセット・モニターなど全カテゴリの最新情報をお届けします。",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const labelOf = (slug: string) =>
    categories.find((c) => c.slug === slug)?.navLabel ?? slug;
  const badgeClassOf = (slug: string) => {
    const accent = categories.find((c) => c.slug === slug)?.accentColor;
    return (accent && ACCENT_BADGE_CLASSES[accent]) || DEFAULT_BADGE_CLASS;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <span className="text-violet-400">記事一覧</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">記事一覧</h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox周辺機器の選び方ガイドやレビュー記事をまとめています。製品ランキングとあわせて、購入前のチェックにお役立てください。
        </p>
      </div>

      <div className="space-y-5">
        {articles.map((article) => (
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
            <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">{article.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
