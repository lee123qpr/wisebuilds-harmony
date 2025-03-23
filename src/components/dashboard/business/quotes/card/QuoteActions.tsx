
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerProfileLink from '@/pages/project/components/FreelancerProfileLink';

interface QuoteActionsProps {
  projectId: string;
  quoteId: string;
  freelancerId: string;
  isAccepted: boolean;
}

const QuoteActions: React.FC<QuoteActionsProps> = ({
  projectId,
  quoteId,
  freelancerId,
  isAccepted
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(`/project/${projectId}`)}
      >
        View Project
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate(`/project/${projectId}/quotes/${quoteId}`)}
      >
        View Quote Details
      </Button>
      
      <FreelancerProfileLink
        freelancerId={freelancerId}
        projectId={projectId}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <User className="h-4 w-4" />
        View Profile
      </FreelancerProfileLink>
      
      {isAccepted && (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => navigate(`/dashboard/business?tab=messages&freelancerId=${freelancerId}`)}
        >
          <MessageSquare className="h-4 w-4" />
          Message Freelancer
        </Button>
      )}
    </div>
  );
};

export default QuoteActions;
