
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useUnreadMessages } from '@/hooks/messages/useUnreadMessages';

export interface TabCounts {
  available: number;
  leads: number;
  quotes: number;
  active: number;
  messages: number;
}

export interface TabNotifications {
  available: boolean;
  leads: boolean;
  quotes: boolean;
  active: boolean;
  messages: boolean;
}

export const useTabCounts = (activeTab: string) => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const { unreadCount: messageCount, hasNewMessages } = useUnreadMessages();
  
  // State for tab counts and notifications
  const [tabCounts, setTabCounts] = useState<TabCounts>({
    available: 0,
    leads: 0,
    quotes: 0,
    active: 0,
    messages: 0
  });
  
  const [tabNotifications, setTabNotifications] = useState<TabNotifications>({
    available: false,
    leads: false,
    quotes: false,
    active: false,
    messages: false
  });

  // Fetch counts for each tab
  useEffect(() => {
    if (!user) return;
    
    const fetchTabCounts = async () => {
      try {
        // For available projects, use count only query
        const { count: availableCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
          
        // For leads, use count only query
        const { count: leadsCount } = await supabase
          .from('project_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        // For quotes, use count only query
        const { count: quotesCount } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('freelancer_id', user.id);
          
        // For active jobs, use count only query
        const { count: activeJobsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in_progress')
          .eq('hired_freelancer_id', user.id);
          
        setTabCounts({
          available: availableCount || 0,
          leads: leadsCount || 0,
          quotes: quotesCount || 0,
          active: activeJobsCount || 0,
          messages: messageCount
        });
      } catch (error) {
        console.error('Error fetching tab counts:', error);
      }
    };
    
    fetchTabCounts();
    
    // Set up real-time listeners for changes
    const projectsChannel = supabase
      .channel('tab-counts-projects')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'projects' },
        () => {
          console.log('New project added');
          if (activeTab !== 'available') {
            setTabNotifications(prev => ({ ...prev, available: true }));
          }
          fetchTabCounts();
        }
      )
      .subscribe();
      
    const quotesChannel = supabase
      .channel('tab-counts-quotes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quotes', filter: `freelancer_id=eq.${user.id}` },
        () => {
          console.log('Quote updated');
          if (activeTab !== 'quotes') {
            setTabNotifications(prev => ({ ...prev, quotes: true }));
          }
          fetchTabCounts();
        }
      )
      .subscribe();
      
    // Check for notification type to highlight appropriate tab
    const processNotifications = () => {
      const leadNotifications = notifications.filter(n => 
        n.type === 'lead' && !n.read
      );
      
      setTabNotifications(prev => ({
        ...prev,
        messages: hasNewMessages,
        leads: prev.leads || leadNotifications.length > 0
      }));
    };
    
    processNotifications();
    
    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(quotesChannel);
    };
  }, [user, activeTab, notifications, messageCount, hasNewMessages]);

  // Reset notification for the selected tab
  const resetTabNotification = (tabName: string) => {
    setTabNotifications(prev => ({
      ...prev,
      [tabName]: false
    }));
  };
  
  return {
    tabCounts,
    tabNotifications,
    resetTabNotification
  };
};
