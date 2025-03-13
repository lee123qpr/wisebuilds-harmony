
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProjectHeaderSkeleton = () => (
  <div className="flex items-center gap-2 mb-6">
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-8 w-64" />
    <div className="ml-auto">
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const ProjectDetailsSkeleton = () => (
  <div className="space-y-6 border rounded-lg p-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-60" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
    <Skeleton className="h-px w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
    <Skeleton className="h-px w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-md p-3">
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  </div>
);

export const ProjectStatusSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-6">
    <Skeleton className="h-7 w-24" />
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
    <Skeleton className="h-9 w-full" />
  </div>
);

export const ProjectDocumentsSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-6">
    <div className="space-y-1">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
    <Skeleton className="h-9 w-full" />
  </div>
);
