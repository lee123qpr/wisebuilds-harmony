
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export interface VerificationData {
  id: string;
  user_id: string;
  verification_status: VerificationStatus;
  id_document_path: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  admin_notes?: string | null;
}

export interface UseVerificationResult {
  verificationData: VerificationData | null;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  isLoading: boolean;
  isUploading: boolean;
  uploadVerificationDocument: (file: File) => Promise<string | null>;
  refreshVerificationStatus: () => Promise<void>;
}
