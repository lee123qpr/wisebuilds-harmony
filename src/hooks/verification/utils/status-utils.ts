
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

// Converts database string status to our VerificationStatus type
export const mapStatusToVerificationStatus = (status: string): VerificationStatus => {
  if (status === 'pending') return 'pending';
  if (status === 'approved') return 'verified'; // Map 'approved' to 'verified'
  if (status === 'rejected') return 'rejected';
  return 'not_submitted';
};
