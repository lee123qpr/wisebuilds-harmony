
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ReviewData {
  projectId: string;
  quoteId: string;
  revieweeId: string;
  rating: number;
  reviewText?: string;
}

export const useReviewSubmission = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const submitReviewMutation = useMutation({
    mutationFn: async ({ projectId, quoteId, revieweeId, rating, reviewText }: ReviewData) => {
      if (!user?.id) {
        console.error('Error submitting review: User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log('Submitting review:', { projectId, quoteId, revieweeId, rating, reviewText });
      
      const isFreelancer = user.user_metadata?.user_type === 'freelancer';
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          project_id: projectId,
          quote_id: quoteId,
          reviewer_id: user.id,
          reviewee_id: revieweeId,
          rating,
          review_text: reviewText || null,
          is_freelancer_review: isFreelancer
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting review:', error);
        throw error;
      }
      
      console.log('Review submitted successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Review submission successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review submitted successfully', {
        description: 'Thank you for your feedback!'
      });
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  });
  
  const checkReviewExists = async (quoteId: string) => {
    if (!user?.id || !quoteId) return false;
    
    console.log('Checking if review exists for quote:', quoteId);
    
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('quote_id', quoteId)
      .eq('reviewer_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking for existing review:', error);
      return false;
    }
    
    console.log('Review exists check result:', !!data);
    return !!data;
  };
  
  return {
    submitReview: submitReviewMutation.mutate,
    isSubmitting: submitReviewMutation.isPending,
    checkReviewExists
  };
};
