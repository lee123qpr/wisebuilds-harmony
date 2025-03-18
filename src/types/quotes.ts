
export interface Quote {
  id: string;
  project_id: string;
  freelancer_id: string;
  client_id: string;
  fixed_price?: string;
  estimated_price?: string;
  day_rate?: string;
  description?: string;
  available_start_date?: string;
  estimated_duration?: string;
  duration_unit?: 'days' | 'weeks' | 'months';
  preferred_payment_method?: string;
  payment_terms?: string;
  quote_files?: any[];
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface QuoteWithProject extends Quote {
  project?: {
    title: string;
    budget: string;
    status: string;
  };
}

export interface QuoteWithFreelancer extends Quote {
  freelancer_profile?: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    profile_photo?: string;
    job_title?: string;
    rating?: number;
    verified?: boolean;
  };
}
