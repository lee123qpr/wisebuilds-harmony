
export interface Verification {
  id: string;
  user_id: string;
  document_path: string | null;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  verification_status?: string; // For backward compatibility
  submitted_at: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  document_name: string | null;
  document_type: string | null;
  document_size: number | null;
  user_email?: string;
  user_full_name?: string;
  created_at?: string;
  id_document_path?: string; // For backward compatibility
}
