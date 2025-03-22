
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Sets up a real-time listener for quotes updates for a specific user
 */
export const setupRealtimeListener = (
  userId: string,
  refetchCallback: () => void
) => {
  console.log('Setting up real-time listener for quotes table with userId:', userId);
  
  // Create a channel for real-time updates
  const channel = supabase
    .channel(`quotes-changes-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'quotes',
        filter: `client_id=eq.${userId}`, // Filter by client_id for client dashboard
      },
      (payload) => {
        console.log('Real-time quote update received:', payload);
        // Force refetch the data when quotes change
        refetchCallback();
        
        // Show toast notification for new quote
        if (payload.eventType === 'INSERT') {
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
            if (newStatus === 'accepted') {
              toast({
                title: 'Quote accepted',
                description: 'The quote has been successfully accepted.',
                variant: "success"
              });
            } else if (newStatus === 'declined') {
              toast({
                title: 'Quote declined',
                description: 'The quote has been declined.',
                variant: "default"
              });
            }
          }
        }
      }
    )
    .subscribe((status) => {
      console.log('Realtime subscription status for quotes:', status);
    });

  return channel;
};

/**
 * Sets up a real-time listener for quotes updates for a specific project
 */
export const setupProjectQuotesListener = (
  projectId: string,
  userId: string,
  refetchCallback: () => void
) => {
  console.log('Setting up real-time listener for project quotes with projectId:', projectId);
  
  // Create a channel for real-time updates
  const channel = supabase
    .channel(`project-quotes-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'quotes',
        filter: `project_id=eq.${projectId}`, // Filter by project_id
      },
      (payload) => {
        console.log('Real-time project quote update received:', payload);
        // Force refetch the data when quotes change
        refetchCallback();
      }
    )
    .subscribe();

  return channel;
};

/**
 * Sets up a real-time listener for freelancer's quotes
 */
export const setupFreelancerQuotesListener = (
  freelancerId: string,
  refetchCallback: () => void
) => {
  console.log('Setting up real-time listener for freelancer quotes with freelancerId:', freelancerId);
  
  // Create a channel for real-time updates
  const channel = supabase
    .channel(`freelancer-quotes-${freelancerId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'quotes',
        filter: `freelancer_id=eq.${freelancerId}`, // Filter by freelancer_id
      },
      (payload) => {
        console.log('Real-time freelancer quote update received:', payload);
        
        // Force refetch the data when quotes change
        refetchCallback();
        
        // Show toast notification when a quote is accepted
        if (payload.eventType === 'UPDATE' && payload.new?.status === 'accepted') {
          toast({
            title: 'Quote accepted!',
            description: 'A client has accepted your quote.',
            variant: "success"
          });
        }
      }
    )
    .subscribe();

  return channel;
};
