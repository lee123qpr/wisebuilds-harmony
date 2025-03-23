
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Shield, Check, X } from 'lucide-react';

interface IndemnityInsuranceSectionProps {
  profile: FreelancerProfile;
}

const IndemnityInsuranceSection: React.FC<IndemnityInsuranceSectionProps> = ({ profile }) => {
  if (!profile.indemnity_insurance) {
    return null;
  }

  // Determine if insurance exists and get coverage level
  const hasInsurance = typeof profile.indemnity_insurance === 'boolean' 
    ? profile.indemnity_insurance 
    : profile.indemnity_insurance.hasInsurance;
    
  const coverLevel = typeof profile.indemnity_insurance === 'boolean' 
    ? 'Not specified' 
    : profile.indemnity_insurance.coverLevel || 'Not specified';

  return (
    <div className="flex items-center gap-3">
      {hasInsurance ? (
        <>
          <div className="flex h-10 w-10 rounded-full bg-green-100 items-center justify-center flex-shrink-0">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="font-medium">Insured</div>
            <div className="text-sm text-muted-foreground">
              Coverage: <span className="font-medium">{coverLevel}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-10 w-10 rounded-full bg-amber-100 items-center justify-center flex-shrink-0">
            <X className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="font-medium">Not Insured</div>
            <div className="text-sm text-muted-foreground">
              This freelancer does not have professional indemnity insurance
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IndemnityInsuranceSection;
