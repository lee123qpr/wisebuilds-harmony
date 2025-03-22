
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/toast';

interface UseProjectCompletionProps {
  quoteId: string;
  projectId: string;
}

export const useProjectCompletion = ({ quoteId, projectId }: UseProjectCompletionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const markProjectCompletedMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !quoteId) {
        console.error('Error marking project as complete: User ID or Quote ID missing');
        throw new Error('User ID or Quote ID missing');
      }
      
      console.log('Marking project as complete:', { projectId, quoteId, userId: user.id });
      
      // Determine whether this is a freelancer or client based on user metadata
      const isFreelancer = user.user_metadata?.user_type === 'freelancer';
      
      // Update the appropriate completion field based on user type
      const updateField = isFreelancer ? 'freelancer_completed' : 'client_completed';
      
      console.log(`Setting ${updateField} to true for quote ${quoteId}`);
      
      // Update the quote
      const { data, error } = await supabase
        .from('quotes')
        .update({ [updateField]: true })
        .eq('id', quoteId)
        .select('*')
        .single();
        
      if (error) {
        console.error('Error updating quote:', error);
        throw error;
      }
      
      console.log('Quote updated successfully:', data);
      
      // Check if both parties have marked as complete
      if (data.freelancer_completed && data.client_completed) {
        console.log('Both parties have marked as complete, setting completed_at timestamp');
        
        // Set the completed_at timestamp
        const { error: completionError } = await supabase
          .from('quotes')
          .update({ completed_at: new Date().toISOString() })
          .eq('id', quoteId);
          
        if (completionError) {
          console.error('Error setting completed_at:', completionError);
          throw completionError;
        }
        
        // Update project status to completed
        console.log('Updating project status to completed');
        const { error: projectError } = await supabase
          .from('projects')
          .update({ status: 'completed' })
          .eq('id', projectId);
          
        if (projectError) {
          console.error('Error updating project status:', projectError);
          throw projectError;
        }
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Project completion mutation succeeded:', data);
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
      const otherParty = isFreelancer ? 'client' : 'freelancer';
      
      if (data.freelancer_completed && data.client_completed) {
        toast({
          title: 'Project marked as complete!',
          description: 'You can now leave a review for this project.',
          variant: 'success'
        });
      } else {
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
  
  const checkCompletionStatus = async () => {
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
  
  return {
    markProjectCompleted: markProjectCompletedMutation.mutate,
    isMarkingComplete: markProjectCompletedMutation.isPending,
    checkCompletionStatus,
  };
};
