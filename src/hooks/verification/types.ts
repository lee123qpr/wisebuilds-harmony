
import { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export interface VerificationData {
  id: string;
  user_id: string;
  document_path: string | null;
  document_name: string | null;
  document_type: string | null;
  document_size: number | null;
  status: VerificationStatus;
  admin_notes: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export interface UseVerificationResult {
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationData: VerificationData | null;
  isLoading: boolean;
  error: Error | null;
  refreshVerificationStatus: () => Promise<void>;
}
