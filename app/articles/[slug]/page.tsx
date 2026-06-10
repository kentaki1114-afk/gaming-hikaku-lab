import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { getProducts } from "@/lib/products";
import { ArticleProductCard } from "@/app/components/ArticleProductCard";
import { ArticleRichText } from "@/app/components/ArticleRichText";
import { AuthorCard } from "@/app/components/AuthorCard";

const CATEGORY_LABELS: Record<string, string> = {
  controllers: "コントローラー",
  headsets: "ヘッドセット",
  monitors: "モニター",
  keyboards: "キーボード",
  mice: "マウス",
  chairs: "ゲーミングチェア",
  capture: "キャプチャーボード",
};

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | ゲーミング比較ラボ`,
    description: article.description,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const { items } = getProducts(article.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: "けんたき",
      description: "ゲーム歴10年。Apex Legends（pad）でプレデター4シーズン維持、フォートナイト（キーボード&マウス）でアンリアル達成。",
    },
    publisher: { "@type": "Organization", name: "ゲーミング比較ラボ" },
    mainEntityOfPage: `${SITE_ORIGIN}/articles/${article.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "記事一覧", item: `${SITE_ORIGIN}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_ORIGIN}/articles/${article.slug}` },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <nav className="text-sm text-slate-500 mb-6">
        <span>ホーム</span> &gt; <Link href="/articles" className="hover:text-violet-400">記事一覧</Link> &gt;{" "}
        <span className="text-violet-400">{CATEGORY_LABELS[article.category]}</span>
      </nav>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-violet-600/20 text-violet-300 border-violet-500/30">
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(article.publishedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })} 公開
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-4">{article.title}</h1>
        <p className="text-slate-400 leading-relaxed">{article.description}</p>
      </header>

      <AuthorCard comment="ゲーム歴10年。Apexはpadでプレデターをフォートナイトはキーマウでアンリアルを達成。実際に使ってきた経験をもとに書いています。" />

      <div className="space-y-5">
        {article.blocks.map((block, i) => {
          switch (block.type) {
            case "heading":
              return (
                <h2 key={i} className="text-xl md:text-2xl font-bold text-white mt-10 mb-2">
                  {block.text}
                </h2>
              );
            case "paragraph":
              return (
                <p key={i} className="text-slate-300 leading-relaxed">
                  <ArticleRichText text={block.text} />
                </p>
              );
            case "list":
              return (
                <ul key={i} className="space-y-2 list-none">
                  {block.items.map((item) => (
                    <li key={item} className="text-slate-300 flex gap-2 leading-relaxed">
                      <span className="text-violet-400 flex-shrink-0">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            case "product": {
              const product = items.find((it) => it.keyword === block.keyword);
              if (!product) return null;
              return <ArticleProductCard key={i} product={product} note={block.note} />;
            }
            default:
              return null;
          }
        })}
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-700/50">
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
              #{tag}
            </span>
          ))}
        </div>
        <Link
          href={`/${article.category}`}
          className="inline-block bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          {CATEGORY_LABELS[article.category]}ランキングを見る →
        </Link>
      </footer>
    </article>
  );
}
