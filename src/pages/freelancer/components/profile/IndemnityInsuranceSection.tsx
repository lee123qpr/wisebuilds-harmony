
import React from 'react';
import { FreelancerProfile } from '@/types/applications';

interface IndemnityInsuranceSectionProps {
  profile: FreelancerProfile;
}

const IndemnityInsuranceSection: React.FC<IndemnityInsuranceSectionProps> = ({ profile }) => {
  if (!profile.indemnity_insurance) {
    return null;
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <h3 className="text-md font-medium mb-3">Professional Indemnity Insurance</h3>
      <p className="text-sm">
        {profile.indemnity_insurance.hasInsurance 
          ? `Insured - Coverage: ${profile.indemnity_insurance.coverLevel || 'Not specified'}`
          : 'Not insured'}
      </p>
    </div>
  );
};

export default IndemnityInsuranceSection;
