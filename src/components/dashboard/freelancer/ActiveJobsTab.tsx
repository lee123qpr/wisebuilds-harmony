
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import EmptyStateCard from './EmptyStateCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coins, Check, Briefcase, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCompleteButton from '@/components/projects/ProjectCompleteButton';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { supabase } from '@/integrations/supabase/client';

const ActiveJobsTab: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch quotes with accepted status for this freelancer
  const { data: acceptedQuotes, isLoading, refetch } = useQuotes({
    forClient: false,
    includeAllQuotes: false,
    refreshInterval: 10000
  });
  
  // Filter for only accepted quotes
  const activeJobs = acceptedQuotes?.filter(quote => quote.status === 'accepted') || [];
  
  // Get client names for the projects
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchClientNames = async () => {
      const clientIds = activeJobs.map(job => job.client_id).filter(Boolean);
      if (!clientIds.length) return;
      
      // Fetch client profiles for client names
      for (const clientId of clientIds) {
        const { data } = await supabase.functions.invoke(
          'get-user-profile',
          { body: { userId: clientId } }
        );
        
        if (data) {
          const metadata = data.user_metadata || {};
          const displayName = metadata.contact_name || metadata.full_name || 'Client';
          
          setClientNames(prev => ({
            ...prev,
            [clientId]: displayName
          }));
        }
      }
    };
    
    if (activeJobs.length > 0) {
      fetchClientNames();
    }
  }, [activeJobs]);
  
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
  
  if (activeJobs.length === 0) {
    return (
      <EmptyStateCard
        title="Active Jobs"
        description="You don't have any active jobs at the moment. When a client accepts your quote, the job will appear here."
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">
            Active Jobs
            <Badge variant="secondary" className="ml-2 text-sm font-medium">
              {activeJobs.length}
            </Badge>
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {activeJobs.map((quote) => {
          // Get project title from the project data in the quote
          const projectTitle = quote.project?.title || 'Project'; 
          
          const formattedDate = quote.created_at 
            ? format(new Date(quote.created_at), 'MMM d, yyyy')
            : 'Unknown date';
          
          // Format price
          const priceType = quote.fixed_price 
            ? 'Fixed Price' 
            : quote.estimated_price 
              ? 'Estimated Price' 
              : quote.day_rate 
                ? 'Day Rate' 
                : 'Not specified';
          
          const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
          const formattedPrice = priceValue === 'Not specified' ? priceValue : `£${priceValue}`;
          
          const clientName = clientNames[quote.client_id] || 'Client';
          
          return (
            <Card key={quote.id} className="w-full">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <CardTitle className="text-xl">{projectTitle}</CardTitle>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Quote Accepted
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Accepted on: {formattedDate}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      <span>{priceType}: {formattedPrice}</span>
                    </div>
                    
                    {quote.available_start_date && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>Start date: {format(new Date(quote.available_start_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Project completion status */}
                  <ProjectCompletionStatus
                    quoteId={quote.id}
                    projectId={quote.project_id}
                    freelancerId={quote.freelancer_id}
                    clientId={quote.client_id}
                    freelancerName={user?.user_metadata?.display_name || 'Freelancer'}
                    clientName={clientName}
                  />
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/project/${quote.project_id}`)}
                    >
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => navigate(`/dashboard/freelancer?tab=messages`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message Client
                    </Button>
                    
                    <ProjectCompleteButton
                      quoteId={quote.id}
                      projectId={quote.project_id}
                      projectTitle={projectTitle}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveJobsTab;
