"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BackHomeBar() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className="bg-slate-800/70 border-b border-slate-700/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-10 flex items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-400 transition-colors group"
        >
          <span className="text-base group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>ホームに戻る</span>
        </Link>
      </div>
    </div>
  );
}
