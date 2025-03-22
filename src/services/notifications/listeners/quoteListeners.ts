
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Setup a listener for quote updates
export const createQuoteListener = (
  userId: string,
  onQuoteUpdate: (quote: any) => void
): RealtimeChannel => {
  console.log('Setting up quote listener for user:', userId);
  
  return supabase
    .channel('public:quotes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'quotes',
        filter: `freelancer_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Quote update received:', payload);
        onQuoteUpdate(payload);
      }
    )
    .subscribe();
};
