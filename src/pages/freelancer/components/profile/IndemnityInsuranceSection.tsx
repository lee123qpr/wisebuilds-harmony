
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { Shield } from 'lucide-react';

interface IndemnityInsuranceSectionProps {
  profile: FreelancerProfile;
}

const IndemnityInsuranceSection: React.FC<IndemnityInsuranceSectionProps> = ({ profile }) => {
  if (!profile.indemnity_insurance) {
    return null;
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <div className="flex items-start gap-2 mb-3">
        <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="space-y-2 w-full">
          <h3 className="text-md font-medium">Professional Indemnity Insurance</h3>
          <div className="text-sm break-words overflow-hidden">
            {profile.indemnity_insurance.hasInsurance ? (
              <span className="text-green-700">
                Insured - Coverage: <span className="font-medium">{profile.indemnity_insurance.coverLevel || 'Not specified'}</span>
              </span>
            ) : (
              <span className="text-amber-700">Not insured</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndemnityInsuranceSection;
