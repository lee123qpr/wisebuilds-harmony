
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/toast';
import { useProjectCompletion } from '@/hooks/projects/useProjectCompletion';

export const useCompletionStatus = (quoteId: string, onStatusUpdate?: () => void) => {
  const { user } = useAuth();
  const [completionStatus, setCompletionStatus] = useState<{
    freelancer_completed: boolean;
    client_completed: boolean;
    completed_at: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  
  const { checkCompletionStatus } = useProjectCompletion({ 
    quoteId, 
    projectId: '' // Not used for checking status
  });
  
  const loadCompletionStatus = async () => {
    setIsLoading(true);
    try {
      console.log("Checking completion status for quoteId:", quoteId);
      const status = await checkCompletionStatus(quoteId);
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
      console.log("Loading completion status for quoteId:", quoteId);
      loadCompletionStatus();
    }
  }, [quoteId]);

  // Compute completion states
  const isFullyCompleted = completionStatus?.completed_at && 
    completionStatus.freelancer_completed && 
    completionStatus.client_completed;
  
  const userCompleted = isFreelancer 
    ? completionStatus?.freelancer_completed 
    : completionStatus?.client_completed;
  
  const otherPartyCompleted = isFreelancer 
    ? completionStatus?.client_completed 
    : completionStatus?.freelancer_completed;
  
  const otherPartyLabel = isFreelancer ? 'client' : 'freelancer';

  return {
    completionStatus,
    isLoading,
    isFullyCompleted,
    userCompleted,
    otherPartyCompleted,
    otherPartyLabel,
    isFreelancer,
    loadCompletionStatus
  };
};
