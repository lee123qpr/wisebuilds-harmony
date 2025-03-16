
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MessagesTabSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 h-[calc(100vh-180px)]">
      <div className="col-span-1 border rounded-md p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full mb-2" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="col-span-2 border rounded-md p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-10 w-1/2 ml-auto" />
          <Skeleton className="h-10 w-3/4" />
        </div>
        <Skeleton className="h-12 w-full mt-auto" />
      </div>
    </div>
  );
};

export default MessagesTabSkeleton;
