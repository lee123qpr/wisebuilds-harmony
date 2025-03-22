
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationsContext';

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
          toast({
            title: 'New quote received!',
            description: 'A freelancer has submitted a new quote for your project.',
            variant: "success"
          });
        }
        
        // Show toast notification for quote updates
        if (payload.eventType === 'UPDATE') {
          const oldStatus = payload.old?.status;
          const newStatus = payload.new?.status;
          
          if (oldStatus !== newStatus) {
            if (newStatus === 'accepted' && !forClient) {
              toast({
                title: 'Quote accepted!',
                description: 'A client has accepted your quote.',
                variant: "success"
              });
            } else if (newStatus === 'rejected' && !forClient) {
              toast({
                title: 'Quote rejected',
                description: 'A client has declined your quote.',
                variant: "destructive"
              });
            }
          }
        }
      }
    )
    .subscribe((status) => {
      console.log('Realtime subscription status:', status);
    });

  return channel;
};

/**
 * Sets up a real-time listener for messages
 */
export const setupMessagesRealtimeListener = (
  conversationId: string, 
  userId: string | undefined,
  refetchCallback: () => void
) => {
  if (!userId || !conversationId) return null;

  console.log('Setting up real-time listener for messages with conversationId:', conversationId);
  
  // Create a channel for real-time updates
  const channel = supabase
    .channel(`messages-changes-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId} AND sender_id=neq.${userId}`,
      },
      (payload) => {
        console.log('Real-time message received:', payload);
        // Force refetch the data when new messages come in
        refetchCallback();
        // Show toast notification for new message
        toast({
          title: 'New message',
          description: 'You have received a new message.',
          variant: "default"
        });
      }
    )
    .subscribe();

  return channel;
};

/**
 * Removes a real-time listener
 */
export const removeRealtimeListener = (channel: any) => {
  if (channel) {
    console.log('Removing real-time listener');
    supabase.removeChannel(channel);
  }
};
