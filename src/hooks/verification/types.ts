
export interface VerificationData {
  id: string;
  user_id: string;
  id_document_path: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  admin_notes: string | null;
  verified_at: string | null;
  verified_by: string | null;
}

export interface UseVerificationResult {
  verificationData: VerificationData | null;
  isLoading: boolean;
  error: Error | null;
  submitVerification: (file: File) => Promise<void>;
  status: 'idle' | 'loading' | 'success' | 'error';
  isSubmitting: boolean;
}
