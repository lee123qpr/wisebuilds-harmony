
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useQuotesTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState(true);
  
  // Load notification state from localStorage
  useEffect(() => {
    if (!user?.id) return;
    
    const dismissedKey = `quotes-notification-dismissed-${user.id}`;
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';
    
    if (isDismissed) {
      setShowNotification(false);
    }
  }, [user?.id]);
  
  // Handle dismiss of notification
  const handleDismissNotification = () => {
    if (!user?.id) return;
    
    const dismissedKey = `quotes-notification-dismissed-${user.id}`;
    localStorage.setItem(dismissedKey, 'true');
    setShowNotification(false);
    
    toast({
      title: "Notification dismissed",
      description: "You can view your active jobs in the 'Active Jobs' tab.",
      variant: "default",
    });
  };
  
  return {
    showNotification,
    handleDismissNotification
  };
};
