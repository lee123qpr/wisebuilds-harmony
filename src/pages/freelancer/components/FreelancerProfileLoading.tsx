
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FreelancerProfileLoading: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-4">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full max-w-md mb-1" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileLoading;
