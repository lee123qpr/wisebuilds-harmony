
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export const useClientReviews = (userId: string) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['client-reviews', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_reviews')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(parseFloat((totalRating / reviews.length).toFixed(1)));
    } else {
      setAverageRating(null);
    }
  }, [reviews]);

  return {
    reviews,
    isLoading,
    averageRating,
    reviewCount: reviews?.length || 0
  };
};
