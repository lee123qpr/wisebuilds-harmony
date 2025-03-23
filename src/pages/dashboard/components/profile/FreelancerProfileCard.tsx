
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useImageUpload } from '../../hooks/useImageUpload';
import FreelancerAvatar from './FreelancerAvatar';
import ProfileInfoBadges from './ProfileInfoBadges';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    setUploadingImage,
    bucketAvailable,
    actualBucketName
  } = useImageUpload({
    userId,
    namePrefix: 'avatar'
  });

  // State to hold available buckets for debugging
  const [availableBuckets, setAvailableBuckets] = React.useState<string[]>([]);

  // Get available buckets on mount
  React.useEffect(() => {
    const getBuckets = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error listing buckets:', error);
          return;
        }
        
        if (data) {
          const bucketNames = data.map(b => b.name);
          console.log('Available buckets:', bucketNames.join(', '));
          setAvailableBuckets(bucketNames);
        }
      } catch (err) {
        console.error('Error in getBuckets:', err);
      }
    };
    
    getBuckets();
  }, []);

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

  const handleImageUploadProxy = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image upload triggered with file:', e.target.files?.[0]?.name);
    
    try {
      // First set local loading state
      setUploadingImage(true);
      
      // Then call the actual upload handler
      const result = await handleImageUpload(e);
      
      if (result) {
        console.log('Upload successful, URL:', result);
      } else {
        console.log('Upload did not return a URL');
      }
    } catch (error) {
      console.error('Error in upload proxy:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {bucketAvailable === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Avatar Upload Unavailable</AlertTitle>
            <AlertDescription>
              The avatar storage service is currently unavailable. Available buckets: {availableBuckets.join(', ')}.
              {actualBucketName && <div>Tried to use bucket: {actualBucketName}</div>}
              Please try again later or contact support.
            </AlertDescription>
          </Alert>
        )}
        
        {bucketAvailable === true && actualBucketName && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Storage Bucket Info</AlertTitle>
            <AlertDescription>
              Using storage bucket: {actualBucketName}
            </AlertDescription>
          </Alert>
        )}
        
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
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileCard;
