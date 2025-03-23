
import React from 'react';
import FreelancerAvatar from './FreelancerAvatar';
import FreelancerInfo from './FreelancerInfo';
import FreelancerBadges from './FreelancerBadges';
import FreelancerMetadata from './FreelancerMetadata';
import FreelancerRateDisplay from './FreelancerRateDisplay';

interface InsuranceStatus {
  hasInsurance: boolean;
  coverLevel: string | undefined;
}

interface FreelancerProfileCardProps {
  profileImage: string | null;
  fullName: string;
  profession: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
  idVerified: boolean;
  rating?: number | null;
  reviewsCount?: number;
  location?: string | null;
  hourlyRate?: string | null;
  allowImageUpload?: boolean;
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  insuranceStatus?: {
    hasInsurance: boolean;
    coverLevel?: string;
  };
  previousWork?: string[] | {
    name: string;
    url: string;
    type: string;
    size: number;
    path: string;
  }[];
  compact?: boolean;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified,
  jobsCompleted,
  idVerified,
  rating,
  reviewsCount,
  location,
  hourlyRate,
  allowImageUpload = false,
  uploadingImage = false,
  setUploadingImage,
  setProfileImage,
  insuranceStatus,
  previousWork,
  compact = false
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border/40">
      <div className="md:flex">
        <div className="md:w-1/3 p-6">
          <FreelancerAvatar
            profileImage={profileImage}
            fullName={fullName}
            allowImageUpload={allowImageUpload}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setProfileImage={setProfileImage}
            userId={userId}
          />
        </div>
        
        <div className="md:w-2/3 p-6 border-t md:border-t-0 md:border-l border-border">
          <FreelancerInfo
            freelancerId={userId}
            freelancerName={fullName}
            profilePhoto={profileImage}
            jobTitle={profession}
            isVerified={idVerified}
            rating={rating}
            reviewsCount={reviewsCount}
            compact={compact}
          />
          
          <div className="mt-4">
            <FreelancerBadges
              jobsCompleted={jobsCompleted}
              emailVerified={emailVerified}
              idVerified={idVerified}
              insuranceStatus={insuranceStatus}
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <FreelancerMetadata
              profile={{
                member_since: memberSince,
                jobs_completed: jobsCompleted,
                location: location,
                rating: rating,
                reviews_count: reviewsCount
              }}
              compact={compact}
            />
            
            {hourlyRate && (
              <FreelancerRateDisplay hourlyRate={hourlyRate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileCard;
