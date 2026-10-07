import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800 rounded-xl ${className}`}
    />
  );
}
