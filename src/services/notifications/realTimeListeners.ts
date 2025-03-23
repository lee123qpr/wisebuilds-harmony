
import { supabase } from '@/integrations/supabase/client';
import { setupNotificationChannel } from './listeners/notificationListeners';
import { createCreditBalanceListener, createCreditTransactionListener, cleanupCreditListeners } from './listeners/creditListeners';
import { RealtimeChannel } from '@supabase/supabase-js';

// Map to track active channels by user ID to prevent duplicate subscriptions
const activeChannels = new Map<string, RealtimeChannel[]>();

// Cooldown tracking to prevent excessive subscriptions
const lastSetupTime = new Map<string, number>();
const SETUP_COOLDOWN_MS = 5000; // 5 seconds cooldown

/**
 * Set up all real-time listeners for notifications and credits
 */
export const setupListeners = (userId: string, onNotification: (payload: any) => void) => {
  if (!userId) {
    console.warn('Cannot set up listeners: No user ID provided');
    return () => {};
  }
  
  // Implement cooldown to prevent excessive setups
  const now = Date.now();
  const lastSetup = lastSetupTime.get(userId) || 0;
  
  if (now - lastSetup < SETUP_COOLDOWN_MS) {
    console.log(`Listener setup for user ${userId} on cooldown, reusing existing channels`);
    return () => cleanupUserChannels(userId);
  }
  
  lastSetupTime.set(userId, now);
  
  // Clean up any existing channels for this user to prevent duplicates
  cleanupUserChannels(userId);
  
  // Set up new channels with error handling
  const channels: RealtimeChannel[] = [];
  
  try {
    console.log(`Setting up listeners for user ${userId}`);
    
    // Notification channel
    const notificationChannel = setupNotificationChannel(userId, onNotification);
    channels.push(notificationChannel);
    
    // Store active channels for this user
    activeChannels.set(userId, channels);
    
    // Return cleanup function
    return () => {
      cleanupUserChannels(userId);
    };
  } catch (error) {
    console.error('Error setting up real-time listeners:', error);
    return () => {};
  }
};

/**
 * Clean up all channels for a specific user
 */
function cleanupUserChannels(userId: string) {
  if (activeChannels.has(userId)) {
    const channels = activeChannels.get(userId) || [];
    channels.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }
    });
    activeChannels.delete(userId);
  }
  
  // Also clean up credit-specific listeners
  cleanupCreditListeners(userId);
}

/**
 * Get list of active channels for a user (for debugging)
 */
export const getActiveChannels = (userId: string): string[] => {
  const channels = activeChannels.get(userId) || [];
  return channels.map(channel => channel.topic || 'unknown');
};

