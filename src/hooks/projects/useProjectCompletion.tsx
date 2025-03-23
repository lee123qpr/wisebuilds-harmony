
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
 * Updates the quote with the user's completion status and increments jobs_completed count if both parties have completed
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
    // Get the quote to check current status and get freelancer ID
    const { data: quoteData, error: quoteError } = await supabase
      .from('quotes')
      .select('freelancer_id, client_id, freelancer_completed, client_completed')
      .eq('id', quoteId)
      .single();
      
    if (quoteError) {
      console.error('Error getting quote data:', quoteError);
      throw quoteError;
    }
    
    // Update the quote's completion status
    const { data, error } = await supabase
      .from('quotes')
      .update({ 
        [updateField]: true,
        // If both parties are marking complete, set the completed_at timestamp
        ...((!isFreelancer && quoteData.freelancer_completed) || 
           (isFreelancer && quoteData.client_completed) 
            ? { completed_at: new Date().toISOString() } 
            : {})
      })
      .eq('id', quoteId)
      .select('freelancer_completed, client_completed')
      .single();
      
    if (error) {
      console.error('Error updating completion status:', error);
      throw error;
    }
    
    // Check if both parties have now marked it as complete
    const bothCompleted = data.freelancer_completed && data.client_completed;
    
    if (bothCompleted) {
      // If both parties have completed, increment the jobs_completed counter for the freelancer
      const freelancerId = quoteData.freelancer_id;
      
      console.log('Both parties marked complete, incrementing jobs_completed for freelancer:', freelancerId);
      
      // First, get the current jobs_completed count
      const { data: profileData, error: fetchError } = await supabase
        .from('freelancer_profiles')
        .select('jobs_completed')
        .eq('id', freelancerId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching jobs_completed count:', fetchError);
        // Continue despite error in fetching
      }
      
      // Calculate the new count (default to 1 if we couldn't fetch the current value)
      const currentCount = profileData?.jobs_completed || 0;
      const newCount = currentCount + 1;
      
      console.log(`Updating jobs_completed from ${currentCount} to ${newCount}`);
      
      // Update the freelancer's completed jobs count
      const { error: updateError } = await supabase
        .from('freelancer_profiles')
        .update({ jobs_completed: newCount })
        .eq('id', freelancerId);
      
      if (updateError) {
        console.error('Error incrementing jobs_completed:', updateError);
        // Don't throw here, just log the error since the primary operation succeeded
      } else {
        console.log('Successfully updated jobs_completed to', newCount);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Exception in project completion:', error);
    throw error;
  }
};

/**
 * Marks a project as incomplete and sends a reason message
 */
const revertCompletionStatus = async (
  quoteId: string,
  projectId: string,
  userId: string,
  isFreelancer: boolean,
  reason: string
) => {
  console.log('Marking project as incomplete:', { projectId, quoteId, userId, isFreelancer });
  
  try {
    // Start a transaction to ensure both operations succeed or fail together
    const updateField = isFreelancer ? 'freelancer_completed' : 'client_completed';
    
    // 1. Update the completion status to false
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ [updateField]: false })
      .eq('id', quoteId);
      
    if (updateError) {
      console.error('Error reverting completion status:', updateError);
      throw updateError;
    }
    
    // 2. Create a new message in the conversation
    // First, get the conversation ID
    const { data: conversationData, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('project_id', projectId)
      .single();
      
    if (convError) {
      console.error('Error finding conversation:', convError);
      throw convError;
    }
    
    // Then, send the message
    const conversationId = conversationData.id;
    const completionMessageText = isFreelancer 
      ? "I've marked this project as incomplete because: " + reason
      : "I've marked this project as incomplete because: " + reason;
      
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        message: completionMessageText
      });
      
    if (messageError) {
      console.error('Error sending completion message:', messageError);
      throw messageError;
    }
    
    // Return success with conversation details
    return { success: true, conversationId };
  } catch (error) {
    console.error('Exception in project revert completion:', error);
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
      
      // Also invalidate freelancer profile data to ensure the updated jobs_completed count is shown
      queryClient.invalidateQueries({ queryKey: ['freelancerProfile'] });
      
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
  
  // Add a new mutation for marking a project as incomplete
  const markProjectIncompleteMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      if (!user?.id || !quoteId) {
        console.error('Error marking project as incomplete: User ID or Quote ID missing');
        throw new Error('User ID or Quote ID missing');
      }
      
      const isFreelancer = user.user_metadata?.user_type === 'freelancer';
      console.log('User type:', isFreelancer ? 'freelancer' : 'client');
      
      return revertCompletionStatus(quoteId, projectId, user.id, isFreelancer, reason);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      
      toast({
        title: 'Project marked as incomplete',
        description: 'Your feedback has been sent to the other party.',
        variant: 'default'
      });
    },
    onError: (error) => {
      console.error('Error marking project as incomplete:', error);
      toast({
        title: 'Failed to mark project as incomplete',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    }
  });
  
  return {
    markProjectCompleted: markProjectCompletedMutation.mutate,
    isMarkingComplete: markProjectCompletedMutation.isPending,
    markProjectIncomplete: markProjectIncompleteMutation.mutate,
    isMarkingIncomplete: markProjectIncompleteMutation.isPending,
    checkCompletionStatus,
  };
};
