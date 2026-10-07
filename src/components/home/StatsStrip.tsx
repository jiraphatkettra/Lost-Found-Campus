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
    <section className="py-6 sm:py-10 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-5 shadow-2xs hover:shadow-sm transition-all"
            >
              <div
                className={`absolute top-0 right-0 w-16 sm:w-28 h-16 sm:h-28 bg-gradient-to-bl ${s.color} rounded-bl-full pointer-events-none`}
              />
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-2xs sm:text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                  <span className="sm:hidden">{s.shortTitle}</span>
                  <span className="hidden sm:inline">{s.title}</span>
                </span>
                <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0">
                  {s.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </span>
                <span className="text-3xs sm:text-xs text-slate-400">รายการ</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
