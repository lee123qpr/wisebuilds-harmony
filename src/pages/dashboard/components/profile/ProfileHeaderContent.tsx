
import React from 'react';
import FreelancerAvatar from './FreelancerAvatar';
import ProfileInfoBadges from './ProfileInfoBadges';

interface ProfileHeaderContentProps {
  imageUrl: string | null;
  uploadingImage: boolean;
  imageKey: string;
  fullName: string;
  profession: string;
  handleImageUploadProxy: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  emailVerified: boolean;
  memberSince: string | null;
  formattedMemberSince: string;
  jobsCompleted: number;
  userId: string;
  idVerified: boolean;
}

const ProfileHeaderContent: React.FC<ProfileHeaderContentProps> = ({
  imageUrl,
  uploadingImage,
  imageKey,
  fullName,
  profession,
  handleImageUploadProxy,
  emailVerified,
  memberSince,
  formattedMemberSince,
  jobsCompleted,
  userId,
  idVerified
}) => {
  const getInitials = () => {
    if (!fullName) return 'FP'; // Default: Freelancer Profile
    
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        <FreelancerAvatar
          profileImageUrl={imageUrl}
          uploadingImage={uploadingImage}
          imageKey={imageKey}
          initials={getInitials()}
          handleImageUpload={handleImageUploadProxy}
          size="xl" // Larger size for top banner
        />
      </div>

      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="mb-2">
          <h2 className="text-2xl font-semibold truncate">{fullName || 'Your Name'}</h2>
          <p className="text-lg text-muted-foreground">{profession || 'Your Profession'}</p>
        </div>

        <ProfileInfoBadges
          emailVerified={emailVerified}
          memberSince={memberSince || ''}
          formattedMemberSince={formattedMemberSince}
          jobsCompleted={jobsCompleted}
          userId={userId}
          idVerified={idVerified}
        />
      </div>
    </div>
  );
};

export default ProfileHeaderContent;
