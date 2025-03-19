
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useFreelancerProfileData } from '@/hooks/freelancer/useFreelancerProfileData';
import FreelancerProfileHeader from './components/FreelancerProfileHeader';
import FreelancerProfileLoading from './components/FreelancerProfileLoading';
import FreelancerProfileNotFound from './components/FreelancerProfileNotFound';
import FreelancerProfileTabs from './components/FreelancerProfileTabs';

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
          <FreelancerProfileTabs profile={profile} />
        )}
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileView;
