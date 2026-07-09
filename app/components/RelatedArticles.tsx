import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { getCategoryMeta } from "@/lib/categories";

/**
 * 同カテゴリの関連記事リスト（内部リンク強化用）。
 * - カテゴリ（ランキング）ページ: <RelatedArticles category="controllers" />
 * - 記事ページ: <RelatedArticles category={article.category} excludeSlug={article.slug} />
 * 記事が0件の場合は何も描画しない。
 */
export function RelatedArticles({
  category,
  excludeSlug,
  limit = 4,
}: {
  category: string;
  excludeSlug?: string;
  limit?: number;
}) {
  // 手書きの柱記事（featured）を自動生成記事より優先して内部リンクを集める
  const articles = getAllArticles()
    .filter((a) => a.category === category && a.slug !== excludeSlug)
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    .slice(0, limit);

  if (articles.length === 0) return null;

  const label = getCategoryMeta(category)?.navLabel ?? category;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-xl font-bold text-white">{label}の関連記事</h2>
        <Link
          href="/articles"
          className="text-violet-400 hover:text-violet-300 text-sm font-medium whitespace-nowrap"
        >
          記事一覧へ →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="block bg-slate-800 border border-slate-700 hover:border-violet-500/40 rounded-2xl p-5 transition-all"
          >
            <span className="text-xs text-slate-500 block mb-2">
              {new Date(article.publishedAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <h3 className="font-bold text-white text-sm md:text-base mb-1 leading-snug">
              {article.title}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
