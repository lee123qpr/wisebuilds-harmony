
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import AvailableTabContent from './tabs/AvailableTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import ApplicationsTabContent from './tabs/ApplicationsTabContent';
import ActiveJobsTabContent from './tabs/ActiveJobsTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';
import { useSearchParams } from 'react-router-dom';

interface FreelancerTabsProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const FreelancerTabs: React.FC<FreelancerTabsProps> = ({ 
  isLoadingSettings, 
  leadSettings, 
  projectLeads 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>('available');
  
  // Set initial tab based on URL or default to 'available'
  useEffect(() => {
    if (tabFromUrl && ['available', 'leads', 'applied', 'active', 'messages'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="available">Available Projects</TabsTrigger>
        <TabsTrigger value="leads">My Leads</TabsTrigger>
        <TabsTrigger value="applied">My Responses</TabsTrigger>
        <TabsTrigger value="active">Active Jobs</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="space-y-6">
        <AvailableTabContent />
      </TabsContent>
      
      <TabsContent value="leads" className="space-y-6">
        <LeadsTabContent 
          isLoadingSettings={isLoadingSettings} 
          leadSettings={leadSettings} 
          projectLeads={projectLeads} 
        />
      </TabsContent>
      
      <TabsContent value="applied" className="space-y-4">
        <ApplicationsTabContent />
      </TabsContent>
      
      <TabsContent value="active" className="space-y-4">
        <ActiveJobsTabContent />
      </TabsContent>
      
      <TabsContent value="messages" className="space-y-4">
        <MessagesTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerTabs;
