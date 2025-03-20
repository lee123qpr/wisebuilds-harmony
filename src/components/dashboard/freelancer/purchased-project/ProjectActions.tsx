
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Quote } from 'lucide-react';
import QuoteDialog from '@/components/quotes/QuoteDialog';

interface ProjectActionsProps {
  project: any;
  hasSubmittedQuote: boolean;
  showQuoteDetails: boolean;
  setShowQuoteDetails: (show: boolean) => void;
  handleRefresh: () => void;
  handleStartChat: () => void;
  handleViewDetails: () => void;
  quoteStatus?: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  project,
  hasSubmittedQuote,
  showQuoteDetails,
  setShowQuoteDetails,
  handleRefresh,
  handleStartChat,
  handleViewDetails,
  quoteStatus
}) => {
  const navigate = useNavigate();

  // Prevent unnecessary re-renders by memoizing handlers
  const handleNavigateToActiveJobs = React.useCallback(() => {
    navigate('/dashboard/freelancer?tab=activeJobs');
  }, [navigate]);
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleViewDetails}
      >
        View Details
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={handleStartChat}
      >
        <MessageSquare className="h-4 w-4" />
        Message Now
      </Button>
      
      {hasSubmittedQuote ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => setShowQuoteDetails(!showQuoteDetails)}
        >
          <Quote className="h-4 w-4" />
          {showQuoteDetails ? 'Hide Quote' : 'View Quote'}
        </Button>
      ) : (
        <QuoteDialog 
          projectId={project.id}
          projectTitle={project.title}
          clientId={project.user_id}
          onQuoteSubmitted={handleRefresh}
        />
      )}
      
      {quoteStatus === 'accepted' && (
        <Button 
          variant="default" 
          size="sm" 
          className="gap-2 bg-green-600 hover:bg-green-700"
          onClick={handleNavigateToActiveJobs}
        >
          View Active Job
        </Button>
      )}
    </div>
  );
};

export default ProjectActions;
