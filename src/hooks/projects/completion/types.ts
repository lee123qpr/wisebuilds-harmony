
import { User } from '@supabase/supabase-js';

export interface CompletionStatus {
  freelancer_completed: boolean;
  client_completed: boolean;
  completed_at: string | null;
}

export interface ProjectCompletionProps {
  quoteId: string;
  projectId: string;
}

export interface QuoteData {
  freelancer_id: string;
  client_id: string;
  freelancer_completed: boolean;
  client_completed: boolean;
}
