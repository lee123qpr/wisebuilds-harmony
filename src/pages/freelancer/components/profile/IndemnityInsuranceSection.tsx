
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
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <span>Professional Insurance</span>
      </h3>
      
      <div className="bg-muted/50 p-4 rounded-md flex items-center gap-4">
        {hasInsurance ? (
          <>
            <div className="flex h-12 w-12 rounded-full bg-green-100 items-center justify-center flex-shrink-0">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-foreground">Insured</div>
              <div className="text-sm text-muted-foreground">
                Coverage: <span className="font-medium">{coverLevel}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 rounded-full bg-amber-100 items-center justify-center flex-shrink-0">
              <X className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div className="font-medium text-foreground">Not Insured</div>
              <div className="text-sm text-muted-foreground">
                This freelancer does not have professional indemnity insurance
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IndemnityInsuranceSection;
