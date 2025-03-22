
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotificationToDatabase,
  handleNewMessage,
  setupRealTimeListeners
} from '@/services/notifications';
import { Notification, NotificationType } from '@/services/notifications/types';
import { useToast } from './use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useNotificationsService = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

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
            setNotifications(prev => [notification, ...prev]);
            
            toast({
              title: notification.title,
              description: notification.description,
              variant: "default"
            });
          },
          onNotificationUpdate: (updatedNotification) => {
            console.log('Notification updated:', updatedNotification);
            setNotifications(prev => 
              prev.map(notification => 
                notification.id === updatedNotification.id 
                  ? updatedNotification 
                  : notification
              )
            );
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
  }, [user, toast]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    
    // First update the local state for immediate feedback
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Then update the database
    const success = await markNotificationAsRead(id, user.id);
    
    if (!success) {
      // Revert the local change if DB update failed
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: false } 
            : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    // First update the local state for immediate feedback
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Then update the database
    const success = await markAllNotificationsAsRead(user.id);
    
    if (!success) {
      // Revert by fetching fresh data
      const data = await fetchNotifications(user.id);
      setNotifications(data);
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) return;
    console.log('Adding notification to database:', notificationData);
    await addNotificationToDatabase(user, notificationData);
    // We don't need to manually update the state as the realtime listener will handle it
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    addNotification
  };
};
