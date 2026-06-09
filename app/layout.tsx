import type { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { BackHomeBar } from "@/app/components/BackHomeBar";
import { getAllCategories } from "@/lib/categories";
import "./globals.css";

const SITE_ORIGIN = "https://gaming-hikaku-lab.vercel.app";
const SITE_NAME = "ゲーミング比較ラボ";
const SITE_TITLE = "ゲーミング比較ラボ | PS5・Xbox周辺機器おすすめ比較";
const SITE_DESCRIPTION =
  "PS5・Xbox対応のコントローラー、ヘッドセット、モニターをガチで比較。実際にプレイしたレビューをもとに、あなたに最適な周辺機器を見つけよう。";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_ORIGIN),
  verification: {
    google: "jOOPrqp1TFD2FWFuZWSuyaswZoKoZkDc0jOX8FxXcNY",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_ORIGIN}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_ORIGIN}/opengraph-image`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 antialiased">
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <span className="font-bold text-lg text-white">ゲーミング比較ラボ</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <div className="relative group">
                <button className="text-slate-300 hover:text-violet-400 transition-colors flex items-center gap-1">
                  ランキング <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-2">
                    {categories.map((cat) => (
                      <Link key={cat.slug} href={`/${cat.slug}`} className="block px-4 py-2 text-slate-300 hover:text-violet-400 hover:bg-slate-700/50 transition-colors">{cat.navLabel}</Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/articles" className="text-slate-300 hover:text-violet-400 transition-colors">
                記事
              </Link>
            </nav>
            <nav className="md:hidden flex gap-3 text-xs font-medium overflow-x-auto">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/${cat.slug}`} className="text-slate-300 hover:text-violet-400 whitespace-nowrap">{cat.navLabelShort}</Link>
              ))}
              <Link href="/articles" className="text-slate-300 hover:text-violet-400 whitespace-nowrap">記事</Link>
            </nav>
          </div>
        </header>

        <BackHomeBar />
        <main className="flex-1">{children}</main>
        <GoogleAnalytics gaId="G-7J7E3SX9X7" />

        <footer className="bg-slate-800/50 border-t border-slate-700/50 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🎮</span>
                  <span className="font-bold text-white">ゲーミング比較ラボ</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  PS5・Xbox ユーザーのための周辺機器比較サイト。実際のゲーマー目線でコントローラー・ヘッドセット・モニターを徹底比較します。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">カテゴリ</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  {categories.map((cat) => (
                    <li key={cat.slug}><Link href={`/${cat.slug}`} className="hover:text-violet-400 transition-colors">{cat.navLabel}ランキング</Link></li>
                  ))}
                  <li><Link href="/articles" className="hover:text-violet-400 transition-colors">記事一覧</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">サイトについて</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  当サイトはAmazon・楽天市場等のアフィリエイトプログラムに参加しています。記事内のリンクから購入いただくと、サイト運営の収益になります。
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/privacy" className="hover:text-violet-400 transition-colors">プライバシーポリシー</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-violet-400 transition-colors">免責事項</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700/50 pt-6 text-center text-slate-500 text-xs">
              © 2026 ゲーミング比較ラボ. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
