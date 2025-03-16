
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useImageUpload } from '../../hooks/useImageUpload';
import FreelancerAvatar from './FreelancerAvatar';
import ProfileInfoBadges from './ProfileInfoBadges';

interface FreelancerProfileCardProps {
  profileImage: string | null;
  uploadingImage: boolean;
  setUploadingImage: (value: boolean) => void;
  setProfileImage: (url: string) => void;
  fullName: string;
  profession: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
  idVerified?: boolean;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage: initialProfileImage,
  uploadingImage: initialUploadingImage,
  setUploadingImage: setParentUploadingImage,
  setProfileImage: setParentProfileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified,
  jobsCompleted,
  idVerified = false
}) => {
  console.log('FreelancerProfileCard - Props:', { userId, emailVerified, memberSince, jobsCompleted });
  
  // Use our custom hook for image upload
  const {
    imageUrl: cachedImageUrl,
    uploadingImage,
    imageKey,
    handleImageUpload,
    setImageUrl,
    setUploadingImage
  } = useImageUpload({
    userId,
    folder: 'profiles',
    namePrefix: fullName ? fullName.replace(/\s+/g, '-').toLowerCase() : userId
  });

  // Sync with parent state when our local state changes
  React.useEffect(() => {
    if (cachedImageUrl) {
      setParentProfileImage(cachedImageUrl);
    }
  }, [cachedImageUrl, setParentProfileImage]);

  React.useEffect(() => {
    setParentUploadingImage(uploadingImage);
  }, [uploadingImage, setParentUploadingImage]);

  // Initialize our local state with the props
  React.useEffect(() => {
    if (initialProfileImage && !cachedImageUrl) {
      setImageUrl(initialProfileImage);
    }
  }, [initialProfileImage, cachedImageUrl, setImageUrl]);

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!fullName) return 'FP'; // Default: Freelancer Profile
    
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format the member since date
  const formattedMemberSince = memberSince 
    ? format(new Date(memberSince), 'MMMM yyyy')
    : 'Recently joined';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-row items-center gap-4">
          <FreelancerAvatar
            profileImageUrl={cachedImageUrl}
            uploadingImage={uploadingImage}
            imageKey={imageKey}
            initials={getInitials()}
            handleImageUpload={handleImageUpload}
          />

          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <h2 className="text-xl font-semibold truncate">{fullName || 'Your Name'}</h2>
              <p className="text-sm text-muted-foreground">{profession || 'Your Profession'}</p>
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
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileCard;
