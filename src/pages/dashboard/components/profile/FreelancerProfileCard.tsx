
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useProfileImageHandling } from '../../hooks/useProfileImageHandling';
import BucketStatusAlerts from './BucketStatusAlerts';
import ProfileHeaderContent from './ProfileHeaderContent';

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
    handleImageUploadProxy,
    bucketAvailable,
    actualBucketName,
    availableBuckets
  } = useProfileImageHandling({
    userId,
    initialProfileImage,
    setParentProfileImage,
    setParentUploadingImage
  });

  const formattedMemberSince = memberSince 
    ? format(new Date(memberSince), 'MMMM yyyy')
    : 'Recently joined';

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <BucketStatusAlerts 
          bucketAvailable={bucketAvailable}
          actualBucketName={actualBucketName}
          availableBuckets={availableBuckets}
        />
        
        <ProfileHeaderContent
          imageUrl={imageUrl}
          uploadingImage={uploadingImage}
          imageKey={imageKey}
          fullName={fullName}
          profession={profession}
          handleImageUploadProxy={handleImageUploadProxy}
          emailVerified={emailVerified}
          memberSince={memberSince}
          formattedMemberSince={formattedMemberSince}
          jobsCompleted={jobsCompleted}
          userId={userId}
          idVerified={idVerified}
        />
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileCard;
