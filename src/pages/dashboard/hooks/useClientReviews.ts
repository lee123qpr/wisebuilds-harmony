
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      console.log('Fetching reviews for client ID:', userId);
      
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
    } else {
      console.log('No reviews available for rating calculation');
      setAverageRating(null);
    }
  }, [reviews]);

  const reviewCount = reviews?.length || 0;
  
  console.log('useClientReviews hook returning:', { 
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
