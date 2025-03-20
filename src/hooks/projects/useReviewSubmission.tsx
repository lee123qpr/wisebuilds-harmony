
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
        throw new Error('User not authenticated');
      }
      
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
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
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
    
    return !!data;
  };
  
  return {
    submitReview: submitReviewMutation.mutate,
    isSubmitting: submitReviewMutation.isPending,
    checkReviewExists
  };
};
