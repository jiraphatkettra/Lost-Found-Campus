/**
 * Lost & Found Campus - UI Style Tokens
 * รวมค่าคงที่คลาส Tailwind CSS สำหรับจัดระเบียบสไตล์ของส่วนติดต่อผู้ใช้ (UI) ทั่วทั้งระบบ
 */

// คอนเทนเนอร์หลักของหน้าเว็บ (Layout Container)
export const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

// ขนาดตัวอักษรและน้ำหนัก (Typography & Type Scale)
export const TYPE_SCALE = {
  h1: "text-2xl sm:text-3xl font-semibold leading-tight tracking-tight",
  h2: "text-base font-semibold",
  body: "text-base leading-relaxed",
  secondary: "text-sm text-slate-600 dark:text-slate-400",
  label: "text-xs font-medium",
  button: "text-sm font-medium",
} as const;

// รูปแบบพื้นหลังและการ์ดแสดงผล (Surface & Card Styles)
export const SURFACES = {
  card: "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
  subtle: "rounded-xl bg-slate-50 dark:bg-slate-800/50",
  accent: "rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30",
  accentAmber: "rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30",
  accentRose: "rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30",
} as const;
