
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import VerificationBadge from '@/components/common/VerificationBadge';

interface FreelancerInfoProps {
  freelancerName: string;
  profilePhoto?: string;
  jobTitle: string;
  isVerified: boolean;
  isLoadingFreelancer: boolean;
}

const FreelancerInfo: React.FC<FreelancerInfoProps> = ({
  freelancerName,
  profilePhoto,
  jobTitle,
  isVerified,
  isLoadingFreelancer
}) => {
  if (isLoadingFreelancer) {
    return (
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profilePhoto} alt={freelancerName} />
        <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium flex items-center gap-1">
          {freelancerName}
          {isVerified && <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />}
        </p>
        <p className="text-sm text-muted-foreground">{jobTitle}</p>
      </div>
    </div>
  );
};

export default FreelancerInfo;
