import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { getAllCategories, ACCENT_BADGE_CLASSES, DEFAULT_BADGE_CLASS } from "@/lib/categories";

export const metadata: Metadata = {
  title: "記事一覧 | ゲーミング比較ラボ",
  description: "PS5・Xbox周辺機器に関する選び方ガイドやレビュー記事の一覧です。コントローラー・ヘッドセット・モニターなど全カテゴリの最新情報をお届けします。",
  alternates: { canonical: "/articles" },
};

const PAGE_SIZE = 20;

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const allArticles = getAllArticles();
  const categories = getAllCategories();

  const activeCategory = searchParams.category ?? "all";
  const currentPage = Math.max(1, Number(searchParams.page ?? "1"));

  const filtered = activeCategory === "all"
    ? allArticles
    : allArticles.filter((a) => a.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const labelOf = (slug: string) =>
    categories.find((c) => c.slug === slug)?.navLabel ?? slug;
  const badgeClassOf = (slug: string) => {
    const accent = categories.find((c) => c.slug === slug)?.accentColor;
    return (accent && ACCENT_BADGE_CLASSES[accent]) || DEFAULT_BADGE_CLASS;
  };

  const tabHref = (cat: string, page = 1) => {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (page > 1) params.set("page", String(page));
    const q = params.toString();
    return `/articles${q ? `?${q}` : ""}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-violet-400 transition-colors">ホーム</Link> &gt;{" "}
        <span className="text-violet-400">記事一覧</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">記事一覧</h1>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          PS5・Xbox周辺機器の選び方ガイドやレビュー記事をまとめています。製品ランキングとあわせて、購入前のチェックにお役立てください。
        </p>
      </div>

      {/* カテゴリタブ */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={tabHref("all")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            activeCategory === "all"
              ? "bg-violet-600 text-white border-violet-500"
              : "text-slate-400 border-slate-700 hover:border-violet-500/50 hover:text-slate-200"
          }`}
        >
          すべて（{allArticles.length}）
        </Link>
        {categories.map((cat) => {
          const count = allArticles.filter((a) => a.category === cat.slug).length;
          if (count === 0) return null;
          const accent = ACCENT_BADGE_CLASSES[cat.accentColor] ?? DEFAULT_BADGE_CLASS;
          return (
            <Link
              key={cat.slug}
              href={tabHref(cat.slug)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat.slug
                  ? `${accent} opacity-100`
                  : "text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {cat.navLabel}（{count}）
            </Link>
          );
        })}
      </div>

      {/* 記事リスト */}
      {paged.length === 0 ? (
        <p className="text-slate-400">該当する記事がありません。</p>
      ) : (
        <div className="space-y-5">
          {paged.map((article) => (
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
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link
              href={tabHref(activeCategory, currentPage - 1)}
              className="px-4 py-2 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:border-violet-500/50 transition-colors"
            >
              ← 前へ
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={tabHref(activeCategory, p)}
              className={`px-4 py-2 text-sm rounded-xl border transition-colors ${
                p === currentPage
                  ? "bg-violet-600 text-white border-violet-500"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-violet-500/50 hover:text-slate-200"
              }`}
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link
              href={tabHref(activeCategory, currentPage + 1)}
              className="px-4 py-2 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:border-violet-500/50 transition-colors"
            >
              次へ →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
