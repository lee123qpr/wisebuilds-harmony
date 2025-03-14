
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ReviewsList from './ReviewsList';

interface ReviewsTabProps {
  userId: string;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ userId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Reviews</CardTitle>
        <CardDescription>
          Reviews from freelancers who have worked with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReviewsList userId={userId} />
      </CardContent>
    </Card>
  );
};

export default ReviewsTab;
