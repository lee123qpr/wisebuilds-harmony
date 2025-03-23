
import React from 'react';
import VerificationBadgesSection from './badges/VerificationBadgesSection';
import ProfileMetadataSection from './badges/ProfileMetadataSection';
import ProfileRatingDisplay from './badges/ProfileRatingDisplay';

interface ProfileInfoBadgesProps {
  emailVerified: boolean;
  memberSince: string;
  formattedMemberSince: string;
  jobsCompleted: number;
  userId: string;
  idVerified: boolean;
}

const ProfileInfoBadges: React.FC<ProfileInfoBadgesProps> = ({
  emailVerified,
  formattedMemberSince,
  jobsCompleted,
  userId,
  idVerified
}) => {
  console.log('ProfileInfoBadges - User data:', { userId, emailVerified, jobsCompleted });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <VerificationBadgesSection 
          emailVerified={emailVerified}
          idVerified={idVerified}
        />
        
        <ProfileRatingDisplay userId={userId} />
      </div>

      <ProfileMetadataSection 
        formattedMemberSince={formattedMemberSince}
        jobsCompleted={jobsCompleted}
      />
    </div>
  );
};

export default ProfileInfoBadges;
