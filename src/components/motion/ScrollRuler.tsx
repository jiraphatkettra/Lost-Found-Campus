"use client";

import React from "react";
import { useScrollProgress } from "@/lib/scroll/useScrollProgress";

/**
 * ScrollRuler (v2.3 Motion Layer - B7):
 * - ไม้บรรทัดความคืบหน้าแนวตั้งชิดขอบขวา (เดสก์ท็อป >=1024px เท่านั้น)
 * - ขีดมาตราส่วนละ 5% เคลื่อนที่ตามการเลื่อนหน้า
 * - เส้นตัวชี้สี blue-600 คงที่กึ่งกลางจอ
 * - ตัวเลขเปอร์เซ็นต์ 3 หลัก (เช่น 000% - 100%) ฟอนต์ tabular-nums
 * - pointer-events: none และไม่บัง scrollbar ของเบราว์เซอร์
 */
export function ScrollRuler() {
  const { progress } = useScrollProgress();

  // จัดรูปแบบเปอร์เซ็นต์เป็นตัวเลข 3 หลัก เช่น 000% - 100%
  const percentageInt = Math.min(100, Math.max(0, Math.round(progress * 100)));
  const percentageStr = String(percentageInt).padStart(3, "0");

  // สร้างขีดมาตราส่วน (Ticks) 21 ขีด (0%, 5%, 10%, ... 100%)
  const ticks = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex fixed right-1.5 xl:right-2 top-0 bottom-0 z-30 pointer-events-none select-none flex-col items-end justify-center w-12"
    >
      {/* Container ขีดมาตราส่วนแนวตั้งที่เลื่อนตาม progress */}
      <div className="relative h-64 w-full flex flex-col justify-between items-end overflow-hidden py-4 border-r border-slate-200/50 dark:border-slate-800/50">
        {/* ขีด Scale เลื่อนตามความคืบหน้า */}
        <div
          className="absolute right-0 w-full flex flex-col items-end gap-2.5 transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${(0.5 - progress) * 160}px)`,
          }}
        >
          {ticks.map((tick) => {
            const isMajor = tick % 25 === 0;
            return (
              <div
                key={tick}
                className="flex items-center justify-end gap-1.5"
              >
                {isMajor && (
                  <span className="text-[8px] font-mono tabular-nums text-slate-400/60 dark:text-slate-600">
                    {tick}
                  </span>
                )}
                <div
                  className={`rounded-full transition-all ${
                    isMajor
                      ? "w-2.5 h-[1.5px] bg-slate-300 dark:bg-slate-700"
                      : "w-1.5 h-[1px] bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* เส้นตัวชี้กลางจอคงที่ (Center Blue Indicator) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-1.5">
          <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums tracking-tighter bg-white/90 dark:bg-slate-900/90 px-1 py-0.5 rounded shadow-2xs border border-blue-200/50 dark:border-blue-900/50">
            {percentageStr}%
          </span>
          <div className="w-3.5 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-l-full shadow-xs" />
        </div>
      </div>
    </div>
  );
}
