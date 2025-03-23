
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import VerificationBadge from '@/components/common/VerificationBadge';
import { FreelancerInfo } from '@/types/messaging';

interface FreelancerProfileProps {
  freelancerName: string;
  profilePhoto?: string;
  jobTitle: string;
  isVerified: boolean;
  isLoadingFreelancer: boolean;
}

const FreelancerProfile: React.FC<FreelancerProfileProps> = ({
  freelancerName,
  profilePhoto,
  jobTitle,
  isVerified,
  isLoadingFreelancer
}) => {
  if (isLoadingFreelancer) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profilePhoto} alt={freelancerName} />
        <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium flex items-center gap-1">
          {freelancerName}
          {isVerified && 
            <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />
          }
        </h3>
        <p className="text-sm text-muted-foreground">
          {jobTitle}
        </p>
      </div>
    </div>
  );
};

export default FreelancerProfile;
