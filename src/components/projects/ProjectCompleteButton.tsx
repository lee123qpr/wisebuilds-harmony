
import React, { useState, useEffect } from 'react';
import { useProjectCompletion } from '@/hooks/projects/useProjectCompletion';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/toast';
import ProjectCompletionDialog from './completion/ProjectCompletionDialog';
import CompletionStatusIndicator from './completion/CompletionStatusIndicator';
import CompleteProjectButton from './completion/CompleteProjectButton';
import CompletionLoadingIndicator from './completion/CompletionLoadingIndicator';

interface ProjectCompleteButtonProps {
  quoteId: string;
  projectId: string;
  projectTitle?: string;
  onStatusUpdate?: () => void;
}

const ProjectCompleteButton: React.FC<ProjectCompleteButtonProps> = ({
  quoteId,
  projectId,
  projectTitle = 'this project',
  onStatusUpdate
}) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<{
    freelancer_completed: boolean;
    client_completed: boolean;
    completed_at: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  
  const { 
    markProjectCompleted, 
    isMarkingComplete, 
    checkCompletionStatus 
  } = useProjectCompletion({ quoteId, projectId });
  
  const loadCompletionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await checkCompletionStatus();
      console.log("Loaded completion status:", status);
      setCompletionStatus(status);
    } catch (error) {
      console.error("Error loading completion status:", error);
      toast({
        title: "Error loading status",
        description: "Could not load project completion status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (quoteId) {
      loadCompletionStatus();
    }
  }, [quoteId]);
  
  const handleComplete = async () => {
    try {
      console.log("Marking project as complete...");
      await markProjectCompleted();
      setDialogOpen(false);
      
      // Add delay before refreshing status to ensure database has updated
      // Using a longer delay to ensure data is properly updated
      setTimeout(() => {
        console.log("Refreshing status after completion...");
        loadCompletionStatus();
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      }, 1500);
    } catch (error) {
      console.error('Error completing project:', error);
      toast({
        title: 'Failed to complete project',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return <CompletionLoadingIndicator />;
  }
  
  if (!completionStatus) {
    return null;
  }
  
  // Check if project is fully completed
  const isFullyCompleted = completionStatus.completed_at && 
    completionStatus.freelancer_completed && 
    completionStatus.client_completed;
  
  // Check if current user has marked as complete
  const userCompleted = isFreelancer 
    ? completionStatus.freelancer_completed 
    : completionStatus.client_completed;
  
  // Check if the other party has marked as complete
  const otherPartyCompleted = isFreelancer 
    ? completionStatus.client_completed 
    : completionStatus.freelancer_completed;
  
  const otherPartyLabel = isFreelancer ? 'client' : 'freelancer';
  
  // If project is fully completed, show completion badge
  if (isFullyCompleted) {
    return (
      <CompletionStatusIndicator 
        isCompleted={true}
        userCompleted={userCompleted}
        otherPartyCompleted={otherPartyCompleted}
        otherPartyLabel={otherPartyLabel}
      />
    );
  }
  
  // If the user has marked as complete but project isn't fully completed yet
  if (userCompleted) {
    return (
      <CompletionStatusIndicator 
        isCompleted={false}
        userCompleted={userCompleted}
        otherPartyCompleted={otherPartyCompleted}
        otherPartyLabel={otherPartyLabel}
      />
    );
  }
  
  // If the user hasn't marked as complete yet, show button and dialog
  return (
    <>
      <CompleteProjectButton 
        onClick={() => setDialogOpen(true)}
        otherPartyCompleted={otherPartyCompleted}
      />
      
      <ProjectCompletionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleComplete}
        isProcessing={isMarkingComplete}
        otherPartyCompleted={otherPartyCompleted}
        otherPartyLabel={otherPartyLabel}
      />
    </>
  );
};

export default ProjectCompleteButton;
