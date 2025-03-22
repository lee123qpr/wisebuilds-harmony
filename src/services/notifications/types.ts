
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

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
}
