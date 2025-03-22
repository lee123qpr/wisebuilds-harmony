
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Sets up a real-time listener for quotes updates specifically for the useQuotes hook
 */
export const setupRealtimeListener = (userId: string, refetchCallback: () => void): RealtimeChannel => {
  console.log("Setting up realtime listener for user:", userId);
  
  // Create a channel for quotes table updates that affect this user
  const channel = supabase
    .channel(`quotes-changes-for-user-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'quotes',
        filter: `client_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Realtime quote update received in useQuotes hook:', payload);
        // Force refetch quotes when there's a change
        refetchCallback();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quotes',
        filter: `freelancer_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Realtime freelancer quote update received:', payload);
        refetchCallback();
      }
    )
    .subscribe((status) => {
      console.log('Quotes realtime subscription status:', status);
    });

  return channel;
};
