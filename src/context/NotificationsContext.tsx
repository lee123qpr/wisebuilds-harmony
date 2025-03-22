
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type NotificationType = 
  | 'message' 
  | 'lead' 
  | 'hired'
  | 'project_complete'
  | 'review'
  | 'application_viewed'
  | 'verification_status'
  | 'payment'
  | 'credit_update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Setup real-time listeners for various notification sources
    const channels = setupRealTimeListeners(user.id);

    return () => {
      // Clean up all channels when component unmounts
      channels.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
    };
  }, [user, toast]);

  const setupRealTimeListeners = (userId: string) => {
    const channels = [];

    // 1. Listen for new notifications
    const notificationsChannel = supabase
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
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          toast({
            title: newNotification.title,
            description: newNotification.description,
            variant: "default"
          });
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
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === updatedNotification.id 
                ? updatedNotification 
                : notification
            )
          );
        }
      )
      .subscribe();
    
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
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          const message = payload.new;
          const notification = {
            id: `msg_${message.id}`,
            type: 'message' as NotificationType,
            title: 'New Message',
            description: 'You have received a new message',
            read: false,
            created_at: new Date().toISOString(),
            data: message
          };
          
          addNotificationWithToast(notification);
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
          const oldStatus = payload.old?.status;
          const newStatus = payload.new?.status;
          
          // Only notify on status change to 'accepted'
          if (oldStatus !== 'accepted' && newStatus === 'accepted') {
            const notification = {
              id: `quote_${payload.new.id}`,
              type: 'hired' as NotificationType,
              title: 'You Were Hired!',
              description: 'A client has accepted your quote. Congratulations!',
              read: false,
              created_at: new Date().toISOString(),
              data: payload.new
            };
            
            addNotificationWithToast(notification);
          }
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
          // In a full implementation, we would check if this project matches 
          // the user's lead settings before notifying
          // For now, we'll notify for all new projects
          const notification = {
            id: `project_${payload.new.id}`,
            type: 'lead' as NotificationType,
            title: 'New Lead Available',
            description: 'A new project matching your criteria has been posted',
            read: false,
            created_at: new Date().toISOString(),
            data: payload.new
          };
          
          addNotificationWithToast(notification);
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
          const oldBalance = payload.old?.credit_balance || 0;
          const newBalance = payload.new?.credit_balance || 0;
          
          // Only notify when balance increases (credits added)
          if (newBalance > oldBalance) {
            const addedCredits = newBalance - oldBalance;
            const notification = {
              id: `credits_${Date.now()}`,
              type: 'credit_update' as NotificationType,
              title: 'Credits Added',
              description: `${addedCredits} credits have been added to your account`,
              read: false,
              created_at: new Date().toISOString(),
              data: { 
                oldBalance, 
                newBalance, 
                difference: addedCredits 
              }
            };
            
            addNotificationWithToast(notification);
          }
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
          // Only notify when a transaction is updated to completed
          if (payload.old?.status === 'pending' && payload.new?.status === 'completed') {
            const notification = {
              id: `payment_${payload.new.id}`,
              type: 'payment' as NotificationType,
              title: 'Payment Completed',
              description: `Your credit purchase of ${payload.new.credits_purchased} credits has been completed`,
              read: false,
              created_at: new Date().toISOString(),
              data: payload.new
            };
            
            addNotificationWithToast(notification);
          }
        }
      )
      .subscribe();
    
    channels.push(transactionsChannel);

    // Return all channels for cleanup
    return channels;
  };

  const addNotificationWithToast = (notification: Notification) => {
    // Add to notifications state
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.description,
      variant: "default"
    });
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `custom_${Date.now()}`,
      created_at: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Create a record in the notifications table
    if (user) {
      supabase.from('notifications').insert([{
        user_id: user.id,
        type: newNotification.type,
        title: newNotification.title,
        description: newNotification.description,
        data: newNotification.data
      }]).then(({ error }) => {
        if (error) {
          console.error('Error saving notification:', error);
        }
      });
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update the notification in the database if it's a database record
    if (user && !id.startsWith('custom_') && !id.startsWith('msg_') && 
        !id.startsWith('quote_') && !id.startsWith('project_') && 
        !id.startsWith('credits_') && !id.startsWith('payment_')) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Update all notifications in the database
    if (user) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        isLoading,
        addNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
