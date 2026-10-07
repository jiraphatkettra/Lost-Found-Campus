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
      value: searchingCount,
      icon: <Search className="w-5 h-5 text-amber-500" />,
      color: "from-amber-500/10 to-transparent",
      badgeColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "ส่งคืนสำเร็จ",
      value: returnedCount,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      color: "from-emerald-500/10 to-transparent",
      badgeColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "ประกาศสัปดาห์นี้",
      value: recentCount,
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      color: "from-blue-500/10 to-transparent",
      badgeColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <section className="py-8 sm:py-12 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div
                className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${s.color} rounded-bl-full pointer-events-none`}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {s.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                  {s.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </span>
                <span className="text-xs text-slate-400">รายการ</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
