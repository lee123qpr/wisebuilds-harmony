
export interface Verification {
  id: string;
  user_id: string;
  id_document_path: string;
  verification_status: string;
  submitted_at: string;
  created_at: string;
  admin_notes: string | null;
  user_email?: string;
  user_full_name?: string;
  verified_at?: string | null;
  verified_by?: string | null;
}
