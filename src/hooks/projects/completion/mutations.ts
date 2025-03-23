
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/toast';
import { ProjectCompletionProps } from './types';
import { updateQuoteCompletionStatus, revertCompletionStatus } from './api';
import { handleCompletionSuccess } from './utils';

export const useMarkProjectCompletedMutation = ({ quoteId, projectId }: ProjectCompletionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
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
      
      // Also invalidate profile data to ensure the updated jobs_completed count is shown
      queryClient.invalidateQueries({ queryKey: ['freelancerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['clientProfile'] });
      
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
};

export const useMarkProjectIncompleteMutation = ({ quoteId, projectId }: ProjectCompletionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
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
};
