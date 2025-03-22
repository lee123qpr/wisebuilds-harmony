
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coins, Check, Briefcase, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { cn } from '@/lib/utils';

interface QuoteListItemProps {
  quote: QuoteWithFreelancer;
  user: any;
}

const QuoteListItem: React.FC<QuoteListItemProps> = ({ quote, user }) => {
  const navigate = useNavigate();
  
  // More robust project title handling
  const projectTitle = quote.project?.title && 
                      quote.project.title !== 'null' && 
                      quote.project.title !== 'undefined' && 
                      quote.project.title.trim() !== '' 
                        ? quote.project.title 
                        : 'Untitled Project';
  
  console.log('Quote project data:', quote.project);
  
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
  
  // Get card style based on quote status
  const getCardStyle = () => {
    switch (quote.status) {
      case 'accepted':
        return "border-2 border-green-500";
      case 'pending':
        return "border-2 border-amber-500";
      case 'declined':
        return "border-2 border-red-500";
      default:
        return "border-2 border-gray-300";
    }
  };

  return (
    <Card key={quote.id} className={cn("w-full", getCardStyle())}>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate(`/dashboard/business?tab=messages&freelancerId=${quote.freelancer_id}`)}
              >
                <MessageSquare className="h-4 w-4" />
                Message Freelancer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteListItem;
