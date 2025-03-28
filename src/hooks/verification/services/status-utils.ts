
import { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

/**
 * Maps database status field to VerificationStatus type
 */
export const mapDatabaseStatusToVerificationStatus = (status: string): VerificationStatus => {
  switch (status) {
    case 'verified':
      return 'verified';
    case 'pending':
      return 'pending';
    case 'rejected':
      return 'rejected';
    default:
      return 'not_submitted';
  }
};
