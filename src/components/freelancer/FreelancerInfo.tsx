
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';

interface FreelancerInfoProps {
  freelancerId: string;
  freelancerName: string;
  profilePhoto?: string;
  jobTitle?: string;
  isVerified?: boolean;
  isLoading?: boolean;
  rating?: number;
  reviewsCount?: number;
  showRating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const FreelancerInfo: React.FC<FreelancerInfoProps> = ({
  freelancerId,
  freelancerName,
  profilePhoto,
  jobTitle = 'Freelancer',
  isVerified = false,
  isLoading = false,
  rating,
  reviewsCount,
  showRating = true,
  size = 'md'
}) => {
  // Size mappings for consistent avatar sizing
  const avatarSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  // Size mappings for skeleton
  const skeletonSizes = {
    sm: { avatar: 'h-8 w-8', title: 'h-3 w-24', subtitle: 'h-2 w-20' },
    md: { avatar: 'h-10 w-10', title: 'h-4 w-32', subtitle: 'h-3 w-24' },
    lg: { avatar: 'h-12 w-12', title: 'h-5 w-40', subtitle: 'h-3 w-28' }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className={`${skeletonSizes[size].avatar} rounded-full`} />
        <div>
          <Skeleton className={`${skeletonSizes[size].title} mb-1`} />
          <Skeleton className={skeletonSizes[size].subtitle} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Avatar className={avatarSizes[size]}>
          <AvatarImage src={profilePhoto} alt={freelancerName} />
          <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium flex items-center gap-1">
            {freelancerName}
            {isVerified && <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />}
          </div>
          <p className="text-sm text-muted-foreground">{jobTitle}</p>
        </div>
      </div>
      
      {showRating && (
        <div className="mt-1">
          <ProfileRatingStars 
            userId={freelancerId}
            rating={rating}
            reviewsCount={reviewsCount}
            showEmpty={true}
          />
        </div>
      )}
    </div>
  );
};

export default FreelancerInfo;
