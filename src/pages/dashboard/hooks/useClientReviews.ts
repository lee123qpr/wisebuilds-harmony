
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

// Sample reviews to use when no real reviews exist
const mockReviews: Review[] = [
  {
    id: 'mock-1',
    rating: 5,
    review_text: "Excellent work! Very professional and delivered the project ahead of schedule. Would definitely hire again.",
    created_at: "2025-03-08T00:00:00.000Z",
    reviewer_name: "Sarah Johnson"
  },
  {
    id: 'mock-2',
    rating: 4,
    review_text: "Great communication throughout the project. The quality of work was very good, just needed a few minor revisions.",
    created_at: "2025-02-13T00:00:00.000Z",
    reviewer_name: "Michael Brown"
  },
  {
    id: 'mock-3',
    rating: 5,
    review_text: "Outstanding attention to detail. Went above and beyond what was required. Highly recommended!",
    created_at: "2025-01-14T00:00:00.000Z",
    reviewer_name: "David Miller"
  }
];

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

  // Determine if we should use mock reviews
  const usesMockReviews = !reviews || reviews.length === 0;
  const effectiveReviews = usesMockReviews ? mockReviews : reviews;

  useEffect(() => {
    if (effectiveReviews && effectiveReviews.length > 0) {
      const totalRating = effectiveReviews.reduce((sum, review) => sum + review.rating, 0);
      const calculatedAverage = parseFloat((totalRating / effectiveReviews.length).toFixed(1));
      console.log('Calculated average rating:', calculatedAverage, 'from', effectiveReviews.length, 'reviews');
      setAverageRating(calculatedAverage);
    } else if (userId) {
      // If no reviews but userId exists, ensure we show a 0 rating
      console.log('No reviews found for user', userId, 'setting rating to 0');
      setAverageRating(0);
    }
  }, [effectiveReviews, userId]);

  const reviewCount = effectiveReviews?.length || 0;
  
  console.log('useClientReviews hook returning for user', userId, ':', { 
    reviewCount, 
    averageRating, 
    isLoading,
    hasReviews: !!effectiveReviews?.length,
    usesMockReviews
  });

  return {
    reviews: effectiveReviews,
    isLoading,
    averageRating,
    reviewCount,
    usesMockReviews
  };
};
