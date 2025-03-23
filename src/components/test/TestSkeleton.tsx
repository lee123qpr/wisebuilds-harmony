
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';

const TestSkeleton = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Test Component</h1>
        <p className="text-muted-foreground mb-8">
          This is a skeleton page for testing components
        </p>
        
        <div className="grid gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </MainLayout>
  );
};

export default TestSkeleton;
