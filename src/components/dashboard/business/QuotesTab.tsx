
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coins, Check, Briefcase, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { QuoteWithFreelancer } from '@/types/quotes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCompleteButton from '@/components/projects/ProjectCompleteButton';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';

const QuotesTab: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch quotes for this client
  const { data: quotes, isLoading, refetch } = useQuotes({
    forClient: true,
    includeAllQuotes: true
  });
  
  const [activeTab, setActiveTab] = useState('accepted');
  
  // Filter quotes based on tab
  const filteredQuotes = quotes?.filter(quote => {
    if (activeTab === 'accepted') return quote.status === 'accepted';
    if (activeTab === 'pending') return quote.status === 'pending';
    if (activeTab === 'declined') return quote.status === 'declined';
    return true;
  }) || [];
  
  const tabCounts = {
    accepted: quotes?.filter(q => q.status === 'accepted')?.length || 0,
    pending: quotes?.filter(q => q.status === 'pending')?.length || 0,
    declined: quotes?.filter(q => q.status === 'declined')?.length || 0
  };
  
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
  
  if (!quotes || quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have any quotes yet. When freelancers submit quotes for your projects, they'll appear here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="accepted" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="accepted" className="flex-1">
            Accepted ({tabCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">
            Pending ({tabCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="declined" className="flex-1">
            Declined ({tabCounts.declined})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredQuotes.length === 0 ? (
              <Card>
                <CardContent className="py-4">
                  <p className="text-center text-muted-foreground">
                    No {activeTab} quotes found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredQuotes.map((quote: QuoteWithFreelancer) => {
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
                
                // Get freelancer info
                const freelancerName = quote.freelancer_profile?.display_name || 
                                      (quote.freelancer_profile?.first_name && quote.freelancer_profile?.last_name 
                                        ? `${quote.freelancer_profile.first_name} ${quote.freelancer_profile.last_name}`
                                        : 'Freelancer');
                
                const isAccepted = quote.status === 'accepted';
                
                return (
                  <Card key={quote.id} className="w-full">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <CardTitle className="text-xl">{projectTitle}</CardTitle>
                        {isAccepted && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Quote Accepted
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{isAccepted ? 'Accepted' : 'Received'} on: {formattedDate}</span>
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
                        
                        {isAccepted && (
                          <ProjectCompletionStatus
                            quoteId={quote.id}
                            projectId={quote.project_id}
                            freelancerId={quote.freelancer_id}
                            clientId={quote.client_id}
                            freelancerName={freelancerName}
                            clientName={user?.user_metadata?.contact_name || 'Client'}
                          />
                        )}
                        
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
                            onClick={() => navigate(`/project/${quote.project_id}/quotes/${quote.id}`)}
                          >
                            View Quote Details
                          </Button>
                          
                          {isAccepted && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => navigate(`/dashboard/business?tab=messages&freelancerId=${quote.freelancer_id}`)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                Message Freelancer
                              </Button>
                              
                              <ProjectCompleteButton
                                quoteId={quote.id}
                                projectId={quote.project_id}
                                projectTitle={projectTitle}
                                onStatusUpdate={handleStatusUpdate}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuotesTab;
