
import { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export interface VerificationData {
  id: string;
  user_id: string;
  document_path: string | null;
  document_name: string | null;
  document_size: number | null;
  document_type: string | null;
  status: VerificationStatus;
  submitted_at: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at?: string;
  updated_at?: string | null;
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
  uploadVerificationDocument: (file: File) => Promise<string | boolean>;
  deleteVerificationDocument: () => Promise<boolean>;
  refreshVerificationStatus: () => Promise<void>;
  setVerificationState: (setter: (prev: {
    verificationData: VerificationData | null;
    isLoading: boolean;
    isUploading: boolean;
    isDeleting: boolean;
    isSetupComplete: boolean;
    error: Error | null;
  }) => {
    verificationData: VerificationData | null;
    isLoading: boolean;
    isUploading: boolean;
    isDeleting: boolean;
    isSetupComplete: boolean;
    error: Error | null;
  }) => void;
}

export interface VerificationSetupResult {
  success: boolean;
  message: string;
}

export interface DocumentUploadResult {
  success: boolean;
  filePath?: string;
  message?: string;
  error?: Error;
  verificationData?: VerificationData;
}

export interface DocumentDeletionResult {
  success: boolean;
  message?: string;
  error?: Error;
}
