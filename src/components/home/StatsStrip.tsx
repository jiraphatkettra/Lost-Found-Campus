import React from "react";
import { Search, CheckCircle2, TrendingUp } from "lucide-react";

export interface StatsStripProps {
  searchingCount: number;
  returnedCount: number;
  recentCount: number;
}

export function StatsStrip({
  searchingCount,
  returnedCount,
  recentCount,
}: StatsStripProps) {
  const stats = [
    {
      title: "กำลังตามหา",
      shortTitle: "ตามหา",
      value: searchingCount,
      icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
      color: "from-amber-500/10 to-transparent",
    },
    {
      title: "ส่งคืนสำเร็จ",
      shortTitle: "ส่งคืนแล้ว",
      value: returnedCount,
      icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />,
      color: "from-emerald-500/10 to-transparent",
    },
    {
      title: "ประกาศใหม่สัปดาห์นี้",
      shortTitle: "สัปดาห์นี้",
      value: recentCount,
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
      color: "from-blue-500/10 to-transparent",
    },
  ];

  return (
    <section className="relative z-20 py-6 sm:py-10 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-4 md:p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div
                className={`absolute top-0 right-0 w-16 sm:w-28 h-16 sm:h-28 bg-gradient-to-bl ${s.color} rounded-bl-full pointer-events-none opacity-60 sm:opacity-100`}
              />

              {/* Top row: Highlight Number & Compact Icon */}
              <div className="flex items-start justify-between gap-1 mb-1 sm:mb-2">
                <div className="flex items-baseline gap-0.5 sm:gap-1.5">
                  <span className="text-xl min-[360px]:text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                    {s.value}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">รายการ</span>
                </div>
                <div className="p-1 sm:p-1.5 md:p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 shrink-0">
                  {s.icon}
                </div>
              </div>

              {/* Bottom Label: Full text on desktop, clean concise badge on mobile without clipping */}
              <div className="mt-0.5 sm:mt-1">
                <span className="block text-[11px] min-[360px]:text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-snug">
                  <span className="sm:hidden">{s.shortTitle}</span>
                  <span className="hidden sm:inline">{s.title}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
