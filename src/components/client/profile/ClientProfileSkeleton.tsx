
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ClientProfileSkeleton = () => {
  return (
    <div className="mt-6">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <div className="grid gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
};

export default ClientProfileSkeleton;
