
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Setup listeners for credit balance updates and transactions
export const createCreditBalanceListener = (
  userId: string,
  onCreditBalanceUpdate: (update: any) => void
): RealtimeChannel => {
  console.log('Setting up credit balance listener for user:', userId);
  
  return supabase
    .channel('public:freelancer_credits')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'freelancer_credits',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Credit balance update received:', payload);
        onCreditBalanceUpdate(payload);
      }
    )
    .subscribe();
};

export const createCreditTransactionListener = (
  userId: string,
  onCreditTransaction: (transaction: any) => void
): RealtimeChannel => {
  console.log('Setting up credit transaction listener for user:', userId);
  
  return supabase
    .channel('public:credit_transactions')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'credit_transactions',
        filter: `user_id=eq.${userId} AND status=eq.completed`,
      },
      (payload) => {
        console.log('Credit transaction received:', payload);
        onCreditTransaction(payload);
      }
    )
    .subscribe();
};
