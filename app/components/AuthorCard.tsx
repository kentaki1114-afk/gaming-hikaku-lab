export function AuthorCard({ comment }: { comment: string }) {
  return (
    <div className="flex items-start gap-4 bg-slate-800/60 border border-slate-700/60 rounded-xl px-5 py-4 mb-8">
      <div className="flex-shrink-0 w-11 h-11 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xl">
        🎮
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
          <span className="font-bold text-white text-sm">けんたき</span>
          <span className="text-xs text-slate-400">ゲーム歴10年 / Apex（pad）・フォートナイト（キーマウ）</span>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
            Apex プレデター 4シーズン維持
          </span>
          <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
            フォートナイト アンリアル達成
          </span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{comment}</p>
      </div>
    </div>
  );
}
