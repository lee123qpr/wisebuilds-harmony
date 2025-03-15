
import React from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationsContext';
import NotificationList from './NotificationList';

const NotificationIcon = () => {
  const { unreadCount } = useNotifications();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span 
              className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-xs text-white flex items-center justify-center"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-[400px] overflow-hidden">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
