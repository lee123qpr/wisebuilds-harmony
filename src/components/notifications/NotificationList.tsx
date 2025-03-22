
import React from 'react';
import { useNotifications, NotificationType } from '@/context/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Mail, Package, Star, Briefcase, Eye, AlertCircle, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NotificationList = () => {
  const { notifications, unreadCount, markAllAsRead, markAsRead, isLoading } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'lead':
        return <Briefcase className="h-4 w-4 text-emerald-500" />;
      case 'hired':
        return <FileCheck className="h-4 w-4 text-purple-500" />;
      case 'project_complete':
        return <Package className="h-4 w-4 text-amber-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'application_viewed':
        return <Eye className="h-4 w-4 text-indigo-500" />;
      case 'verification_status':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-cyan-500" />;
      case 'credit_update':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'message' && notification.data?.conversation_id) {
      navigate(`/dashboard/freelancer/messages?conversation=${notification.data.conversation_id}`);
    } else if (notification.type === 'hired' && notification.data?.project_id) {
      navigate(`/dashboard/freelancer/quotes`);
    } else if (notification.type === 'lead' && notification.data?.id) {
      navigate(`/projects/${notification.data.id}`);
    } else if (notification.type === 'credit_update' || notification.type === 'payment') {
      navigate('/dashboard/freelancer/credits');
    } else if (notification.link) {
      navigate(notification.link);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 flex items-center justify-between bg-muted/50">
        <h3 className="font-medium text-sm">Notifications</h3>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="h-7 px-2 text-xs font-medium text-primary hover:text-primary/90"
          >
            Mark all as read
          </Button>
        )}
      </div>
      <Separator />
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground text-xs">
          <p>No notifications</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[320px]">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-2.5 hover:bg-muted/30 transition-colors cursor-pointer",
                  !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p className={cn(
                      "text-xs truncate",
                      !notification.read ? 'font-medium' : ''
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" aria-hidden="true"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default NotificationList;
