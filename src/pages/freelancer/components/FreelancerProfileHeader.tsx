
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import FreelancerProfileCard from '@/components/freelancer/FreelancerProfileCard';

interface FreelancerProfileHeaderProps {
  profile: FreelancerProfile;
}

const FreelancerProfileHeader: React.FC<FreelancerProfileHeaderProps> = ({ profile }) => {
  const fullName = profile.display_name || 
    (profile.first_name && profile.last_name ? 
    `${profile.first_name} ${profile.last_name}` : 
    'Freelancer');

  // Determine if insurance exists and get coverage level
  const hasInsurance = typeof profile.indemnity_insurance === 'boolean' 
    ? profile.indemnity_insurance 
    : profile.indemnity_insurance?.hasInsurance;
    
  const coverLevel = typeof profile.indemnity_insurance === 'boolean' 
    ? 'Not specified' 
    : profile.indemnity_insurance?.coverLevel || 'Not specified';

  return (
    <FreelancerProfileCard
      profileImage={profile.profile_photo}
      fullName={fullName}
      profession={profile.job_title}
      userId={profile.id}
      memberSince={profile.member_since}
      emailVerified={profile.email_verified}
      jobsCompleted={profile.jobs_completed}
      idVerified={profile.verified}
      rating={profile.rating}
      reviewsCount={profile.reviews_count}
      location={profile.location}
      allowImageUpload={false}
      hourlyRate={profile.hourly_rate}
      insuranceStatus={profile.indemnity_insurance ? {
        hasInsurance: hasInsurance,
        coverLevel: coverLevel
      } : undefined}
    />
  );
};

export default FreelancerProfileHeader;
