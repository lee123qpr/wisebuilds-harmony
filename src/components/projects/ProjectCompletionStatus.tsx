
import React from 'react';
import { useReviewSubmission } from '@/hooks/projects/useReviewSubmission';
import { useCompletionStatus } from './completion/hooks/useCompletionStatus';
import { useCompletionActions } from './completion/hooks/useCompletionActions';
import CompletionLoadingCard from './completion/CompletionLoadingCard';
import CompletedProjectCard from './completion/CompletedProjectCard';
import PartialCompletionCard from './completion/PartialCompletionCard';

interface ProjectCompletionStatusProps {
  quoteId: string;
  projectId: string;
  freelancerId: string;
  clientId: string;
  freelancerName?: string;
  clientName?: string;
}

const ProjectCompletionStatus: React.FC<ProjectCompletionStatusProps> = ({
  quoteId,
  projectId,
  freelancerId,
  clientId,
  freelancerName = 'the freelancer',
  clientName = 'the client'
}) => {
  const {
    completionStatus,
    isLoading,
    isFullyCompleted,
    userCompleted,
    otherPartyCompleted,
    otherPartyLabel,
    isFreelancer,
    loadCompletionStatus
  } = useCompletionStatus(quoteId);
  
  const {
    dialogOpen,
    setDialogOpen,
    incompleteDialogOpen,
    setIncompleteDialogOpen,
    handleComplete,
    handleMarkIncomplete,
    isMarkingComplete,
    isMarkingIncomplete
  } = useCompletionActions(quoteId, projectId, loadCompletionStatus);
  
  const { checkReviewExists } = useReviewSubmission();
  const [hasReviewed, setHasReviewed] = React.useState(false);
  
  const revieweeId = isFreelancer ? clientId : freelancerId;
  const revieweeName = isFreelancer ? clientName : freelancerName;
  
  // Check if user has already left a review
  React.useEffect(() => {
    const checkReview = async () => {
      if (completionStatus?.completed_at) {
        const hasLeftReview = await checkReviewExists(quoteId);
        setHasReviewed(hasLeftReview);
      }
    };
    
    checkReview();
  }, [completionStatus, quoteId, checkReviewExists]);
  
  const handleReviewSubmitted = () => {
    setHasReviewed(true);
  };
  
  if (isLoading) {
    return <CompletionLoadingCard />;
  }
  
  if (!completionStatus) {
    return null;
  }
  
  // If neither party has marked complete, don't show anything
  if (!userCompleted && !otherPartyCompleted) {
    return null;
  }
  
  // If project is fully complete - show review form if user hasn't reviewed yet
  if (isFullyCompleted) {
    return (
      <CompletedProjectCard
        hasReviewed={hasReviewed}
        revieweeId={revieweeId}
        revieweeName={revieweeName}
        projectId={projectId}
        quoteId={quoteId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    );
  }
  
  // Project is partially complete (waiting for other party)
  return (
    <PartialCompletionCard
      userCompleted={userCompleted}
      otherPartyCompleted={otherPartyCompleted}
      otherPartyLabel={otherPartyLabel}
      incompleteDialogOpen={incompleteDialogOpen}
      setIncompleteDialogOpen={setIncompleteDialogOpen}
      handleMarkIncomplete={handleMarkIncomplete}
      isMarkingIncomplete={isMarkingIncomplete}
    />
  );
};

export default ProjectCompletionStatus;
