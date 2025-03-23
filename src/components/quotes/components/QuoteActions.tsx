
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerProfileLink from '@/pages/project/components/FreelancerProfileLink';

interface QuoteActionsProps {
  projectId: string;
  quoteId: string;
  freelancerId: string;
}

const QuoteActions: React.FC<QuoteActionsProps> = ({
  projectId,
  quoteId,
  freelancerId
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/project/${projectId}/quotes/${quoteId}`);
  };
  
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleViewDetails}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        View Details
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
    </div>
  );
};

export default QuoteActions;
