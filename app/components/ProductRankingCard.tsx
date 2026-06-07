import Image from "next/image";
import type { Product } from "@/lib/products";

export type Editorial = {
  keyword: string;
  badge: string;
  badgeColor: string;
  rankColor: string;
  score: number;
  point: string;
  pros: string[];
  cons: string[];
  specs: { label: string; value: string }[];
};

function Stars({ score }: { score: number }) {
  const full = Math.floor(score);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "text-amber-400" : "text-slate-600"}>★</span>
      ))}
      <span className="ml-1 text-sm font-semibold text-amber-400">{score}</span>
    </div>
  );
}

export function ProductRankingCard({
  product,
  editorial,
  accentBorder,
  pointBg,
}: {
  product: Product;
  editorial: Editorial;
  accentBorder: string;
  pointBg: string;
}) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 transition-all ${accentBorder}`}>
      <div className="flex flex-col md:flex-row md:items-start gap-5">
        <div className="flex-shrink-0 flex md:flex-col items-center gap-3 md:w-40">
          <span className={`text-5xl font-black ${editorial.rankColor}`}>#{product.rank}</span>
          {product.imageUrl ? (
            <div className="relative w-28 h-28 bg-white rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${editorial.badgeColor}`}>
              {editorial.badge}
            </span>
            <span className="text-xs text-slate-400 truncate">{product.shopName}</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mb-1 leading-snug">{product.name}</h2>
          <Stars score={editorial.score} />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="text-slate-400 block text-xs mb-1">価格</span>
              <span className="text-violet-400 font-bold">{product.priceLabel}</span>
            </div>
            {editorial.specs.map((spec) => (
              <div key={spec.label} className="bg-slate-700/50 rounded-lg p-3">
                <span className="text-slate-400 block text-xs mb-1">{spec.label}</span>
                <span className="text-white text-xs">{spec.value}</span>
              </div>
            ))}
          </div>

          <p className={`text-slate-300 text-sm border rounded-lg px-4 py-3 mb-4 ${pointBg}`}>
            💡 {editorial.point}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-green-400 text-sm font-semibold mb-2">✓ メリット</h4>
              <ul className="space-y-1">
                {editorial.pros.map((p) => (
                  <li key={p} className="text-slate-300 text-sm flex gap-2"><span className="text-green-400">+</span>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 text-sm font-semibold mb-2">✗ デメリット</h4>
              <ul className="space-y-1">
                {editorial.cons.map((c) => (
                  <li key={c} className="text-slate-300 text-sm flex gap-2"><span className="text-red-400">-</span>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="block text-center bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors"
          >
            楽天市場でチェックする
          </a>
        </div>
      </div>
    </div>
  );
}
