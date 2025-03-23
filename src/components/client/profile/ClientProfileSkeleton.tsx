
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ClientProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Card Skeleton */}
      <div className="border rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 text-center md:text-left space-y-4">
            <Skeleton className="h-8 w-60 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-36 mx-auto md:mx-0" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />

        {/* Tab Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Information Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileSkeleton;
