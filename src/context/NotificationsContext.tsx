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
  | 'payment';

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
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock notifications for testing
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New Message',
    description: 'Sarah Johnson sent you a message about your proposal',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '2',
    type: 'lead',
    title: 'New Lead Available',
    description: 'A new project matching your skills is available',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    type: 'hired',
    title: 'You Were Hired!',
    description: 'Congratulations! You were hired for the Kitchen Renovation project',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '4',
    type: 'review',
    title: 'New Review',
    description: 'Michael Brown left you a 5-star review',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  }
];

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
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use mock data
        setNotifications(MOCK_NOTIFICATIONS);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for new notifications
    // This would be implemented with Supabase realtime in a production app
    const mockInterval = setInterval(() => {
      // Randomly add a new notification (1 in 10 chance) for demo purposes
      if (Math.random() < 0.1) {
        const types: NotificationType[] = ['message', 'lead', 'hired', 'project_complete', 'review', 'verification_status', 'payment'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: `mock-${Date.now()}`,
          type: randomType,
          title: getNotificationTitle(randomType),
          description: getNotificationDescription(randomType),
          read: false,
          created_at: new Date().toISOString(),
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show a toast for the new notification
        toast({
          title: newNotification.title,
          description: newNotification.description,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(mockInterval);
    };
  }, [user, toast]);

  const getNotificationTitle = (type: NotificationType): string => {
    switch (type) {
      case 'message': return 'New Message';
      case 'lead': return 'New Lead Available';
      case 'hired': return 'You Were Hired!';
      case 'project_complete': return 'Project Completed';
      case 'review': return 'New Review';
      case 'application_viewed': return 'Application Viewed';
      case 'verification_status': return 'Verification Update';
      case 'payment': return 'Payment Received';
      default: return 'New Notification';
    }
  };

  const getNotificationDescription = (type: NotificationType): string => {
    switch (type) {
      case 'message': return 'You have received a new message.';
      case 'lead': return 'A new project matching your settings is available.';
      case 'hired': return 'Congratulations! You were hired for a project.';
      case 'project_complete': return 'A project has been marked as complete.';
      case 'review': return 'Someone left you a new review.';
      case 'application_viewed': return 'A client viewed your application.';
      case 'verification_status': return 'There is an update to your verification status.';
      case 'payment': return 'You have received a payment.';
      default: return 'You have a new notification.';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        isLoading
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
