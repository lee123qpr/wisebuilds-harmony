
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FreelancerProfileLoading: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-36 mb-4" />
              <Skeleton className="h-4 w-28" />
            </div>
            
            <Skeleton className="h-24 w-full rounded-md" />
            
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileLoading;
