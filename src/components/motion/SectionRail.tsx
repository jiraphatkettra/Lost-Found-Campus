"use client";

import React from "react";
import { useActiveSection, DEFAULT_HOME_SECTIONS } from "@/lib/scroll/useActiveSection";

/**
 * SectionRail Component:
 * แถบแสดงตำแหน่งหัวข้อที่กำลังอ่าน (Reading Position Indicator)
 * - หน้าจอใหญ่ (Desktop): แสดงชื่อหัวข้อปัจจุบันและหัวข้อถัดไป
 * - หน้าจอมือถือ (Mobile): แสดงชิปสรุปลำดับและชื่อหัวข้อแบบมินิมอล
 */
export function SectionRail() {
  const {
    activeSection,
    activeIndex,
    previousSection,
    nextSections,
    totalSections,
  } = useActiveSection({ sections: DEFAULT_HOME_SECTIONS });

  const formatIndex = (idx: number) => String(idx).padStart(2, "0");

  return (
    <>
      {/* =========================================================================
          1. Desktop Sticky Right Rail (>=1024px)
          ========================================================================= */}
      <div
        aria-hidden="true"
        className="hidden lg:block fixed top-20 right-6 xl:right-10 z-30 pointer-events-none select-none text-right"
      >
        {/* Previous section (ตัวเล็กจางอยู่เหนือขึ้นไป) */}
        <div className="h-4 overflow-hidden mb-0.5">
          {previousSection ? (
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 transition-opacity duration-300 opacity-60">
              {formatIndex(previousSection.index)} {previousSection.label}
            </div>
          ) : (
            <div className="text-[11px] font-semibold text-transparent select-none">&nbsp;</div>
          )}
        </div>

        {/* Current section (ตัวใหญ่หนา ม้วนในกรอบตัดขอบ Vertical Roll Mask) */}
        <div className="h-8 overflow-hidden relative">
          <div
            key={activeSection.id}
            className="text-lg xl:text-xl font-extrabold text-slate-900 dark:text-white animate-in slide-in-from-bottom-2 duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] flex items-center justify-end gap-2"
          >
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {formatIndex(activeSection.index)}
            </span>
            <span className="truncate max-w-[180px]">{activeSection.label}</span>
          </div>
        </div>

        {/* Subtitle / Note */}
        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
          {activeSection.sublabel}
        </div>
      </div>

      {/* Upcoming Sections List (มุมขวาล่างแบบจาง ๆ) */}
      <div
        aria-hidden="true"
        className="hidden lg:flex fixed bottom-8 right-6 xl:right-10 z-30 pointer-events-none select-none flex-col items-end gap-1.5 text-right"
      >
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
          ถัดไป
        </span>
        {nextSections.length > 0 ? (
          nextSections.map((sec) => (
            <div
              key={sec.id}
              className="text-[11px] font-semibold text-slate-400/60 dark:text-slate-500/50 hover:opacity-100 transition-opacity tabular-nums flex items-center gap-1.5"
            >
              <span className="text-[9px] opacity-70">{formatIndex(sec.index)}</span>
              <span>{sec.label}</span>
            </div>
          ))
        ) : (
          <div className="text-[10px] font-semibold text-emerald-500/70 dark:text-emerald-400/70">
            • สิ้นสุดหน้า
          </div>
        )}
      </div>

      {/* =========================================================================
          2. Mobile & Tablet Minimal Chip (<1024px)
          ========================================================================= */}
      <div
        aria-hidden="true"
        className="lg:hidden fixed top-[4.25rem] left-3 sm:left-4 z-30 pointer-events-none select-none"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-2xs text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
          <span className="text-blue-600 dark:text-blue-400 tabular-nums font-bold">
            {formatIndex(activeSection.index)}/{formatIndex(totalSections)}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="truncate max-w-[120px]">{activeSection.label}</span>
        </div>
      </div>
    </>
  );
}
