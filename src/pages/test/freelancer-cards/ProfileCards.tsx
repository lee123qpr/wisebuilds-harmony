
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import FreelancerProfileHeader from '@/pages/freelancer/components/FreelancerProfileHeader';

interface ProfileCardsProps {
  completeFreelancer: any;
  minimalFreelancer: any;
  newFreelancer: any;
  expertFreelancer: any;
}

const ProfileCards: React.FC<ProfileCardsProps> = ({
  completeFreelancer,
  minimalFreelancer,
  newFreelancer,
  expertFreelancer
}) => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Profile Header - Complete Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <FreelancerProfileHeader profile={completeFreelancer} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Profile Header - Minimal Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <FreelancerProfileHeader profile={minimalFreelancer} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Profile Header - Expert Freelancer</CardTitle>
        </CardHeader>
        <CardContent>
          <FreelancerProfileHeader profile={expertFreelancer} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Profile Header - New Freelancer</CardTitle>
        </CardHeader>
        <CardContent>
          <FreelancerProfileHeader profile={newFreelancer} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCards;
