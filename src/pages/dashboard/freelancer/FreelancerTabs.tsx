
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import ActiveJobsTabContent from './tabs/ActiveJobsTabContent';
import QuotesTabContent from './tabs/QuotesTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import AvailableTabContent from './tabs/AvailableTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';
import { useFreelancerTabs } from '@/hooks/dashboard/useFreelancerTabs';
import { useTabCounts } from '@/hooks/dashboard/useTabCounts';
import TabsContainer from '@/components/dashboard/freelancer/tabs/TabsContainer';

interface FreelancerTabsProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
}

const FreelancerTabs: React.FC<FreelancerTabsProps> = ({
  isLoadingSettings,
  leadSettings
}) => {
  const { activeTab, handleTabChange } = useFreelancerTabs();
  const { tabCounts, tabNotifications, resetTabNotification } = useTabCounts(activeTab);
  
  // Handle tab change with notification reset
  const onTabChange = (value: string) => {
    handleTabChange(value);
    resetTabNotification(value);
  };
  
  return (
    <TabsContainer
      activeTab={activeTab}
      onTabChange={onTabChange}
      tabCounts={tabCounts}
      tabNotifications={tabNotifications}
    >
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
    </TabsContainer>
  );
};

export default FreelancerTabs;
