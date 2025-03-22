
import { useState } from 'react';
import { Notification } from '@/services/notifications/types';
import { useToast } from '../use-toast';

export const useNotificationsState = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotificationToState = (notification: Notification) => {
    console.log('Adding notification to state:', notification);
    setNotifications(prev => [notification, ...prev]);
    
    toast({
      title: notification.title,
      description: notification.description,
      variant: "default"
    });
  };

  const updateNotificationInState = (updatedNotification: Notification) => {
    console.log('Updating notification in state:', updatedNotification);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === updatedNotification.id 
          ? updatedNotification 
          : notification
      )
    );
  };

  return {
    notifications,
    setNotifications,
    isLoading,
    setIsLoading,
    unreadCount,
    addNotificationToState,
    updateNotificationInState,
    toast
  };
};
