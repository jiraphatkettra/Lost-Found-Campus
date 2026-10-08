import React from "react";
import { Tag, MapPin, Calendar } from "lucide-react";
import { formatThaiDate } from "@/lib/date";
import { CATEGORY_LABEL_MAP, formatLocationName } from "@/lib/constants";
import { SURFACES } from "@/lib/ui";

export interface ItemFactsProps {
  category: string;
  location: string;
  date: Date | string;
}

export function ItemFacts({ category, location, date }: ItemFactsProps) {
  const categoryName = CATEGORY_LABEL_MAP[category] || category;
  const locationName = formatLocationName(location);
  const dateFormatted = formatThaiDate(date);

  return (
    <dl className={`${SURFACES.subtle} p-4 space-y-2.5 text-sm`}>
      {/* 1. หมวดหมู่ */}
      <div className="flex items-center gap-2.5">
        <dt className="flex items-center gap-2 w-24 shrink-0 text-slate-500 dark:text-slate-400 font-medium">
          <Tag className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>หมวดหมู่</span>
        </dt>
        <dd className="font-semibold text-slate-900 dark:text-slate-100 truncate min-w-0">
          {categoryName}
        </dd>
      </div>

      {/* 2. สถานที่ */}
      <div className="flex items-center gap-2.5">
        <dt className="flex items-center gap-2 w-24 shrink-0 text-slate-500 dark:text-slate-400 font-medium">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>สถานที่</span>
        </dt>
        <dd className="font-semibold text-slate-900 dark:text-slate-100 truncate min-w-0">
          {locationName}
        </dd>
      </div>

      {/* 3. วันที่ */}
      <div className="flex items-center gap-2.5">
        <dt className="flex items-center gap-2 w-24 shrink-0 text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>วันที่</span>
        </dt>
        <dd className="font-semibold text-slate-900 dark:text-slate-100 truncate min-w-0">
          {dateFormatted}
        </dd>
      </div>
    </dl>
  );
}
