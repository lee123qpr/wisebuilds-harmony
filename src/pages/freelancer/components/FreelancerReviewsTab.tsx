
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ReviewsList from '@/pages/dashboard/components/profile/ReviewsList';
import { FreelancerProfile } from '@/types/applications';

interface FreelancerReviewsTabProps {
  profile: FreelancerProfile;
}

const FreelancerReviewsTab: React.FC<FreelancerReviewsTabProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Reviews</CardTitle>
        <CardDescription>
          Feedback from clients who have worked with {profile.display_name || 'this freelancer'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReviewsList userId={profile.id} />
      </CardContent>
    </Card>
  );
};

export default FreelancerReviewsTab;
