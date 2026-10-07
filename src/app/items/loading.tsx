import { Skeleton } from "@/components/ui/Skeleton";

export default function ItemsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header skeleton */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* FilterBar skeleton */}
      <Skeleton className="h-24 w-full rounded-2xl mb-8" />

      {/* 8-Card Grid skeleton (Section 7.3: รูปทรงเดียวกับการ์ด 8 ใบ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-3 shadow-xs"
          >
            <Skeleton className="w-full aspect-4/3 rounded-xl" />
            <div className="p-1 space-y-2.5">
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <Skeleton className="h-3.5 w-1/4 rounded-md" />
                <Skeleton className="h-3.5 w-1/4 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
