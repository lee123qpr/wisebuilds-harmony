
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ReviewsList from './ReviewsList';
import { useClientReviews } from '../../hooks/useClientReviews';
import RatingStars from './RatingStars';

interface ReviewsTabProps {
  userId: string;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ userId }) => {
  const { averageRating, reviewCount } = useClientReviews(userId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Freelancer Reviews</CardTitle>
            <CardDescription className="mt-1">
              Reviews from clients who have worked with you
            </CardDescription>
          </div>
          {averageRating !== null && (
            <RatingStars rating={averageRating} reviewCount={reviewCount} size="lg" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ReviewsList userId={userId} />
      </CardContent>
    </Card>
  );
};

export default ReviewsTab;
