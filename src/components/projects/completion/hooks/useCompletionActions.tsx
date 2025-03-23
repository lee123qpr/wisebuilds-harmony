
import { useState } from 'react';
import { toast } from '@/hooks/toast';
import { useProjectCompletion } from '@/hooks/projects/useProjectCompletion';

export const useCompletionActions = (
  quoteId: string,
  projectId: string,
  loadCompletionStatus: () => Promise<void>,
  onStatusUpdate?: () => void
) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteDialogOpen, setIncompleteDialogOpen] = useState(false);
  
  const { 
    markProjectCompleted, 
    isMarkingComplete, 
    markProjectIncomplete,
    isMarkingIncomplete
  } = useProjectCompletion({ quoteId, projectId });
  
  const handleComplete = async () => {
    try {
      console.log("Marking project as complete for quoteId:", quoteId, "projectId:", projectId);
      await markProjectCompleted();
      console.log("Mark complete operation completed successfully");
      setDialogOpen(false);
      
      // Add delay before refreshing status to ensure database has updated
      setTimeout(() => {
        console.log("Refreshing status after completion...");
        loadCompletionStatus();
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      }, 1500);
      
      // Show success toast
      toast({
        title: 'Project marked as complete',
        description: 'The project has been marked as complete.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error completing project:', error);
      toast({
        title: 'Failed to complete project',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  };
  
  const handleMarkIncomplete = async (reason: string) => {
    try {
      await markProjectIncomplete({ reason });
      setIncompleteDialogOpen(false);
      
      // Refresh after status update
      setTimeout(() => {
        loadCompletionStatus();
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      }, 1500);
    } catch (error) {
      console.error('Error marking project as incomplete:', error);
      toast({
        title: 'Failed to mark project as incomplete',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    incompleteDialogOpen,
    setIncompleteDialogOpen,
    handleComplete,
    handleMarkIncomplete,
    isMarkingComplete,
    isMarkingIncomplete
  };
};
