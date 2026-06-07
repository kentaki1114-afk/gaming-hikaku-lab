import Image from "next/image";
import type { Product } from "@/lib/products";

export function ArticleProductCard({ product, note }: { product: Product; note?: string }) {
  return (
    <div className="not-prose my-6 bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
      {product.imageUrl ? (
        <div className="relative w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0">
          <Image src={product.imageUrl} alt={product.name} fill sizes="96px" className="object-contain" />
        </div>
      ) : null}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="text-xs text-slate-400 mb-1">{product.shopName}</p>
        <h3 className="text-base font-bold text-white mb-1 leading-snug">{product.name}</h3>
        <p className="text-violet-400 font-bold mb-2">{product.priceLabel}</p>
        {note ? <p className="text-slate-300 text-sm mb-3">{note}</p> : null}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="inline-block bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-2 px-5 rounded-xl transition-colors"
        >
          楽天市場でチェックする
        </a>
      </div>
    </div>
  );
}
