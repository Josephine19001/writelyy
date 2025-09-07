'use client';

import { Skeleton } from '@ui/components/skeleton';

export function PostsHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Search skeleton */}
        <div className="relative flex-1 max-w-2xl">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
