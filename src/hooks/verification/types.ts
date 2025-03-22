
import { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export interface VerificationData {
  id: string;
  user_id: string;
  document_path?: string | null;
  document_name?: string | null;
  document_size?: number | null;
  document_type?: string | null;
  status: string;
  admin_notes?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UseVerificationResult {
  verificationData: VerificationData | null;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  isLoading: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  setupComplete: boolean;
  error: Error | null;
  uploadVerificationDocument: (file: File) => Promise<string | boolean | null>;
  deleteVerificationDocument: () => Promise<boolean>;
  refreshVerificationStatus: () => Promise<void>;
}
