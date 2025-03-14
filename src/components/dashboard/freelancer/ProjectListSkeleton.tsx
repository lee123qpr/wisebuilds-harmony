
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const ProjectListSkeleton: React.FC = () => (
  <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-white">
    <ResizablePanel defaultSize={40} minSize={30}>
      <div className="divide-y h-[700px] overflow-auto p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex gap-4 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-full mb-2" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </ResizablePanel>
    
    <ResizableHandle withHandle />
    
    <ResizablePanel defaultSize={60}>
      <div className="p-6 h-[700px] overflow-auto space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
);

export default ProjectListSkeleton;
