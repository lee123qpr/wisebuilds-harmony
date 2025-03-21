
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import EmptyStateCard from './EmptyStateCard';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobsList from './jobs/JobsList';
import { useClientNames } from '@/hooks/clients/useClientNames';

const ActiveJobsTab: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  // Fetch quotes with accepted status for this freelancer (including completed ones)
  const { data: allQuotes, isLoading, refetch } = useQuotes({
    forClient: false,
    includeAllQuotes: false,
    refreshInterval: 10000
  });
  
  // Filter for active and completed jobs
  // Active jobs are those that are accepted but not fully completed (both parties confirmed)
  const activeJobs = allQuotes?.filter(quote => 
    quote.status === 'accepted' && (!quote.completed_at || !quote.client_completed || !quote.freelancer_completed)
  ) || [];
  
  // Completed jobs are those that are accepted and fully completed
  const completedJobs = allQuotes?.filter(quote => 
    quote.status === 'accepted' && quote.completed_at && quote.client_completed && quote.freelancer_completed
  ) || [];
  
  // Get client names for the projects
  const { clientNames } = useClientNames([...activeJobs, ...completedJobs]);
  
  const handleStatusUpdate = () => {
    refetch();
  };

  if (isLoading) {
    return (
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

export default ActiveJobsTab;
