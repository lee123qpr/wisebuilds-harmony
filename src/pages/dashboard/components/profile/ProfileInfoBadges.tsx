
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase, CheckCircle2, Award } from 'lucide-react';
import { useClientReviews } from '../../hooks/useClientReviews';
import { useVerification } from '@/hooks/verification';
import VerificationBadge from '@/components/dashboard/freelancer/VerificationBadge';
import RatingStars from './RatingStars';

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

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {emailVerified ? (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Email Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
            Email Verification Pending
          </Badge>
        )}
        
        <VerificationBadge status={verificationStatus} />
        
        {idVerified && (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
            <Award className="h-3 w-3" />
            ID Verified
          </Badge>
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
