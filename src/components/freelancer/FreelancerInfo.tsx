
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VerificationBadge from '@/components/common/VerificationBadge';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import { Link } from 'react-router-dom';

interface FreelancerInfoProps {
  freelancerId: string;
  freelancerName: string;
  profilePhoto?: string | null;
  jobTitle?: string | null;
  isVerified?: boolean;
  isLoading?: boolean;
  rating?: number | null;
  reviewsCount?: number;
  showRating?: boolean;
  compact?: boolean;
  linkToProfile?: boolean;
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
  compact = false,
  linkToProfile = true
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  const nameElement = linkToProfile ? (
    <Link 
      to={`/freelancer/${freelancerId}`} 
      className="font-medium hover:underline"
    >
      {freelancerName}
    </Link>
  ) : (
    <span className="font-medium">{freelancerName}</span>
  );

  return (
    <div className="flex items-center gap-3">
      <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
        <AvatarImage src={profilePhoto || undefined} alt={freelancerName} />
        <AvatarFallback>{getInitials(freelancerName)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          {nameElement}
          {isVerified && (
            <VerificationBadge
              type="none"
              status="verified"
              showTooltip={false}
              className="h-3.5 w-3.5 ml-1"
            />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {jobTitle}
          </span>
          
          {showRating && (
            <ProfileRatingStars
              userId={freelancerId}
              rating={rating}
              reviewsCount={reviewsCount}
              showEmpty={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerInfo;
