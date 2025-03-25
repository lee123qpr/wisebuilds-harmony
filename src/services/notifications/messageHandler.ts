
import { Notification, NotificationType } from './types';

export const handleNewMessage = (
  message: any, 
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void,
  recipientId?: string
) => {
  if (!message || !message.sender_id || !message.conversation_id) {
    console.warn('Invalid message data for notification:', message);
    return;
  }

  // Create a notification for the new message
  const notification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
    type: 'message' as NotificationType,
    title: 'New Message',
    description: message.content?.substring(0, 100) || 'You have received a new message',
    data: {
      conversation_id: message.conversation_id,
      message_id: message.id,
      sender_id: message.sender_id
    }
  };

  // Add the notification
  addNotification(notification);
};
