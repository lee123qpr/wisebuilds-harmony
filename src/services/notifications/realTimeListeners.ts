
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { NotificationType } from './types';
import { ListenersOptions } from './interfaces';
import { 
  createNotificationsListener, 
  createMessagesListener,
  createQuoteListener,
  createProjectListener,
  createCreditBalanceListener,
  createCreditTransactionListener
} from './listeners';
import { handleNewMessage } from './handlers';

// Re-export the message handler function for direct use
export { handleNewMessage } from './handlers';

// Re-export the notifications listener for direct use
export { createNotificationsListener } from './listeners';

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
  const messagesChannel = createMessagesListener(userId, onNewMessage);
  channels.push(messagesChannel);

  // 3. Listen for quote status changes (hired notifications)
  const quotesChannel = createQuoteListener(userId, onQuoteUpdate);
  channels.push(quotesChannel);

  // 4. Listen for new projects matching freelancer lead settings
  const projectsChannel = createProjectListener(userId, onNewProject);
  channels.push(projectsChannel);

  // 5. Listen for credit balance updates
  const creditsChannel = createCreditBalanceListener(userId, onCreditBalanceUpdate);
  channels.push(creditsChannel);

  // 6. Listen for credit transactions
  const transactionsChannel = createCreditTransactionListener(userId, onCreditTransaction);
  channels.push(transactionsChannel);

  // Return all channels for cleanup
  return channels;
};
