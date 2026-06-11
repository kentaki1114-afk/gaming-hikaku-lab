"use client";

import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import {
  ALL_PLATFORMS,
  PLATFORM_LABELS,
  isPlatform,
  type Platform,
} from "@/lib/platforms";
import { ProductRankingCard, type Editorial } from "./ProductRankingCard";

export type RankedItem = { product: Product; editorial: Editorial };

type ListProps = {
  items: RankedItem[];
  accentBorder: string;
  pointBg: string;
};

const TOP_N = 5;

/**
 * フィルタなしの素のランキングリスト(Top 5固定)。
 * useSearchParams を使わないため静的HTMLにそのまま出力でき、
 * PlatformFilteredRanking の Suspense fallback として使うことでSEO上のコンテンツを担保する。
 */
export function RankingList({ items, accentBorder, pointBg }: ListProps) {
  const top5 = items.slice(0, TOP_N);
  return (
    <div className="space-y-6">
      {top5.map(({ product, editorial }, i) => (
        <ProductRankingCard
          key={editorial.keyword}
          product={product}
          editorial={editorial}
          accentBorder={accentBorder}
          pointBg={pointBg}
          displayRank={i + 1}
        />
      ))}
    </div>
  );
}

/**
 * プラットフォーム絞り込み付きランキング。
 * - URLクエリ `?platform=ps5` と同期する（共有・ブックマーク可能）
 * - history.replaceState で更新するためサーバー再リクエストは発生しない
 * - SEO: 各ページの canonical は親URL（クエリなし）に設定済みのため、
 *   クエリ付きURLは親に正規化される。JSON-LD（ItemList）はサーバー側で全件のまま出力される。
 */
export function PlatformFilteredRanking({ items, accentBorder, pointBg }: ListProps) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("platform");
  const active: Platform | "all" = isPlatform(raw) ? raw : "all";

  const countOf = (platform: Platform) =>
    items.filter(({ editorial }) => editorial.platforms.includes(platform)).length;

  const select = (platform: Platform | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (platform === "all") {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }
    const qs = params.toString();
    // Next.js 14.1+ では history.replaceState が useSearchParams と同期する
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const filtered =
    active === "all"
      ? items.slice(0, TOP_N)
      : items.filter(({ editorial }) => editorial.platforms.includes(active));

  const tabBase =
    "px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap";
  const tabActive = "bg-violet-600 text-white border-violet-500";
  const tabInactive =
    "bg-slate-800 text-slate-300 border-slate-700 hover:border-violet-500/50 hover:text-white";
  const tabDisabled = "bg-slate-800/50 text-slate-600 border-slate-700/50 cursor-not-allowed";

  return (
    <div>
      <div
        className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
        role="group"
        aria-label="対応プラットフォームで絞り込み"
      >
        <span className="text-xs text-slate-500 whitespace-nowrap mr-1">絞り込み:</span>
        <button
          type="button"
          onClick={() => select("all")}
          aria-pressed={active === "all"}
          className={`${tabBase} ${active === "all" ? tabActive : tabInactive}`}
        >
          すべて TOP{TOP_N}
        </button>
        {ALL_PLATFORMS.map((p) => {
          const count = countOf(p);
          const disabled = count === 0;
          return (
            <button
              key={p}
              type="button"
              onClick={() => !disabled && select(p)}
              disabled={disabled}
              aria-pressed={active === p}
              className={`${tabBase} ${disabled ? tabDisabled : active === p ? tabActive : tabInactive}`}
            >
              {PLATFORM_LABELS[p]} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map(({ product, editorial }, i) => (
            <ProductRankingCard
              key={editorial.keyword}
              product={product}
              editorial={editorial}
              accentBorder={accentBorder}
              pointBg={pointBg}
              displayRank={i + 1}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-10 text-center">
          <p className="text-slate-300 font-semibold mb-2">
            {active !== "all" ? `${PLATFORM_LABELS[active]}対応の製品が見つかりませんでした` : "製品が見つかりませんでした"}
          </p>
          <p className="text-slate-500 text-sm mb-4">別のプラットフォームを選ぶか、すべての製品をご覧ください。</p>
          <button
            type="button"
            onClick={() => select("all")}
            className="inline-block bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors"
          >
            すべての製品を表示
          </button>
        </div>
      )}
    </div>
  );
}
