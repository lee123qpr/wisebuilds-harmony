
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ReviewsList from '@/pages/dashboard/components/profile/ReviewsList';
import { FreelancerProfile } from '@/types/applications';
import { useClientReviews } from '@/pages/dashboard/hooks/useClientReviews';
import RatingStars from '@/components/common/RatingStars';

interface FreelancerReviewsTabProps {
  profile: FreelancerProfile;
}

const FreelancerReviewsTab: React.FC<FreelancerReviewsTabProps> = ({ profile }) => {
  const { averageRating, reviewCount } = useClientReviews(profile.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Client Reviews</CardTitle>
            <CardDescription>
              Feedback from clients who have worked with {profile.display_name || 'this freelancer'}
            </CardDescription>
          </div>
          <RatingStars rating={averageRating} reviewCount={reviewCount} size="lg" showEmpty={true} />
        </div>
      </CardHeader>
      <CardContent>
        <ReviewsList userId={profile.id} />
      </CardContent>
    </Card>
  );
};

export default FreelancerReviewsTab;
