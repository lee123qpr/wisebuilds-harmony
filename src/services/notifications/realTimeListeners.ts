
import { supabase } from '@/integrations/supabase/client';
import { setupNotificationChannel } from './listeners/notificationListeners';
import { createMessagesListener } from './listeners/messageListeners'; 
import { createCreditBalanceListener, createCreditTransactionListener } from './listeners/creditListeners';
import { RealtimeChannel } from '@supabase/supabase-js';

// Map to track active channels by user ID to prevent duplicate subscriptions
const activeChannels = new Map<string, RealtimeChannel[]>();

// Track the last setup time to prevent rapid re-subscriptions
const lastSetupTime = new Map<string, number>();

// Time window to prevent duplicate setups (in milliseconds)
const SETUP_COOLDOWN = 5000; 

/**
 * Set up all real-time listeners for a user, including notifications and credit updates
 */
export const setupListeners = (
  userId: string, 
  onNotification: (payload: any) => void,
  onCreditUpdate?: (payload: any) => void,
  onCreditTransaction?: (payload: any) => void,
  onNewMessage?: (message: any) => void
) => {
  if (!userId) {
    console.warn('Cannot set up listeners: No user ID provided');
    return () => {};
  }
  
  // Prevent setting up listeners too frequently for the same user
  const now = Date.now();
  const lastSetup = lastSetupTime.get(userId) || 0;
  
  if (now - lastSetup < SETUP_COOLDOWN) {
    console.log(`Listener setup for user ${userId} was called recently, reusing existing channels`);
    // Return the cleanup function for existing channels
    return () => cleanupChannels(userId);
  }
  
  lastSetupTime.set(userId, now);
  
  // Clean up any existing channels for this user to prevent duplicates
  cleanupChannels(userId);
  
  // Set up new channels with error handling
  const channels: RealtimeChannel[] = [];
  
  try {
    // Notification channel
    const notificationChannel = setupNotificationChannel(userId, onNotification);
    channels.push(notificationChannel);
    
    // Credit balance listener (optional)
    if (onCreditUpdate) {
      const creditBalanceChannel = createCreditBalanceListener(userId, onCreditUpdate);
      channels.push(creditBalanceChannel);
    }
    
    // Credit transaction listener (optional)
    if (onCreditTransaction) {
      const creditTransactionChannel = createCreditTransactionListener(userId, onCreditTransaction);
      channels.push(creditTransactionChannel);
    }
    
    // Messages listener (optional)
    if (onNewMessage) {
      const messagesChannel = createMessagesListener(userId, onNewMessage);
      channels.push(messagesChannel);
    }
    
    // Store active channels for this user
    activeChannels.set(userId, channels);
    console.log(`Set up ${channels.length} channels for user ${userId}`);
    
    // Return cleanup function
    return () => cleanupChannels(userId);
  } catch (error) {
    console.error('Error setting up real-time listeners:', error);
    cleanupChannels(userId);
    return () => {};
  }
};

/**
 * Clean up any active channels for a user
 */
const cleanupChannels = (userId: string) => {
  if (activeChannels.has(userId)) {
    const channels = activeChannels.get(userId) || [];
    console.log(`Cleaning up ${channels.length} channels for user ${userId}`);
    
    channels.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }
    });
    
    activeChannels.delete(userId);
  }
};
