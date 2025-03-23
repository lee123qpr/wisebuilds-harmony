
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

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
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
      />
    </div>
  );
};

export default FreelancerProfileHeader;
