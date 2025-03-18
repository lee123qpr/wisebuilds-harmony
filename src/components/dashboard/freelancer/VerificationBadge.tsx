
import React from 'react';
import VerificationBadgeStandard, { VerificationStatus as StandardVerificationStatus } from '@/components/common/VerificationBadge';

// Update to match the standard verification status values
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_submitted';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, className = '' }) => {
  // Map the old status values to the new ones
  const mappedStatus: StandardVerificationStatus = 
    status === 'verified' ? 'verified' :
    status === 'pending' ? 'pending' :
    status === 'rejected' ? 'rejected' : 
    'not_submitted';

  if (status === 'not_submitted') {
    return null;
  }
  
  return (
    <VerificationBadgeStandard 
      type="id" 
      status={mappedStatus}
      className={className}
    />
  );
};

export default VerificationBadge;
