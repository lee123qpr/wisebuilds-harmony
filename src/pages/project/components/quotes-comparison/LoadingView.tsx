
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingViewProps {
  projectId: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({ projectId }) => {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Quotes Comparison</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingView;
