
import React from 'react';
import { useCompletionStatus } from './completion/hooks/useCompletionStatus';
import { useCompletionActions } from './completion/hooks/useCompletionActions';
import ProjectCompletionDialog from './completion/ProjectCompletionDialog';
import IncompleteProjectDialog from './completion/IncompleteProjectDialog';
import CompletionStatusIndicator from './completion/CompletionStatusIndicator';
import CompleteProjectButton from './completion/CompleteProjectButton';
import CompletionLoadingIndicator from './completion/CompletionLoadingIndicator';
import DisputeButton from './completion/DisputeButton';

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
  const {
    isLoading,
    completionStatus,
    isFullyCompleted,
    userCompleted,
    otherPartyCompleted,
    otherPartyLabel,
    loadCompletionStatus
  } = useCompletionStatus(quoteId, onStatusUpdate);
  
  const {
    dialogOpen,
    setDialogOpen,
    incompleteDialogOpen,
    setIncompleteDialogOpen,
    handleComplete,
    handleMarkIncomplete,
    isMarkingComplete,
    isMarkingIncomplete
  } = useCompletionActions(quoteId, projectId, loadCompletionStatus, onStatusUpdate);
  
  if (isLoading) {
    return <CompletionLoadingIndicator />;
  }
  
  if (!completionStatus) {
    return null;
  }
  
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
      <div className="flex items-center gap-2">
        <CompletionStatusIndicator 
          isCompleted={false}
          userCompleted={userCompleted}
          otherPartyCompleted={otherPartyCompleted}
          otherPartyLabel={otherPartyLabel}
        />
        
        <DisputeButton onClick={() => setIncompleteDialogOpen(true)} />
        
        <IncompleteProjectDialog
          open={incompleteDialogOpen}
          onOpenChange={setIncompleteDialogOpen}
          onConfirm={handleMarkIncomplete}
          isProcessing={isMarkingIncomplete}
          otherPartyLabel={otherPartyLabel}
        />
      </div>
    );
  }
  
  // If the other party has marked as complete but the user hasn't
  if (otherPartyCompleted && !userCompleted) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <CompleteProjectButton 
          onClick={() => setDialogOpen(true)}
          otherPartyCompleted={otherPartyCompleted}
          disabled={isMarkingComplete}
        />
        
        <DisputeButton onClick={() => setIncompleteDialogOpen(true)} />
        
        <ProjectCompletionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleComplete}
          isProcessing={isMarkingComplete}
          otherPartyCompleted={otherPartyCompleted}
          otherPartyLabel={otherPartyLabel}
        />
        
        <IncompleteProjectDialog
          open={incompleteDialogOpen}
          onOpenChange={setIncompleteDialogOpen}
          onConfirm={handleMarkIncomplete}
          isProcessing={isMarkingIncomplete}
          otherPartyLabel={otherPartyLabel}
        />
      </div>
    );
  }
  
  // If neither party has marked as complete
  return (
    <>
      <CompleteProjectButton 
        onClick={() => setDialogOpen(true)}
        otherPartyCompleted={otherPartyCompleted}
        disabled={isMarkingComplete}
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
