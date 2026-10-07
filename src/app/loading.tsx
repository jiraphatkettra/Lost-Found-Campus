import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center text-center space-y-4 py-12">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-12 w-3/4 max-w-xl rounded-2xl" />
        <Skeleton className="h-5 w-1/2 max-w-md rounded-lg" />
        <Skeleton className="h-12 w-full max-w-lg rounded-2xl" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
