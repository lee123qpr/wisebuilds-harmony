
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCompleteButton from '@/components/projects/ProjectCompleteButton';
import FreelancerProfileLink from '@/pages/project/components/FreelancerProfileLink';
import { QuoteWithFreelancer } from '@/types/quotes';

interface JobActionsProps {
  quote: QuoteWithFreelancer;
  projectTitle: string;
  isFullyCompleted: boolean;
  onStatusUpdate: () => void;
}

const JobActions: React.FC<JobActionsProps> = ({ 
  quote, 
  projectTitle, 
  isFullyCompleted, 
  onStatusUpdate 
}) => {
  const navigate = useNavigate();
  
  // Handle navigate to project view with state indicating we're coming from active jobs
  const handleViewProject = () => {
    navigate(`/project/${quote.project_id}`, {
      state: { from: 'activeJobs' }
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleViewProject}
      >
        View Project
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      <FreelancerProfileLink
        freelancerId={quote.freelancer_id}
        projectId={quote.project_id}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <User className="h-4 w-4" />
        View Profile
      </FreelancerProfileLink>
      
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
  );
};

export default JobActions;
