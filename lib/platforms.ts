// プラットフォーム絞り込み機能の共通定義。
// クライアントコンポーネントからも import されるため、fs 等のサーバー専用APIは使わないこと。

export type Platform = "ps5" | "xbox" | "switch" | "pc";

export const ALL_PLATFORMS: Platform[] = ["ps5", "xbox", "switch", "pc"];

export const PLATFORM_LABELS: Record<Platform, string> = {
  ps5: "PS5",
  xbox: "Xbox",
  switch: "Switch",
  pc: "PC",
};

// プラットフォームバッジの配色（公式ブランドカラーに寄せる）
export const PLATFORM_BADGE_CLASSES: Record<Platform, string> = {
  ps5: "bg-blue-600/20 text-blue-300 border-blue-500/30",
  xbox: "bg-green-600/20 text-green-300 border-green-500/30",
  switch: "bg-red-600/20 text-red-300 border-red-500/30",
  pc: "bg-slate-600/30 text-slate-300 border-slate-500/40",
};

export function isPlatform(value: string | null | undefined): value is Platform {
  return value != null && (ALL_PLATFORMS as string[]).includes(value);
}
