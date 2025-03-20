
import React from 'react';
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

const ActiveJobsTab: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch quotes with accepted status for this freelancer
  const { data: acceptedQuotes, isLoading } = useQuotes({
    forClient: false,
    includeAllQuotes: false,
    refreshInterval: 10000
  });
  
  // Filter for only accepted quotes
  const activeJobs = acceptedQuotes?.filter(quote => quote.status === 'accepted') || [];
  
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
        <h3 className="text-lg font-medium">Active Jobs ({activeJobs.length})</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {activeJobs.map((quote) => {
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
