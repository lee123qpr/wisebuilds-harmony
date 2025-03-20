
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/components/layout/MainLayout';

const FreelancerProfileLoading: React.FC = () => {
  return (
    <MainLayout>
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <div className="flex gap-4 mt-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>
        
        <Skeleton className="h-10 w-48 mb-6" />
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileLoading;
