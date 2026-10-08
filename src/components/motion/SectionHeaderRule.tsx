import React from "react";

export interface SectionHeaderRuleProps {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * SectionHeaderRule (v2.3 Motion Layer - B5):
 * แถบเส้นบางคั่นหัว Section พร้อมเลขลำดับ (เช่น 02 / ภาพรวม) และคำอธิบายสั้น
 * ช่วยบอกตำแหน่งและลำดับสายตาตามวิดีโออ้างอิง โดยไม่กระทบเลย์เอาต์เดิม
 */
export function SectionHeaderRule({
  index,
  title,
  subtitle,
  className = "",
}: SectionHeaderRuleProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2 pointer-events-none select-none ${className}`}
    >
      <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-2.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums text-xs">
            {index}
          </span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
            {title}
          </span>
        </div>
        {subtitle && (
          <div className="hidden sm:block text-slate-400 dark:text-slate-500 text-xs font-normal">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
