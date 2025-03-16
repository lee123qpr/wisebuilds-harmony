
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from 'react-router-dom';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import ActiveJobsTabContent from './tabs/ActiveJobsTabContent';
import QuotesTabContent from './tabs/QuotesTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import AvailableTabContent from './tabs/AvailableTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';

interface FreelancerTabsProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
}

const FreelancerTabs: React.FC<FreelancerTabsProps> = ({ 
  isLoadingSettings, 
  leadSettings 
}) => {
  const [searchParams] = useSearchParams();
  const tabFromParams = searchParams.get('tab');
  
  // Get the active tab from URL params, localStorage, or default to 'available'
  const getInitialTab = () => {
    if (tabFromParams) {
      return tabFromParams;
    }
    
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('freelancer-active-tab');
      return savedTab || 'available';
    }
    return 'available';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Update active tab when URL params change
  useEffect(() => {
    if (tabFromParams) {
      setActiveTab(tabFromParams);
    }
  }, [tabFromParams]);
  
  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freelancer-active-tab', activeTab);
  }, [activeTab]);
  
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        <ActiveJobsTabContent />
      </TabsContent>
      
      <TabsContent value="messages" className="pt-2">
        <MessagesTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerTabs;
