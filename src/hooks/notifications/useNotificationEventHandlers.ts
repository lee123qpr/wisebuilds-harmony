
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from '@/services/notifications/types';
import { handleNewMessage } from '@/services/notifications';

/**
 * Handlers for different notification events
 */
export const useNotificationEventHandlers = (
  user: User | null,
  addNotification: (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => void
) => {
  
  const handleMessageEvent = (message: any) => {
    console.log('New message received in notification service:', message);
    // Check if the message is not from the current user before creating a notification
    if (message.sender_id !== user?.id) {
      // Pass the recipient ID (current user) as the third argument
      handleNewMessage(message, addNotification, user?.id || '');
    }
  };

  const handleQuoteUpdate = (payload: any) => {
    const oldStatus = payload.old?.status;
    const newStatus = payload.new?.status;
    
    // Only notify on status change to 'accepted'
    if (oldStatus !== 'accepted' && newStatus === 'accepted') {
      const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
        type: 'hired' as NotificationType,
        title: 'You Were Hired!',
        description: 'A client has accepted your quote. Congratulations!',
        data: {
          project_id: payload.new.project_id,
          quote_id: payload.new.id
        }
      };
      
      addNotification(notification);
    }
  };

  const handleNewProject = async (project: any) => {
    if (!user) return;
    
    // Get user's lead settings
    const { data: leadSettings } = await supabase
      .from('lead_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (!leadSettings) return;
    
    // Do basic matching - in a real app this would be more sophisticated
    let isMatch = false;
    
    // Simple matching logic - you would expand this in a real application
    if (
      (leadSettings.role && project.role === leadSettings.role) ||
      (leadSettings.location && project.location === leadSettings.location) ||
      (leadSettings.project_type && leadSettings.project_type.includes(project.work_type))
    ) {
      isMatch = true;
    }
    
    if (isMatch) {
      const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
        type: 'lead' as NotificationType,
        title: 'New Lead Available',
        description: `A new project "${project.title}" matching your criteria has been posted`,
        data: {
          id: project.id,
          title: project.title
        }
      };
      
      addNotification(notification);
    }
  };

  const handleCreditBalanceUpdate = (payload: any) => {
    const oldBalance = payload.old?.credit_balance || 0;
    const newBalance = payload.new?.credit_balance || 0;
    
    // Only notify when balance increases (credits added)
    if (newBalance > oldBalance) {
      const addedCredits = newBalance - oldBalance;
      const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
        type: 'credit_update' as NotificationType,
        title: 'Credits Added',
        description: `${addedCredits} credits have been added to your account`,
        data: { 
          oldBalance, 
          newBalance, 
          difference: addedCredits 
        }
      };
      
      addNotification(notification);
    }
  };

  const handleCreditTransaction = (payload: any) => {
    // Only notify when a transaction is updated to completed
    if (payload.old?.status === 'pending' && payload.new?.status === 'completed') {
      const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
        type: 'payment' as NotificationType,
        title: 'Payment Completed',
        description: `Your credit purchase of ${payload.new.credits_purchased} credits has been completed`,
        data: payload.new
      };
      
      addNotification(notification);
    }
  };

  return {
    handleMessageEvent,
    handleQuoteUpdate,
    handleNewProject,
    handleCreditBalanceUpdate,
    handleCreditTransaction
  };
};
