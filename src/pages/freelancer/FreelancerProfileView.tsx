
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFreelancerProfileData } from '@/hooks/freelancer/useFreelancerProfileData';
import FreelancerProfileHeader from './components/FreelancerProfileHeader';
import FreelancerProfileTabs from './components/FreelancerProfileTabs';
import FreelancerProfileLoading from './components/FreelancerProfileLoading';
import FreelancerProfileNotFound from './components/FreelancerProfileNotFound';

const FreelancerProfileView: React.FC = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const { profile, isLoading } = useFreelancerProfileData(freelancerId);

  if (isLoading) {
    return <FreelancerProfileLoading />;
  }

  if (!profile) {
    return <FreelancerProfileNotFound />;
  }

  return (
    <div className="container max-w-5xl px-4 py-8 mx-auto">
      <FreelancerProfileHeader profile={profile} />
      <FreelancerProfileTabs profile={profile} />
    </div>
  );
};

export default FreelancerProfileView;
