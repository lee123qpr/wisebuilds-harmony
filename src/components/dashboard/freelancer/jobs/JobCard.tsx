
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coins, Check, Briefcase, ArrowRight, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectCompleteButton from '@/components/projects/ProjectCompleteButton';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { useAuth } from '@/context/AuthContext';

interface JobCardProps {
  quote: QuoteWithFreelancer;
  clientName: string;
  onStatusUpdate: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ quote, clientName, onStatusUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fix: Properly access the project title from the project object
  const projectTitle = quote.project?.title || 'Untitled Project';
  const formattedDate = quote.created_at 
    ? format(new Date(quote.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  const formattedPrice = priceValue === 'Not specified' ? priceValue : `£${priceValue}`;
  const completedDate = quote.completed_at 
    ? format(new Date(quote.completed_at), 'MMM d, yyyy')
    : null;

  // Determine completion status
  const isFullyCompleted = quote.completed_at && quote.client_completed && quote.freelancer_completed;
  const isPartiallyCompleted = quote.client_completed || quote.freelancer_completed;
  const userCompleted = user?.user_metadata?.user_type === 'freelancer' 
    ? quote.freelancer_completed 
    : quote.client_completed;
  
  console.log("JobCard rendering for quote:", quote.id, {
    isFullyCompleted,
    isPartiallyCompleted,
    userCompleted,
    clientCompleted: quote.client_completed,
    freelancerCompleted: quote.freelancer_completed,
    completedAt: quote.completed_at,
    projectTitle,
    project: quote.project
  });
  
  return (
    <Card key={quote.id} className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <CardTitle className="text-xl">{projectTitle}</CardTitle>
          {isFullyCompleted ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          ) : isPartiallyCompleted ? (
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Awaiting Confirmation
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{completedDate ? `Completed on: ${completedDate}` : `Accepted on: ${formattedDate}`}</span>
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
          
          {/* Show completion status component only when at least one party has marked as complete */}
          {isPartiallyCompleted && (
            <ProjectCompletionStatus
              quoteId={quote.id}
              projectId={quote.project_id}
              freelancerId={quote.freelancer_id}
              clientId={quote.client_id}
              freelancerName={user?.user_metadata?.display_name || 'Freelancer'}
              clientName={clientName}
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
              className="gap-2"
              onClick={() => navigate(`/dashboard/freelancer?tab=messages&conversation=${quote.project_id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              Message Client
            </Button>
            
            {!isFullyCompleted && (
              <ProjectCompleteButton
                quoteId={quote.id}
                projectId={quote.project_id}
                projectTitle={projectTitle}
                onStatusUpdate={onStatusUpdate}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
