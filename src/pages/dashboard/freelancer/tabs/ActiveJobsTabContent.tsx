
import React from 'react';
import EmptyStateCard from '@/components/dashboard/freelancer/EmptyStateCard';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobsList from '@/components/dashboard/freelancer/jobs/JobsList';
import { useActiveJobs } from '@/hooks/dashboard/useActiveJobs';

const ActiveJobsTabContent: React.FC = () => {
  const {
    activeJobs,
    completedJobs,
    clientNames,
    isLoading,
    activeTab,
    setActiveTab,
    handleStatusUpdate
  } = useActiveJobs();

  if (isLoading) {
    return <JobsLoadingSkeleton />;
  }

  if (activeJobs.length === 0 && completedJobs.length === 0) {
    return (
      <EmptyStateCard
        title="Active Jobs"
        description="You don't have any active jobs at the moment. When a client accepts your quote, the job will appear here."
      />
    );
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Jobs
              <Badge variant="secondary" className="ml-2 text-sm font-medium">
                {activeJobs.length + completedJobs.length}
              </Badge>
            </h2>
          </div>
        </div>
        
        <TabsList>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {activeJobs.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              {completedJobs.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <JobsList 
            jobs={activeJobs}
            clientNames={clientNames}
            onStatusUpdate={handleStatusUpdate}
            emptyTitle="Active Jobs"
            emptyDescription="You don't have any active jobs at the moment. When a client accepts your quote, the job will appear here."
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <JobsList 
            jobs={completedJobs}
            clientNames={clientNames}
            onStatusUpdate={handleStatusUpdate}
            emptyTitle="Completed Jobs"
            emptyDescription="You haven't completed any jobs yet. Jobs will appear here after both you and the client mark them as complete."
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

// Extracted loading skeleton component
const JobsLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <Card key={i} className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ActiveJobsTabContent;
