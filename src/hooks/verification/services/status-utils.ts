
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

/**
 * Maps database status to frontend status type
 */
export const mapDatabaseStatusToVerificationStatus = (status: string | null): VerificationStatus => {
  if (!status) return 'not_submitted';
  
  switch (status.toLowerCase()) {
    case 'verified':
    case 'approved':
      return 'verified';
    case 'pending':
      return 'pending';
    case 'rejected':
      return 'rejected';
    default:
      return 'not_submitted';
  }
};
