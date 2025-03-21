
import React from 'react';
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabTrigger } from './TabTrigger';
import { TabCounts, TabNotifications } from '@/hooks/dashboard/useTabCounts';

interface TabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tabCounts: TabCounts;
  tabNotifications: TabNotifications;
  children: React.ReactNode;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  onTabChange,
  tabCounts,
  tabNotifications,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabTrigger
          value="available"
          label="Available Projects"
          badgeCount={tabCounts.available > 0 ? tabCounts.available : undefined}
          showNotification={tabNotifications.available}
        />
        <TabTrigger
          value="leads"
          label="My Leads"
          badgeCount={tabCounts.leads > 0 ? tabCounts.leads : undefined}
          showNotification={tabNotifications.leads}
        />
        <TabTrigger
          value="quotes"
          label="My Quotes"
          badgeCount={tabCounts.quotes > 0 ? tabCounts.quotes : undefined}
          showNotification={tabNotifications.quotes}
        />
        <TabTrigger
          value="active"
          label="Active Jobs"
          badgeCount={tabCounts.active > 0 ? tabCounts.active : undefined}
          showNotification={tabNotifications.active}
        />
        <TabTrigger
          value="messages"
          label="Messages"
          badgeCount={tabCounts.messages > 0 ? tabCounts.messages : undefined}
          showNotification={tabNotifications.messages}
        />
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default TabsContainer;
