"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TYPE_SCALE } from "@/lib/ui";

export function ItemDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 280 || (description.match(/\n/g) || []).length >= 5;

  return (
    <div className="space-y-2">
      <h2 className={`${TYPE_SCALE.h2} text-slate-900 dark:text-white`}>
        รายละเอียด
      </h2>
      <div className="relative">
        <p
          className={`${TYPE_SCALE.body} text-slate-700 dark:text-slate-300 whitespace-pre-line break-words ${
            !expanded && isLong ? "line-clamp-6" : ""
          }`}
        >
          {description}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <span>{expanded ? "ย่อข้อความ" : "อ่านเพิ่มเติม"}</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
