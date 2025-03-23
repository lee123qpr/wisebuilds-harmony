
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase } from 'lucide-react';
import { useVerification } from '@/hooks/verification';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
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
  const { verificationStatus } = useVerification();
  
  console.log('ProfileInfoBadges - User data:', { userId, emailVerified, jobsCompleted });

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
        
        {userId && (
          <div className="ml-auto">
            <ProfileRatingStars userId={userId} showEmpty={true} />
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
