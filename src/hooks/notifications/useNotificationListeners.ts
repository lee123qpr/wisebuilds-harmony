
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchNotifications,
  setupRealTimeListeners,
  handleNewMessage,
  addNotificationToDatabase
} from '@/services/notifications';
import { Notification, NotificationType } from '@/services/notifications/types';

export const useNotificationListeners = (
  user: User | null,
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  addNotificationToState: (notification: Notification) => void,
  updateNotificationInState: (notification: Notification) => void
) => {
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    let channels: RealtimeChannel[] = [];

    const initializeNotifications = async () => {
      setIsLoading(true);
      console.log('Initializing notifications for user:', user.id);
      
      try {
        // Fetch existing notifications
        const data = await fetchNotifications(user.id);
        setNotifications(data);
        console.log('Fetched notifications:', data.length);
        
        // Setup realtime listeners
        channels = setupRealTimeListeners({
          userId: user.id,
          onNewNotification: (notification) => {
            console.log('New notification received:', notification);
            addNotificationToState(notification);
          },
          onNotificationUpdate: (updatedNotification) => {
            console.log('Notification updated:', updatedNotification);
            updateNotificationInState(updatedNotification);
          },
          onNewMessage: (message) => {
            console.log('New message received in notification service:', message);
            // Check if the message is not from the current user before creating a notification
            if (message.sender_id !== user.id) {
              handleNewMessage(message, addNotification);
            }
          },
          onQuoteUpdate: (payload) => {
            const oldStatus = payload.old?.status;
            const newStatus = payload.new?.status;
            
            // Only notify on status change to 'accepted'
            if (oldStatus !== 'accepted' && newStatus === 'accepted') {
              const notification = {
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
          },
          onNewProject: async (project) => {
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
              const notification = {
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
          },
          onCreditBalanceUpdate: (payload) => {
            const oldBalance = payload.old?.credit_balance || 0;
            const newBalance = payload.new?.credit_balance || 0;
            
            // Only notify when balance increases (credits added)
            if (newBalance > oldBalance) {
              const addedCredits = newBalance - oldBalance;
              const notification = {
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
          },
          onCreditTransaction: (payload) => {
            // Only notify when a transaction is updated to completed
            if (payload.old?.status === 'pending' && payload.new?.status === 'completed') {
              const notification = {
                type: 'payment' as NotificationType,
                title: 'Payment Completed',
                description: `Your credit purchase of ${payload.new.credits_purchased} credits has been completed`,
                data: payload.new
              };
              
              addNotification(notification);
            }
          }
        });
      } catch (error) {
        console.error('Error initializing notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();

    // Cleanup function
    return () => {
      console.log('Cleaning up notification channels');
      channels.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
    };
  }, [user, setNotifications, setIsLoading, addNotificationToState, updateNotificationInState]);

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) return;
    console.log('Adding notification to database:', notificationData);
    await addNotificationToDatabase(user, notificationData);
    // We don't need to manually update the state as the realtime listener will handle it
  };

  return { addNotification };
};
