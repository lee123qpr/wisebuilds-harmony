
import React from 'react';
import { useVerification } from '@/hooks/verification';
import VerificationBadge, { VerificationStatus as CommonVerificationStatus } from '@/components/common/VerificationBadge';

interface VerificationBadgesSectionProps {
  emailVerified: boolean;
  idVerified: boolean;
}

const VerificationBadgesSection: React.FC<VerificationBadgesSectionProps> = ({
  emailVerified,
  idVerified
}) => {
  const { verificationStatus } = useVerification();
  
  // Convert the verificationStatus to the expected type
  const mappedVerificationStatus: CommonVerificationStatus = 
    verificationStatus === 'verified' ? 'verified' :
    verificationStatus === 'pending' ? 'pending' :
    verificationStatus === 'rejected' ? 'rejected' : 
    'not_submitted';

  return (
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
    </div>
  );
};

export default VerificationBadgesSection;
