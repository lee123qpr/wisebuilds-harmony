
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ReviewsListProps {
  userId: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ userId }) => {
  console.log('ReviewsList - Props:', { userId });
  
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['client-reviews', userId],
    queryFn: async () => {
      console.log('Fetching reviews for user ID:', userId);
      const { data, error } = await supabase
        .from('client_reviews')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      console.log('Fetched reviews:', data);
      return data as Review[];
    },
  });

  if (error) {
    console.error('ReviewsList - Query error:', error);
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (!reviews?.length) {
    console.log('ReviewsList - No reviews found');
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Reviews will appear here when freelancers rate their experience working with you.
      </div>
    );
  }

  console.log('ReviewsList - Rendering reviews:', reviews);
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border rounded-lg p-4 space-y-2"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{review.review_text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
