
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
        // Check if the table exists
        const { data: exists, error: checkError } = await supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .limit(1);
          
        if (checkError) {
          console.error('Error checking notifications table:', checkError);
          setNotifications([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch notifications from the table
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
          setIsLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          setNotifications(data as Notification[]);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
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
          filter: `sender_id=neq.${userId}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          const message = payload.new;
          
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
            
            const notification = {
              type: 'message' as NotificationType,
              title: `New Message from ${senderName}`,
              description: 'You have received a new message',
              data: {
                conversation_id: message.conversation_id,
                message: message.message,
                sender_id: message.sender_id
              }
            };
            
            addNotification(notification);
          } catch (error) {
            console.error('Error processing message notification:', error);
          }
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
        async (payload) => {
          // Get user's lead settings
          const { data: leadSettings } = await supabase
            .from('lead_settings')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (!leadSettings) return;
          
          // Do basic matching - in a real app this would be more sophisticated
          const project = payload.new;
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
              type: 'payment' as NotificationType,
              title: 'Payment Completed',
              description: `Your credit purchase of ${payload.new.credits_purchased} credits has been completed`,
              data: payload.new
            };
            
            addNotification(notification);
          }
        }
      )
      .subscribe();
    
    channels.push(transactionsChannel);

    // Return all channels for cleanup
    return channels;
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) return;
    
    try {
      // Insert into the notifications table
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: notificationData.type,
          title: notificationData.title,
          description: notificationData.description,
          data: notificationData.data || {},
          read: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding notification:', error);
        return;
      }
      
      // The realtime subscription will handle adding this to the state
      // so we don't need to manually update the state here
      
      // Show toast notification
      toast({
        title: notificationData.title,
        description: notificationData.description,
        variant: "default"
      });
      
      return data;
    } catch (error) {
      console.error('Error in addNotification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // First update the local state for immediate feedback
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Then update the database
      if (user) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error marking notification as read:', error);
          // Revert the local change if DB update failed
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === id 
                ? { ...notification, read: false } 
                : notification
            )
          );
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // First update the local state for immediate feedback
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Then update the database
      if (user) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', user.id)
          .eq('read', false);
          
        if (error) {
          console.error('Error marking all notifications as read:', error);
          // Revert if failed (we could be more sophisticated here and only revert those that were unread before)
          fetchNotifications();
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Helper function to fetch notifications, used when we need to refresh
  const fetchNotifications = async () => {
    if (!user) return;
    
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
      
      if (data) {
        setNotifications(data as Notification[]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
