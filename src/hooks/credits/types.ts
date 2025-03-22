
export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount_percentage: number;
  is_active: boolean;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  credits_purchased: number;
  stripe_payment_id: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at?: string; // Adding this field as optional
}
