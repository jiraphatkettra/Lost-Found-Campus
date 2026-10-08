import React from "react";
import { CheckCircle2, CheckCheck, Clock, Search, Gift, HelpCircle } from "lucide-react";
import {
  ITEM_STATUS_LABEL_MAP,
  ITEM_STATUS_CLASS_MAP,
  ITEM_TYPE_LABEL_MAP,
  ITEM_TYPE_CLASS_MAP,
} from "@/lib/constants";

export interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = ITEM_STATUS_LABEL_MAP[status] || status;
  const colorClass =
    ITEM_STATUS_CLASS_MAP[status] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const renderStatusVector = () => {
    switch (status) {
      case "SEARCHING":
        return (
          <span className="relative flex h-2 w-2 mr-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        );
      case "FOUND":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0" />;
      case "RETURNED":
        return <CheckCheck className="w-3.5 h-3.5 mr-1 shrink-0" />;
      default:
        return <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold select-none shadow-2xs whitespace-nowrap shrink-0 ${colorClass}`}
    >
      {renderStatusVector()}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
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
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold select-none shadow-2xs whitespace-nowrap shrink-0 ${colorClass}`}
    >
      {renderIcon()}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

