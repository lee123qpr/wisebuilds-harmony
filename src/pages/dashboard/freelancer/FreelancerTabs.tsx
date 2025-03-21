
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import ActiveJobsTab from '@/components/dashboard/freelancer/ActiveJobsTab';
import QuotesTabContent from './tabs/QuotesTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import AvailableTabContent from './tabs/AvailableTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
  const tabParam = searchParams.get('tab');
  
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
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="available">Available Projects</TabsTrigger>
        <TabsTrigger value="leads">My Leads</TabsTrigger>
        <TabsTrigger value="quotes">My Quotes</TabsTrigger>
        <TabsTrigger value="active">Active Jobs</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
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
        <ActiveJobsTab />
      </TabsContent>
      
      <TabsContent value="messages" className="pt-2">
        <MessagesTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerTabs;
