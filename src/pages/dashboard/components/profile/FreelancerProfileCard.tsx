
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
  console.log('Initial profile image:', initialProfileImage);
  
  // Use our custom hook for image upload properly configured for RLS policies
  const {
    imageUrl,
    uploadingImage,
    imageKey,
    handleImageUpload,
    setImageUrl,
    setUploadingImage
  } = useImageUpload({
    userId,
    folder: '', // This parameter is no longer used but kept for backward compatibility
    namePrefix: fullName && fullName.trim() 
      ? fullName.replace(/\s+/g, '-').toLowerCase() 
      : 'freelancer'
  });

  // Sync with parent state when our local state changes
  React.useEffect(() => {
    if (imageUrl) {
      console.log('Syncing image URL to parent:', imageUrl);
      setParentProfileImage(imageUrl);
    }
  }, [imageUrl, setParentProfileImage]);

  React.useEffect(() => {
    setParentUploadingImage(uploadingImage);
  }, [uploadingImage, setParentUploadingImage]);

  // Initialize our local state with the props
  React.useEffect(() => {
    if (initialProfileImage && !imageUrl) {
      console.log('Initializing local image state with:', initialProfileImage);
      setImageUrl(initialProfileImage);
    }
  }, [initialProfileImage, imageUrl, setImageUrl]);

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

  const handleImageUploadProxy = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image upload triggered with file:', e.target.files?.[0]?.name);
    handleImageUpload(e);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-row items-center gap-4">
          <FreelancerAvatar
            profileImageUrl={imageUrl}
            uploadingImage={uploadingImage}
            imageKey={imageKey}
            initials={getInitials()}
            handleImageUpload={handleImageUploadProxy}
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
