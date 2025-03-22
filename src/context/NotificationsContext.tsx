
import React, { createContext, useContext } from 'react';
import { useNotificationsService } from '@/hooks/notifications';
import { Notification, NotificationType, NotificationsContextType } from '@/services/notifications/types';

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationsService = useNotificationsService();

  return (
    <NotificationsContext.Provider value={notificationsService}>
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

// Re-export the types for convenience
export type { Notification, NotificationType };
