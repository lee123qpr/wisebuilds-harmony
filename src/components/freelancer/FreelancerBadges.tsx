
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, Shield } from 'lucide-react';
import { format } from 'date-fns';
import VerificationBadge from '@/components/common/VerificationBadge';

interface InsuranceStatus {
  hasInsurance: boolean;
  coverLevel: string;
}

interface FreelancerBadgesProps {
  memberSince?: string | null;
  emailVerified?: boolean;
  jobsCompleted?: number;
  insuranceStatus?: InsuranceStatus;
}

const FreelancerBadges: React.FC<FreelancerBadgesProps> = ({
  memberSince,
  emailVerified,
  jobsCompleted = 0,
  insuranceStatus
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
      {memberSince && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Member since {format(new Date(memberSince), 'MMM yyyy')}
        </Badge>
      )}
      
      {emailVerified && (
        <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Email verified
        </Badge>
      )}
      
      <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
        <Check className="h-3 w-3" />
        {jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed
      </Badge>
      
      {/* Insurance Badge */}
      {insuranceStatus && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${
            insuranceStatus.hasInsurance 
              ? 'bg-green-50 text-green-700' 
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          <Shield className={`h-3 w-3 ${
            insuranceStatus.hasInsurance 
              ? 'text-green-600' 
              : 'text-amber-600'
          }`} />
          {insuranceStatus.hasInsurance ? (
            <>
              Insured
              {insuranceStatus.coverLevel !== 'Not specified' && 
                <span>• {insuranceStatus.coverLevel}</span>
              }
            </>
          ) : (
            <span>Not Insured</span>
          )}
        </Badge>
      )}
    </div>
  );
};

export default FreelancerBadges;
