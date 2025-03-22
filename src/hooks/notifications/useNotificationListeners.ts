
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchNotifications,
  setupRealTimeListeners,
  addNotificationToDatabase
} from '@/services/notifications';
import { Notification } from '@/services/notifications/types';
import { useNotificationEventHandlers } from './useNotificationEventHandlers';

export const useNotificationListeners = (
  user: User | null,
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  addNotificationToState: (notification: Notification) => void,
  updateNotificationInState: (notification: Notification) => void
) => {
  const addNotification = async (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) return;
    console.log('Adding notification to database:', notificationData);
    await addNotificationToDatabase(user, notificationData);
    // We don't need to manually update the state as the realtime listener will handle it
  };

  // Use the extracted event handlers
  const {
    handleMessageEvent,
    handleQuoteUpdate,
    handleNewProject,
    handleCreditBalanceUpdate,
    handleCreditTransaction
  } = useNotificationEventHandlers(user, addNotification);

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
          onNewMessage: handleMessageEvent,
          onQuoteUpdate: handleQuoteUpdate,
          onNewProject: handleNewProject,
          onCreditBalanceUpdate: handleCreditBalanceUpdate,
          onCreditTransaction: handleCreditTransaction
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

  return { addNotification };
};
