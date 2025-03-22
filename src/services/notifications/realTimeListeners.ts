
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { NotificationType } from './types';

export interface ListenersOptions {
  userId: string;
  onNewNotification: (notification: any) => void;
  onNotificationUpdate: (notification: any) => void;
  onNewMessage: (message: any) => void;
  onQuoteUpdate: (quote: any) => void;
  onNewProject: (project: any) => void;
  onCreditBalanceUpdate: (update: any) => void;
  onCreditTransaction: (transaction: any) => void;
}

// Create a notification listener for new and updated notifications
export const createNotificationsListener = (
  userId: string,
  onNewNotification: (notification: any) => void,
  onNotificationUpdate: (notification: any) => void
): RealtimeChannel => {
  console.log('Setting up notifications listener for user:', userId);
  return supabase
    .channel('public:notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('New notification received:', payload.new);
        onNewNotification(payload.new);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Notification updated:', payload.new);
        onNotificationUpdate(payload.new);
      }
    )
    .subscribe();
};

// Process new message and create a notification
export const handleNewMessage = async (message: any, addNotification: (notification: any) => void) => {
  console.log('Processing message for notification:', message);
  try {
    // Get conversation details to determine who sent the message
    const { data: conversationData, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', message.conversation_id)
      .single();
    
    if (convError || !conversationData) {
      console.error('Error fetching conversation data:', convError);
      return;
    }
    
    let senderName = 'Someone';
    
    // If the sender is the client, get client info
    if (conversationData.client_id === message.sender_id) {
      const { data: clientData } = await supabase
        .from('client_profiles')
        .select('company_name, contact_name')
        .eq('id', message.sender_id)
        .maybeSingle();
        
      if (clientData) {
        senderName = clientData.company_name || clientData.contact_name || 'A client';
      } else {
        // Try to get from auth via edge function
        try {
          const { data: userData } = await supabase.functions.invoke(
            'get-user-email',
            { body: { userId: message.sender_id } }
          );
          
          if (userData) {
            senderName = userData.full_name || userData.email?.split('@')[0] || 'A client';
          }
        } catch (err) {
          console.error('Error fetching user data from edge function:', err);
        }
      }
    } 
    // If the sender is the freelancer, get freelancer info
    else if (conversationData.freelancer_id === message.sender_id) {
      const { data: freelancerData } = await supabase
        .from('freelancer_profiles')
        .select('display_name, first_name, last_name')
        .eq('id', message.sender_id)
        .maybeSingle();
        
      if (freelancerData) {
        senderName = freelancerData.display_name || 
                    `${freelancerData.first_name || ''} ${freelancerData.last_name || ''}`.trim() || 
                    'A freelancer';
      }
    }
    
    console.log('Creating notification for message from:', senderName);
    
    const notification = {
      type: 'message' as NotificationType,
      title: `New Message from ${senderName}`,
      description: message.message?.substring(0, 50) || 'You have received a new message',
      data: {
        conversation_id: message.conversation_id,
        message: message.message,
        sender_id: message.sender_id
      }
    };
    
    console.log('Adding notification:', notification);
    addNotification(notification);
  } catch (error) {
    console.error('Error processing message notification:', error);
  }
};

// Setup all real-time listeners
export const setupRealTimeListeners = (options: ListenersOptions): RealtimeChannel[] => {
  const { 
    userId, 
    onNewNotification, 
    onNotificationUpdate, 
    onNewMessage,
    onQuoteUpdate,
    onNewProject,
    onCreditBalanceUpdate,
    onCreditTransaction
  } = options;
  
  console.log('Setting up all real-time listeners for user:', userId);
  
  const channels: RealtimeChannel[] = [];

  // 1. Listen for new notifications
  const notificationsChannel = createNotificationsListener(
    userId,
    onNewNotification,
    onNotificationUpdate
  );
  
  channels.push(notificationsChannel);

  // 2. Listen for new messages
  const messagesChannel = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=neq.${userId}`
      },
      (payload) => {
        console.log('New message received:', payload.new);
        onNewMessage(payload.new);
      }
    )
    .subscribe();
  
  channels.push(messagesChannel);

  // 3. Listen for quote status changes (hired notifications)
  const quotesChannel = supabase
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
  
  channels.push(quotesChannel);

  // 4. Listen for new projects matching freelancer lead settings
  const projectsChannel = supabase
    .channel('public:projects')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'projects',
      },
      (payload) => {
        console.log('New project received:', payload.new);
        onNewProject(payload.new);
      }
    )
    .subscribe();
  
  channels.push(projectsChannel);

  // 5. Listen for credit balance updates
  const creditsChannel = supabase
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
  
  channels.push(creditsChannel);

  // 6. Listen for credit transactions
  const transactionsChannel = supabase
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
  
  channels.push(transactionsChannel);

  // Return all channels for cleanup
  return channels;
};
