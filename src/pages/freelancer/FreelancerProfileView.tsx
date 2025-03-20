
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFreelancerProfileData } from '@/hooks/freelancer/useFreelancerProfileData';
import FreelancerProfileHeader from './components/FreelancerProfileHeader';
import FreelancerProfileTabs from './components/FreelancerProfileTabs';
import FreelancerProfileLoading from './components/FreelancerProfileLoading';
import FreelancerProfileNotFound from './components/FreelancerProfileNotFound';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import { useLocation } from 'react-router-dom';

const FreelancerProfileView: React.FC = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const { profile, isLoading } = useFreelancerProfileData(freelancerId);
  const location = useLocation();
  
  // Check if the user came from a project applications page
  const fromProjectApplications = location.state?.from === 'projectApplications';
  // Get projectId from state if it exists
  const projectId = location.state?.projectId;
  
  // Determine the back button destination
  const backDestination = fromProjectApplications && projectId 
    ? `/project/${projectId}/applications`
    : undefined; // Will default to history.back() in the BackButton component

  if (isLoading) {
    return <FreelancerProfileLoading />;
  }

  if (!profile) {
    return <FreelancerProfileNotFound />;
  }

  return (
    <MainLayout>
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <div className="mb-4">
          <BackButton 
            to={backDestination}
            label="Back to Applications" 
          />
        </div>
        <FreelancerProfileHeader profile={profile} />
        <FreelancerProfileTabs profile={profile} />
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileView;
