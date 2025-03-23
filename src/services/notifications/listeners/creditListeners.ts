
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Track active listeners to prevent duplicates
const activeListeners = new Map<string, RealtimeChannel>();

/**
 * Sets up a listener for credit balance updates
 * Uses a singleton pattern to prevent duplicate subscriptions
 */
export const createCreditBalanceListener = (
  userId: string,
  onCreditBalanceUpdate: (update: any) => void
): RealtimeChannel => {
  // Check if a listener already exists for this user
  const existingChannelKey = `credit_balance_${userId}`;
  
  if (activeListeners.has(existingChannelKey)) {
    console.log('Reusing existing credit balance listener for user:', userId);
    return activeListeners.get(existingChannelKey)!;
  }
  
  console.log('Setting up new credit balance listener for user:', userId);
  
  const channel = supabase
    .channel(existingChannelKey)
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
    .subscribe((status) => {
      console.log(`Credit balance listener status: ${status}`, existingChannelKey);
    });
  
  // Store the channel reference for reuse
  activeListeners.set(existingChannelKey, channel);
  
  return channel;
};

/**
 * Sets up a listener for credit transaction updates
 * Uses a singleton pattern to prevent duplicate subscriptions
 */
export const createCreditTransactionListener = (
  userId: string,
  onCreditTransaction: (transaction: any) => void
): RealtimeChannel => {
  // Check if a listener already exists for this user
  const existingChannelKey = `credit_transactions_${userId}`;
  
  if (activeListeners.has(existingChannelKey)) {
    console.log('Reusing existing credit transaction listener for user:', userId);
    return activeListeners.get(existingChannelKey)!;
  }
  
  console.log('Setting up new credit transaction listener for user:', userId);
  
  const channel = supabase
    .channel(existingChannelKey)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'credit_transactions',
        filter: `user_id=eq.${userId} AND status=eq.completed`,
      },
      (payload) => {
        console.log('Credit transaction update received:', payload);
        onCreditTransaction(payload);
      }
    )
    .subscribe((status) => {
      console.log(`Credit transaction listener status: ${status}`, existingChannelKey);
    });
  
  // Store the channel reference for reuse
  activeListeners.set(existingChannelKey, channel);
  
  return channel;
};

/**
 * Clean up all credit listeners for a user
 */
export const cleanupCreditListeners = (userId: string): void => {
  const balanceKey = `credit_balance_${userId}`;
  const transactionKey = `credit_transactions_${userId}`;
  
  if (activeListeners.has(balanceKey)) {
    console.log('Cleaning up credit balance listener for user:', userId);
    const channel = activeListeners.get(balanceKey)!;
    supabase.removeChannel(channel);
    activeListeners.delete(balanceKey);
  }
  
  if (activeListeners.has(transactionKey)) {
    console.log('Cleaning up credit transaction listener for user:', userId);
    const channel = activeListeners.get(transactionKey)!;
    supabase.removeChannel(channel);
    activeListeners.delete(transactionKey);
  }
};
