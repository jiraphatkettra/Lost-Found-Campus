"use client";

import React, { useEffect, useState } from "react";
import { ItemCardData } from "@/types";
import { ItemCard } from "./ItemCard";
import { Sparkles, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export interface MatchSuggestionsProps {
  itemId: string;
}

export function MatchSuggestions({ itemId }: MatchSuggestionsProps) {
  const [matches, setMatches] = useState<ItemCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchMatches() {
      try {
        setLoading(true);
        const res = await fetch(`/api/items/${itemId}/matches`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setMatches(data);
        }
      } catch (err) {
        console.error("MatchSuggestions error:", err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMatches();

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  // ซ่อนส่วนนี้เงียบ ๆ เมื่อเกิด error
  if (error) return null;

  return (
    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            รายการที่อาจตรงกัน
          </h2>
          <p className="text-2xs sm:text-xs text-slate-500 dark:text-slate-400">
            ระบบคำนวณจากหมวดหมู่ สถานที่ และช่วงเวลาที่ใกล้เคียงกัน
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-3 space-y-3"
            >
              <Skeleton className="w-full aspect-4/3 rounded-xl" />
              <div className="space-y-2 p-1">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <Info className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            ยังไม่พบรายการที่ตรงกันในขณะนี้
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ระบบจะแสดงผลอัตโนมัติเมื่อมีผู้แจ้งประกาศที่อาจเป็นของชิ้นเดียวกัน
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
