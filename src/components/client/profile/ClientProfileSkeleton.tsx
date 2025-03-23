
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ClientProfileSkeleton = () => {
  return (
    <div className="mt-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <Skeleton className="h-24 w-24 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      
      {/* Information card skeleton */}
      <Card className="mb-8 shadow-md">
        <CardHeader className="bg-blue-50 border-b">
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Description skeleton */}
      <Card className="mb-8 shadow-md">
        <CardHeader className="bg-emerald-50 border-b">
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="pt-5">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      
      {/* Details skeleton */}
      <Card className="shadow-md">
        <CardHeader className="bg-amber-50 border-b">
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfileSkeleton;
