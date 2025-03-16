
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export interface VerificationData {
  id: string;
  user_id: string;
  verification_status: VerificationStatus;
  id_document_path: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  admin_notes: string | null;
}

export interface VerificationResult {
  success: boolean;
  filePath?: string;
  verificationData?: VerificationData;
  error?: any;
  errorMessage?: string;
}

export interface UseVerificationResult {
  verificationData: VerificationData | null;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  isLoading: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  uploadVerificationDocument: (file: File) => Promise<VerificationResult>;
  deleteVerificationDocument: () => Promise<boolean>;
  refreshVerificationStatus: () => Promise<VerificationData | null>;
}
