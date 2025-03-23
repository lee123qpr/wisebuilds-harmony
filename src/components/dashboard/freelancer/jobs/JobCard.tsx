
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectCompletionStatus from '@/components/projects/ProjectCompletionStatus';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// Import our new component modules
import JobCardHeader from './card/CardHeader';
import FreelancerInfo from './card/FreelancerInfo';
import JobMetadata from './card/JobMetadata';
import JobActions from './card/JobActions';
import { getCardStyles } from './card/JobCardStyles';

interface JobCardProps {
  quote: QuoteWithFreelancer;
  clientName: string;
  onStatusUpdate: () => void;
  user?: any;
}

const JobCard: React.FC<JobCardProps> = ({ quote, clientName, onStatusUpdate, user }) => {
  const { user: authUser } = useAuth();
  
  // Fix: Properly access the project title from the project object
  const projectTitle = quote.project?.title || 'Untitled Project';
  const completedDate = quote.completed_at 
    ? format(new Date(quote.completed_at), 'MMM d, yyyy')
    : null;

  // Determine completion status
  const isFullyCompleted = Boolean(quote.completed_at && quote.client_completed && quote.freelancer_completed);
  const isPartiallyCompleted = Boolean(quote.client_completed || quote.freelancer_completed);
  const userCompleted = authUser?.user_metadata?.user_type === 'freelancer' 
    ? quote.freelancer_completed 
    : quote.client_completed;
    
  return (
    <Card key={quote.id} className={cn("w-full", getCardStyles(isFullyCompleted, isPartiallyCompleted))}>
      <JobCardHeader 
        projectTitle={projectTitle}
        isFullyCompleted={isFullyCompleted}
        isPartiallyCompleted={isPartiallyCompleted}
      />
      
      <CardContent>
        <div className="space-y-4">
          {/* Freelancer info card */}
          <FreelancerInfo quote={quote} />
          
          {/* Job metadata */}
          <JobMetadata 
            quote={quote} 
            completedDate={completedDate}
          />
          
          {/* Show completion status component only when at least one party has marked as complete */}
          {isPartiallyCompleted && (
            <ProjectCompletionStatus
              quoteId={quote.id}
              projectId={quote.project_id}
              freelancerId={quote.freelancer_id}
              clientId={quote.client_id}
              freelancerName={
                quote.freelancer_profile?.display_name || 
                `${quote.freelancer_profile?.first_name || ''} ${quote.freelancer_profile?.last_name || ''}`.trim() || 
                authUser?.user_metadata?.display_name || 
                'Freelancer'
              }
              clientName={clientName}
            />
          )}
          
          {/* Job actions */}
          <JobActions 
            quote={quote}
            projectTitle={projectTitle}
            isFullyCompleted={isFullyCompleted}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
