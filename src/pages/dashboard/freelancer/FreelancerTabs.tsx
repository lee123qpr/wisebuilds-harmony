import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import ActiveJobsTabContent from './tabs/ActiveJobsTabContent';
import QuotesTabContent from './tabs/QuotesTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import AvailableTabContent from './tabs/AvailableTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationsContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useUnreadMessages } from '@/hooks/messages/useUnreadMessages';

interface TabCounts {
  available: number;
  leads: number;
  quotes: number;
  active: number;
  messages: number;
}

interface TabNotifications {
  available: boolean;
  leads: boolean;
  quotes: boolean;
  active: boolean;
  messages: boolean;
}

interface FreelancerTabsProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
}

const FreelancerTabs: React.FC<FreelancerTabsProps> = ({ 
  isLoadingSettings, 
  leadSettings 
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const { unreadCount: messageCount, hasNewMessages } = useUnreadMessages();
  const tabParam = searchParams.get('tab');
  
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
  
  // Get the active tab from URL parameter, localStorage, or default to 'available'
  const getInitialTab = () => {
    if (tabParam && ['available', 'leads', 'quotes', 'active', 'messages'].includes(tabParam)) {
      return tabParam;
    }
    
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('freelancer-active-tab');
      return savedTab || 'available';
    }
    return 'available';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard/freelancer?tab=${value}${getAdditionalQueryParams()}`);
    
    // Reset notification for the selected tab
    setTabNotifications(prev => ({
      ...prev,
      [value]: false
    }));
  };
  
  // Get any additional query parameters that need to be preserved
  const getAdditionalQueryParams = () => {
    const conversationId = searchParams.get('conversation');
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    
    let additionalParams = '';
    if (conversationId) additionalParams += `&conversation=${conversationId}`;
    if (projectId) additionalParams += `&projectId=${projectId}`;
    if (clientId) additionalParams += `&clientId=${clientId}`;
    
    return additionalParams;
  };
  
  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freelancer-active-tab', activeTab);
  }, [activeTab]);
  
  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['available', 'leads', 'quotes', 'active', 'messages'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  // Fetch counts for each tab
  useEffect(() => {
    if (!user) return;
    
    const fetchTabCounts = async () => {
      try {
        const { count: availableCount, error: availableError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');
          
        const { count: leadsCount, error: leadsError } = await supabase
          .from('project_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        const { count: quotesCount, error: quotesError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('freelancer_id', user.id);
          
        const { count: activeJobsCount, error: activeJobsError } = await supabase
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
      const messageNotifications = notifications.filter(n => 
        n.type === 'message' && !n.read
      );
      
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
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger 
          value="available" 
          badgeCount={tabCounts.available > 0 ? tabCounts.available : undefined}
          showNotification={tabNotifications.available}
        >
          Available Projects
        </TabsTrigger>
        <TabsTrigger 
          value="leads"
          badgeCount={tabCounts.leads > 0 ? tabCounts.leads : undefined}
          showNotification={tabNotifications.leads}
        >
          My Leads
        </TabsTrigger>
        <TabsTrigger 
          value="quotes"
          badgeCount={tabCounts.quotes > 0 ? tabCounts.quotes : undefined}
          showNotification={tabNotifications.quotes}
        >
          My Quotes
        </TabsTrigger>
        <TabsTrigger 
          value="active"
          badgeCount={tabCounts.active > 0 ? tabCounts.active : undefined}
          showNotification={tabNotifications.active}
        >
          Active Jobs
        </TabsTrigger>
        <TabsTrigger 
          value="messages"
          badgeCount={tabCounts.messages > 0 ? tabCounts.messages : undefined}
          showNotification={tabNotifications.messages}
        >
          Messages
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="pt-2">
        <AvailableTabContent />
      </TabsContent>
      
      <TabsContent value="leads" className="pt-2">
        <LeadsTabContent 
          isLoadingSettings={isLoadingSettings}
          leadSettings={leadSettings}
        />
      </TabsContent>
      
      <TabsContent value="quotes" className="pt-2">
        <QuotesTabContent />
      </TabsContent>
      
      <TabsContent value="active" className="pt-2">
        <ActiveJobsTabContent />
      </TabsContent>
      
      <TabsContent value="messages" className="pt-2">
        <MessagesTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerTabs;
