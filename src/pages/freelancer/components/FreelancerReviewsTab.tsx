
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ReviewsList from '@/pages/dashboard/components/profile/ReviewsList';
import { FreelancerProfile } from '@/types/applications';
import ProfileRatingStars from './ProfileRatingStars';
import { useClientReviews } from '@/pages/dashboard/hooks/useClientReviews';

interface FreelancerReviewsTabProps {
  profile: FreelancerProfile;
}

const FreelancerReviewsTab: React.FC<FreelancerReviewsTabProps> = ({ profile }) => {
  // Get the real or mock review data using the hook
  const { averageRating, reviewCount } = useClientReviews(profile.id);
  
  console.log('FreelancerReviewsTab - profile data:', {
    id: profile.id,
    rating: profile.rating,
    reviews_count: profile.reviews_count,
    averageRating,
    reviewCount
  });

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
          <ProfileRatingStars 
            userId={profile.id}
            rating={averageRating}
            reviewsCount={reviewCount}
            showEmpty={true}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ReviewsList userId={profile.id} />
      </CardContent>
    </Card>
  );
};

export default FreelancerReviewsTab;
