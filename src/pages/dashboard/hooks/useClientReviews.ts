
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  reviewer_name?: string;
}

export const useClientReviews = (userId: string) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['client-reviews', userId],
    queryFn: async () => {
      console.log('Fetching reviews for user ID:', userId);
      
      if (!userId) {
        console.warn('No userId provided to useClientReviews');
        return [];
      }
      
      const { data, error } = await supabase
        .from('client_reviews')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: "Error loading reviews",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      console.log('Successfully fetched reviews:', data?.length || 0, 'reviews found');
      return data as Review[];
    },
    enabled: !!userId, // Only run the query if userId is provided
  });

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const calculatedAverage = parseFloat((totalRating / reviews.length).toFixed(1));
      console.log('Calculated average rating:', calculatedAverage, 'from', reviews.length, 'reviews');
      setAverageRating(calculatedAverage);
    } else if (userId) {
      // If no reviews but userId exists, ensure we show a 0 rating
      console.log('No reviews found for user', userId, 'setting rating to 0');
      setAverageRating(0);
    }
  }, [reviews, userId]);

  const reviewCount = reviews?.length || 0;
  
  console.log('useClientReviews hook returning for user', userId, ':', { 
    reviewCount, 
    averageRating, 
    isLoading,
    hasReviews: !!reviews?.length 
  });

  return {
    reviews,
    isLoading,
    averageRating,
    reviewCount
  };
};
