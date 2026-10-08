/**
 * Lost & Found Campus - Central UI Tokens and Classes (v2.1)
 * เก็บค่าคงที่คลาสสำหรับความสม่ำเสมอของ UI ทั่วทั้งระบบ
 */

// 6.2 คอนเทนเนอร์กลางของเว็บ - ขอบซ้าย/ขวาตรงกันทุกหน้า
export const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

// 6.1 Type Scale Classes (ยึดตามสเปก 6.1)
export const TYPE_SCALE = {
  h1: "text-2xl sm:text-3xl font-semibold leading-tight tracking-tight",
  h2: "text-base font-semibold",
  body: "text-base leading-relaxed",
  secondary: "text-sm text-slate-600 dark:text-slate-400",
  label: "text-xs font-medium",
  button: "text-sm font-medium",
} as const;

// 6.3 Surface Classes (จำกัดเพียง 3 แบบต่อหน้า)
export const SURFACES = {
  card: "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
  subtle: "rounded-xl bg-slate-50 dark:bg-slate-800/50",
  accent: "rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30",
  accentAmber: "rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30",
  accentRose: "rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30",
} as const;
