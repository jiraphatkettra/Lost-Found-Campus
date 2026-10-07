import React from "react";
import { Search, Gift, HelpCircle } from "lucide-react";
import { ITEM_TYPE_LABEL_MAP, ITEM_TYPE_CLASS_MAP } from "@/lib/constants";

export interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const label = ITEM_TYPE_LABEL_MAP[type] || type;
  const colorClass =
    ITEM_TYPE_CLASS_MAP[type] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const renderIcon = () => {
    if (type === "LOST") {
      return <Search className="w-3 h-3 mr-1 shrink-0" />;
    }
    if (type === "FOUND") {
      return <Gift className="w-3 h-3 mr-1 shrink-0" />;
    }
    return <HelpCircle className="w-3 h-3 mr-1 shrink-0" />;
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold select-none tracking-wide shadow-2xs ${colorClass} ${className}`}
    >
      {renderIcon()}
      <span>{label}</span>
    </span>
  );
}

