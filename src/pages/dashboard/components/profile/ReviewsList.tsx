
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star, UserCircle } from 'lucide-react';
import { useClientReviews } from '../../hooks/useClientReviews';

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer_name?: string;
}

interface ReviewsListProps {
  userId: string;
}

// Mock reviews to display if no real reviews exist
const mockReviews: Review[] = [
  {
    id: 'mock-1',
    rating: 5,
    review_text: "Excellent work! Very professional and delivered the project ahead of schedule. Would definitely hire again.",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    reviewer_name: "Sarah Johnson"
  },
  {
    id: 'mock-2',
    rating: 4,
    review_text: "Great communication throughout the project. The quality of work was very good, just needed a few minor revisions.",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    reviewer_name: "Michael Brown"
  },
  {
    id: 'mock-3',
    rating: 5,
    review_text: "Outstanding attention to detail. Went above and beyond what was required. Highly recommended!",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
    reviewer_name: "David Miller"
  }
];

const ReviewsList: React.FC<ReviewsListProps> = ({ userId }) => {
  console.log('ReviewsList - Props:', { userId });
  
  const { reviews, isLoading, reviewCount } = useClientReviews(userId);

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  // Display mock reviews if no real reviews exist
  const displayReviews = reviews?.length ? reviews : mockReviews;
  const reviewSource = reviews?.length ? "Real reviews from your clients" : "Sample reviews (these are examples only)";

  console.log('ReviewsList - Rendering reviews:', displayReviews);
  return (
    <div>
      {!reviews?.length && (
        <div className="mb-4 p-2 bg-muted rounded text-sm text-muted-foreground">
          {reviewSource}
        </div>
      )}
      <div className="space-y-4">
        {displayReviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium">
                  {review.reviewer_name || "Client"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
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
            </div>
            <p className="text-sm">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
