
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
      
      // First check if the quote exists
      const { data: quoteExists, error: checkError } = await supabase
        .from('quotes')
        .select('id')
        .eq('id', quoteId)
        .limit(1);
      
      if (checkError) {
        console.error('Error checking quote existence:', checkError);
        throw checkError;
      }
      
      if (!quoteExists || quoteExists.length === 0) {
        console.error('Quote not found:', quoteId);
        throw new Error('Quote not found');
      }
      
      // Now update the quote (changed from using .single() to handling response manually)
      const { data: updatedQuotes, error } = await supabase
        .from('quotes')
        .update({ [updateField]: true })
        .eq('id', quoteId)
        .select('*');
        
      if (error) {
        console.error('Error updating quote:', error);
        throw error;
      }
      
      if (!updatedQuotes || updatedQuotes.length === 0) {
        console.error('No quote was updated');
        throw new Error('No quote was updated');
      }
      
      const updatedQuote = updatedQuotes[0];
      console.log('Quote updated successfully:', updatedQuote);
      
      // Check if both parties have marked as complete
      if (updatedQuote.freelancer_completed && updatedQuote.client_completed) {
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
      
      return updatedQuote;
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
          description: 'You can now leave a review for this project.'
        });
      } else {
        toast({
          title: 'Completion request sent',
          description: `Waiting for the ${otherParty} to confirm completion.`
        });
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
      // Changed from using .single() to handling the response manually
      const { data, error } = await supabase
        .from('quotes')
        .select('freelancer_completed, client_completed, completed_at')
        .eq('id', quoteId)
        .limit(1);
        
      if (error) {
        console.error('Error checking completion status:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.error('No quote found with ID:', quoteId);
        return null;
      }
      
      console.log('Completion status:', data[0]);
      return data[0];
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
