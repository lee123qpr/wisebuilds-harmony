
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

// Converts database string status to our VerificationStatus type
export const mapStatusToVerificationStatus = (status: string): VerificationStatus => {
  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status;
  }
  return 'not_submitted';
};
