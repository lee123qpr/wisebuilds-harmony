import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useImageUpload } from '../../hooks/useImageUpload';
import FreelancerAvatar from './FreelancerAvatar';
import ProfileInfoBadges from './ProfileInfoBadges';
import AccountTypeSelector from './AccountTypeSelector';
import { supabase } from '@/integrations/supabase/client';

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

  React.useEffect(() => {
    if (imageUrl) {
      console.log('Syncing image URL to parent:', imageUrl);
      setParentProfileImage(imageUrl);
    }
  }, [imageUrl, setParentProfileImage]);

  React.useEffect(() => {
    setParentUploadingImage(uploadingImage);
  }, [uploadingImage, setParentUploadingImage]);

  React.useEffect(() => {
    if (initialProfileImage && !imageUrl) {
      console.log('Initializing local image state with:', initialProfileImage);
      setImageUrl(initialProfileImage);
    }
  }, [initialProfileImage, imageUrl, setImageUrl]);

  const [userType, setUserType] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const getUserType = async () => {
      const { data } = await supabase.auth.getUser();
      const type = data.user?.user_metadata?.user_type as string || null;
      setUserType(type);
      console.log('Current user type:', type);
    };
    
    getUserType();
  }, [userId]);

  const getInitials = () => {
    if (!fullName) return 'FP'; // Default: Freelancer Profile
    
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
            
            {userType !== 'freelancer' && (
              <div className="mt-4 border-t pt-4">
                <AccountTypeSelector 
                  userId={userId} 
                  currentType={userType || undefined}
                  onTypeUpdated={setUserType}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileCard;
