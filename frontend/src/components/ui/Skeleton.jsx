import React from 'react';
import { cn } from '../../utils/helpers';

export const Skeleton = ({ className }) => (
  <div className={cn('shimmer-bg rounded-xl animate-shimmer', className)} />
);

export const DocumentCardSkeleton = () => (
  <div className="glass-card p-4 space-y-3">
    <Skeleton className="w-full h-36 rounded-xl" />
    <Skeleton className="w-3/4 h-4" />
    <Skeleton className="w-1/2 h-3" />
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6 rounded-full" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass-card p-6 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="w-20 h-8 mt-2" />
    <Skeleton className="w-32 h-4" />
  </div>
);

export const FamilyCardSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
    <Skeleton className="w-full h-8 rounded-lg" />
  </div>
);

export const ListSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/5 h-3" />
        </div>
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    ))}
  </div>
);
