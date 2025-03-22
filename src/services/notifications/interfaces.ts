
import { RealtimeChannel } from '@supabase/supabase-js';
import { NotificationType } from './types';

export interface ListenersOptions {
  userId: string;
  onNewNotification: (notification: any) => void;
  onNotificationUpdate: (notification: any) => void;
  onNewMessage: (message: any) => void;
  onQuoteUpdate: (quote: any) => void;
  onNewProject: (project: any) => void;
  onCreditBalanceUpdate: (update: any) => void;
  onCreditTransaction: (transaction: any) => void;
}
