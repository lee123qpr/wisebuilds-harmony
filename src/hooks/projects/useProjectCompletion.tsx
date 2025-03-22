
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/toast';

interface UseProjectCompletionProps {
  quoteId: string;
  projectId: string;
}

/**
 * Checks the completion status of a quote
 */
export const checkCompletionStatus = async (quoteId: string) => {
  if (!quoteId) return null;
  
  console.log('Checking completion status for quote:', quoteId);
  
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('freelancer_completed, client_completed, completed_at')
      .eq('id', quoteId)
      .single();
      
    if (error) {
      console.error('Error checking completion status:', error);
      return null;
    }
    
    console.log('Completion status:', data);
    return data;
  } catch (err) {
    console.error('Exception checking completion status:', err);
    return null;
  }
};

/**
 * Updates the quote with the user's completion status
 */
const updateQuoteCompletionStatus = async (
  quoteId: string, 
  projectId: string, 
  userId: string, 
  isFreelancer: boolean
) => {
  console.log('Marking project as complete:', { projectId, quoteId, userId, isFreelancer });
  
  // Determine whether this is a freelancer or client based on user metadata
  // Update the appropriate completion field based on user type
  const updateField = isFreelancer ? 'freelancer_completed' : 'client_completed';
  
  console.log(`Setting ${updateField} to true for quote ${quoteId}`);
  
  try {
    // Update the quote with the RPC approach that explicitly includes the userId
    const { data, error } = await supabase.rpc('update_project_completion_status', {
      p_quote_id: quoteId,
      p_project_id: projectId,
      p_user_id: userId,
      p_is_freelancer: isFreelancer
    });
      
    if (error) {
      console.error('Error updating completion status:', error);
      throw error;
    }
    
    console.log('Quote update response:', data);
    return data;
  } catch (error) {
    console.error('Exception in project completion:', error);
    throw error;
  }
};

/**
 * Handles successful completion status update and shows appropriate toast notifications
 */
const handleCompletionSuccess = (data: any, isFreelancer: boolean, user: any) => {
  console.log('Project completion mutation succeeded:', data);
  
  const otherParty = isFreelancer ? 'client' : 'freelancer';
  
  // Check if both parties have completed or just one
  if (data.freelancer_completed && data.client_completed) {
    toast({
      title: 'Project marked as complete!',
      description: 'You can now leave a review for this project.',
      variant: 'success'
    });
  } else {
    // Show appropriate message based on whether both parties have marked complete
    const isUserCompleted = isFreelancer ? data.freelancer_completed : data.client_completed;
    const isOtherPartyCompleted = isFreelancer ? data.client_completed : data.freelancer_completed;
    
    if (isUserCompleted && !isOtherPartyCompleted) {
      toast({
        title: 'Completion request sent',
        description: `The ${otherParty} has been notified to confirm completion.`,
        variant: 'default'
      });
    } else if (!isUserCompleted && isOtherPartyCompleted) {
      toast({
        title: 'Confirmation requested',
        description: `The ${otherParty} has marked this project as complete. Please confirm completion.`,
        variant: 'default'
      });
    }
  }
};

/**
 * Hook for managing project completion logic
 */
export const useProjectCompletion = ({ quoteId, projectId }: UseProjectCompletionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const markProjectCompletedMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !quoteId) {
        console.error('Error marking project as complete: User ID or Quote ID missing');
        throw new Error('User ID or Quote ID missing');
      }
      
      // Determine whether this is a freelancer or client based on user metadata
      const isFreelancer = user.user_metadata?.user_type === 'freelancer';
      console.log('User type:', isFreelancer ? 'freelancer' : 'client');
      
      return updateQuoteCompletionStatus(quoteId, projectId, user.id, isFreelancer);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
      handleCompletionSuccess(data, isFreelancer, user);
    },
    onError: (error) => {
      console.error('Error marking project as complete:', error);
      toast({
        title: 'Failed to mark project as complete',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  });
  
  return {
    markProjectCompleted: markProjectCompletedMutation.mutate,
    isMarkingComplete: markProjectCompletedMutation.isPending,
    checkCompletionStatus,
  };
};
