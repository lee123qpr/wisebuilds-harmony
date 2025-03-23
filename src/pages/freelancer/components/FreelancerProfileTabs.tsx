
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Star, Award, Briefcase } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import FreelancerProfileTab from './FreelancerProfileTab';
import FreelancerReviewsTab from './FreelancerReviewsTab';

interface FreelancerProfileTabsProps {
  profile: FreelancerProfile;
}

const FreelancerProfileTabs: React.FC<FreelancerProfileTabsProps> = ({ profile }) => {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="ml-1 grid grid-cols-2 md:flex md:w-auto md:inline-flex p-1 h-auto bg-muted/80 backdrop-blur-sm">
        <TabsTrigger value="profile" className="py-2.5 px-4 rounded-md data-[state=active]:bg-background">
          <FileText className="h-4 w-4 mr-2" />
          <span>Profile</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="py-2.5 px-4 rounded-md data-[state=active]:bg-background">
          <Star className="h-4 w-4 mr-2" />
          <span>Reviews</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="m-0 animate-fade-in">
        <FreelancerProfileTab profile={profile} />
      </TabsContent>
      
      <TabsContent value="reviews" className="m-0 animate-fade-in">
        <FreelancerReviewsTab profile={profile} />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerProfileTabs;
