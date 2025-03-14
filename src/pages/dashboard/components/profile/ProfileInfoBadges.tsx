
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase, CheckCircle2 } from 'lucide-react';

interface ProfileInfoBadgesProps {
  emailVerified: boolean;
  memberSince: string;
  formattedMemberSince: string;
  jobsCompleted: number;
}

const ProfileInfoBadges: React.FC<ProfileInfoBadgesProps> = ({
  emailVerified,
  formattedMemberSince,
  jobsCompleted
}) => {
  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-2">
        {emailVerified ? (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
            Verification Pending
          </Badge>
        )}
      </div>

      <div className="w-full space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Member since {formattedMemberSince}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed</span>
        </div>
      </div>
    </>
  );
};

export default ProfileInfoBadges;
