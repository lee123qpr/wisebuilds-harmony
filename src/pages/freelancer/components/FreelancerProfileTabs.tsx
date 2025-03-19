
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, User } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import FreelancerProfileTab from './FreelancerProfileTab';
import FreelancerReviewsTab from './FreelancerReviewsTab';

interface FreelancerProfileTabsProps {
  profile: FreelancerProfile;
}

const FreelancerProfileTabs: React.FC<FreelancerProfileTabsProps> = ({ profile }) => {
  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="ml-1">
        <TabsTrigger value="profile">
          <User className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="reviews">
          <Star className="h-4 w-4 mr-2" />
          Reviews
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="m-0">
        <FreelancerProfileTab profile={profile} />
      </TabsContent>
      
      <TabsContent value="reviews" className="m-0">
        <FreelancerReviewsTab profile={profile} />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerProfileTabs;
