
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets up a real-time listener for quotes updates
 */
export const setupQuotesRealtimeListener = (
  projectId: string, 
  userId: string | undefined, 
  forClient: boolean,
  refetchCallback: () => void
) => {
  if (!userId || !projectId) return null;

  console.log('Setting up real-time listener for quotes table with projectId:', projectId);
  
  // Create a channel for real-time updates
  const channel = supabase
    .channel(`quotes-changes-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'quotes',
        filter: projectId ? `project_id=eq.${projectId}` : undefined,
      },
      (payload) => {
        console.log('Real-time quote update received:', payload);
        // Force refetch the data when quotes change
        refetchCallback();
        // Show toast notification for new quote
        if (payload.eventType === 'INSERT' && forClient) {
          toast.success('New quote received!', {
            description: 'A freelancer has submitted a new quote for your project.'
          });
        }
      }
    )
    .subscribe((status) => {
      console.log('Realtime subscription status:', status);
    });

  return channel;
};

/**
 * Removes a real-time listener
 */
export const removeRealtimeListener = (channel: any) => {
  if (channel) {
    console.log('Removing real-time listener for quotes');
    supabase.removeChannel(channel);
  }
};
