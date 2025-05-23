
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useFreelancerProfileData } from '@/hooks/freelancer/useFreelancerProfileData';
import FreelancerProfileHeader from './components/FreelancerProfileHeader';
import FreelancerProfileTabs from './components/FreelancerProfileTabs';
import FreelancerProfileLoading from './components/FreelancerProfileLoading';
import FreelancerProfileNotFound from './components/FreelancerProfileNotFound';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import { FreelancerProfile } from '@/types/applications';

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

  // Convert profile data to the format expected by components
  const adaptedProfileData = profileData as unknown as FreelancerProfile;

  const content = (
    <div className="space-y-6 animate-fade-in">
      {!isTestEnvironment && (
        <div className="mb-2">
          <BackButton 
            to={backDestination}
            label={fromProjectApplications ? "Back to Applications" : "Back"} 
          />
        </div>
      )}
      <FreelancerProfileHeader profile={adaptedProfileData} />
      <FreelancerProfileTabs profile={adaptedProfileData} />
    </div>
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
