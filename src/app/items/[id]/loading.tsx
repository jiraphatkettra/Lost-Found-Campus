import React from "react";
import { CONTAINER, SURFACES } from "@/lib/ui";

export default function ItemDetailLoading() {
  return (
    <div className={`${CONTAINER} py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse`}>
      {/* 1. Back button skeleton */}
      <div className="pt-1">
        <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* 2. Main Grid Layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7/12): 4:3 Gallery Skeleton */}
        <div className="lg:col-span-7">
          <div className="aspect-4/3 w-full rounded-2xl bg-slate-200 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800" />
        </div>

        {/* Right Column (5/12): Info Card Skeleton */}
        <div className="lg:col-span-5">
          <div className={`${SURFACES.card} p-5 sm:p-6 lg:p-7 space-y-5 shadow-xs`}>
            {/* Header row skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>

            {/* Title skeleton */}
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl mt-3" />

            {/* Poster line skeleton */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>

            {/* Facts box skeleton */}
            <div className="h-28 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />

            {/* Action button skeleton */}
            <div className="h-11 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />

            {/* Description lines skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
