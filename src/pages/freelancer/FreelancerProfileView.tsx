
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, User } from 'lucide-react';
import { useFreelancerProfileData } from '@/hooks/freelancer/useFreelancerProfileData';
import FreelancerProfileHeader from './components/FreelancerProfileHeader';
import FreelancerProfileLoading from './components/FreelancerProfileLoading';
import FreelancerProfileNotFound from './components/FreelancerProfileNotFound';
import FreelancerProfileTab from './components/FreelancerProfileTab';
import FreelancerReviewsTab from './components/FreelancerReviewsTab';

const FreelancerProfileView: React.FC = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const { profile, isLoading } = useFreelancerProfileData(freelancerId);

  return (
    <MainLayout>
      <div className="container py-8">
        <FreelancerProfileHeader />

        {isLoading ? (
          <FreelancerProfileLoading />
        ) : !profile ? (
          <FreelancerProfileNotFound />
        ) : (
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
        )}
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileView;
