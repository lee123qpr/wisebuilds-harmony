
import React from 'react';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import FreelancerMetadata from '@/components/freelancer/FreelancerMetadata';
import FreelancerAvatar from './FreelancerAvatar';
import FreelancerBadges from './FreelancerBadges';
import FreelancerRateDisplay from './FreelancerRateDisplay';

interface InsuranceStatus {
  hasInsurance: boolean;
  coverLevel: string;
}

interface FreelancerProfileCardProps {
  profileImage: string | null;
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  fullName: string;
  profession: string | null;
  userId: string;
  memberSince?: string | null;
  emailVerified?: boolean;
  jobsCompleted?: number;
  idVerified?: boolean;
  rating?: number | null;
  reviewsCount?: number;
  location?: string | null;
  allowImageUpload?: boolean;
  compact?: boolean;
  insuranceStatus?: InsuranceStatus;
  hourlyRate?: string | null;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage,
  uploadingImage = false,
  setUploadingImage,
  setProfileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified = false,
  jobsCompleted = 0,
  idVerified = false,
  rating,
  reviewsCount,
  location,
  allowImageUpload = false,
  compact = false,
  insuranceStatus,
  hourlyRate
}) => {
  return (
    <div className={`border shadow-md rounded-lg p-6 ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`flex ${compact ? 'flex-row gap-3' : 'flex-col md:flex-row gap-6'} items-center md:items-start`}>
        <FreelancerAvatar
          profileImage={profileImage}
          fullName={fullName}
          userId={userId}
          size={compact ? 'sm' : 'lg'}
          uploadingImage={uploadingImage}
          setUploadingImage={setUploadingImage}
          setProfileImage={setProfileImage}
          allowImageUpload={allowImageUpload}
        />
        
        <div className={`flex-1 ${compact ? '' : 'text-center md:text-left'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold`}>{fullName}</h2>
            {idVerified && <VerificationBadge type="id" status="verified" />}
          </div>
          
          {profession && (
            <p className="text-muted-foreground">{profession}</p>
          )}
          
          {/* Rating stars component */}
          <div className={`${compact ? 'mt-1' : 'mt-2'} flex justify-center md:justify-start`}>
            <ProfileRatingStars 
              userId={userId} 
              rating={rating} 
              reviewsCount={reviewsCount} 
              showEmpty={true} 
            />
          </div>
          
          {/* Hourly Rate Display */}
          {hourlyRate && (
            <div className="mt-2 flex items-center justify-center md:justify-start text-sm">
              <FreelancerRateDisplay hourlyRate={hourlyRate} />
            </div>
          )}
          
          {/* Show freelancer metadata */}
          {!compact && (
            <div className="mt-4">
              <FreelancerMetadata 
                profile={{
                  id: userId,
                  member_since: memberSince,
                  jobs_completed: jobsCompleted,
                  location: location
                }} 
                compact={false}
              />
            </div>
          )}
          
          {/* Only show badges in full mode */}
          {!compact && (
            <FreelancerBadges
              memberSince={memberSince}
              emailVerified={emailVerified}
              jobsCompleted={jobsCompleted}
              insuranceStatus={insuranceStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileCard;
