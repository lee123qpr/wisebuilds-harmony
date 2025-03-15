
import React from 'react';
import { UserCircle } from 'lucide-react';
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
    created_at: "2025-03-08T00:00:00.000Z", // Format as YYYY-MM-DD
    reviewer_name: "Sarah Johnson"
  },
  {
    id: 'mock-2',
    rating: 4,
    review_text: "Great communication throughout the project. The quality of work was very good, just needed a few minor revisions.",
    created_at: "2025-02-13T00:00:00.000Z", // Format as YYYY-MM-DD
    reviewer_name: "Michael Brown"
  },
  {
    id: 'mock-3',
    rating: 5,
    review_text: "Outstanding attention to detail. Went above and beyond what was required. Highly recommended!",
    created_at: "2025-01-14T00:00:00.000Z", // Format as YYYY-MM-DD
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
  
  // Helper function to format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Helper function to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div>
      {!reviews?.length && (
        <div className="mb-6 p-4 bg-slate-50 rounded-md text-sm text-slate-600">
          {reviewSource}
        </div>
      )}
      <div className="space-y-6">
        {displayReviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="h-10 w-10 text-slate-400" />
                <span className="font-semibold text-lg">
                  {review.reviewer_name || "Client"}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                {formatDate(review.created_at)}
              </div>
            </div>
            
            {renderStars(review.rating)}
            
            <p className="text-base mt-2">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
