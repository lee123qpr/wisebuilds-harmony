
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase } from 'lucide-react';
import { useClientReviews } from '../../hooks/useClientReviews';
import { useVerification } from '@/hooks/verification';
import VerificationBadge from '@/components/common/VerificationBadge';
import RatingStars from '@/components/common/RatingStars';
import { VerificationStatus as CommonVerificationStatus } from '@/components/common/VerificationBadge';

interface ProfileInfoBadgesProps {
  emailVerified: boolean;
  memberSince: string;
  formattedMemberSince: string;
  jobsCompleted: number;
  userId: string;
  idVerified: boolean;
}

const ProfileInfoBadges: React.FC<ProfileInfoBadgesProps> = ({
  emailVerified,
  formattedMemberSince,
  jobsCompleted,
  userId,
  idVerified
}) => {
  const { averageRating, reviewCount } = useClientReviews(userId);
  const { verificationStatus } = useVerification();
  
  console.log('ProfileInfoBadges - Rating Data:', { averageRating, reviewCount, userId });

  // Convert the verificationStatus to the expected type
  const mappedVerificationStatus: CommonVerificationStatus = 
    verificationStatus === 'verified' ? 'verified' :
    verificationStatus === 'pending' ? 'pending' :
    verificationStatus === 'rejected' ? 'rejected' : 
    'not_submitted';

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <VerificationBadge 
          type="email" 
          status={emailVerified ? 'verified' : 'pending'} 
        />
        
        <VerificationBadge 
          type="id" 
          status={mappedVerificationStatus} 
        />
        
        {idVerified && (
          <VerificationBadge 
            type="id" 
            status="verified" 
          />
        )}
        
        {averageRating !== null && (
          <div className="ml-auto">
            <RatingStars rating={averageRating} reviewCount={reviewCount} size="sm" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Member since {formattedMemberSince}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoBadges;
