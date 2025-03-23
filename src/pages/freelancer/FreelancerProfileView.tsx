
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useFreelancerProfileData } from '@/hooks/freelancer/useFreelancerProfileData';
import FreelancerProfileHeader from './components/FreelancerProfileHeader';
import FreelancerProfileTabs from './components/FreelancerProfileTabs';
import FreelancerProfileLoading from './components/FreelancerProfileLoading';
import FreelancerProfileNotFound from './components/FreelancerProfileNotFound';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';

interface FreelancerProfileViewProps {
  freelancerId?: string;
}

const FreelancerProfileView: React.FC<FreelancerProfileViewProps> = ({ freelancerId: propFreelancerId }) => {
  const { freelancerId: paramFreelancerId } = useParams<{ freelancerId: string }>();
  const effectiveFreelancerId = propFreelancerId || paramFreelancerId;
  
  const { profileData, isLoading } = useFreelancerProfileData(effectiveFreelancerId);
  const location = useLocation();
  
  // Check if the user came from a project applications page
  const fromProjectApplications = location.state?.from === 'projectApplications';
  // Get projectId from state if it exists
  const projectId = location.state?.projectId;
  
  // Determine the back button destination
  const backDestination = fromProjectApplications && projectId 
    ? `/project/${projectId}/applications`
    : undefined; // Will default to history.back() in the BackButton component

  // Don't show layout elements if being rendered in a test environment
  const isTestEnvironment = !!propFreelancerId;

  if (isLoading) {
    return <FreelancerProfileLoading />;
  }

  if (!profileData) {
    return <FreelancerProfileNotFound />;
  }

  const content = (
    <>
      {!isTestEnvironment && (
        <div className="mb-4">
          <BackButton 
            to={backDestination}
            label="Back to Applications" 
          />
        </div>
      )}
      <FreelancerProfileHeader profile={profileData} />
      <FreelancerProfileTabs profile={profileData} />
    </>
  );

  if (isTestEnvironment) {
    return <div className="max-w-5xl mx-auto">{content}</div>;
  }

  return (
    <MainLayout>
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {content}
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileView;
