
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

export const useTabCounts = (activeTab: string) => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const { unreadCount: messageCount } = useUnreadMessages();
  
  // State for tab counts
  const [tabCounts, setTabCounts] = useState<TabCounts>({
    available: 0,
    leads: 0,
    quotes: 0,
    active: 0,
    messages: 0
  });

  // Fetch counts for each tab
  useEffect(() => {
    if (!user) return;
    
    const fetchTabCounts = async () => {
      try {
        // For available projects, use count only query with simpler structure
        const availableResponse = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'open');
        
        const availableCount = availableResponse.count || 0;
        if (availableResponse.error) throw availableResponse.error;
          
        // For leads, use count only query with simpler structure
        const leadsResponse = await supabase
          .from('project_applications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        const leadsCount = leadsResponse.count || 0;
        if (leadsResponse.error) throw leadsResponse.error;
          
        // For quotes, use count only query with simpler structure
        const quotesResponse = await supabase
          .from('quotes')
          .select('id', { count: 'exact', head: true })
          .eq('freelancer_id', user.id);
        
        const quotesCount = quotesResponse.count || 0;
        if (quotesResponse.error) throw quotesResponse.error;
          
        // For active jobs, use count only query with simpler structure
        const activeJobsResponse = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'in_progress')
          .eq('hired_freelancer_id', user.id);
        
        const activeJobsCount = activeJobsResponse.count || 0;
        if (activeJobsResponse.error) throw activeJobsResponse.error;
          
        setTabCounts({
          available: availableCount,
          leads: leadsCount,
          quotes: quotesCount,
          active: activeJobsCount,
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
          fetchTabCounts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(quotesChannel);
    };
  }, [user, messageCount]);
  
  return {
    tabCounts
  };
};
