
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import ActiveJobsTabContent from './tabs/ActiveJobsTabContent';
import ApplicationsTabContent from './tabs/ApplicationsTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import AvailableTabContent from './tabs/AvailableTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';

interface FreelancerTabsProps {
  isLoadingSettings: boolean;
  isLoadingLeads?: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const FreelancerTabs: React.FC<FreelancerTabsProps> = ({ 
  isLoadingSettings, 
  isLoadingLeads,
  leadSettings, 
  projectLeads 
}) => {
  const [activeTab, setActiveTab] = useState('available');
  
  return (
    <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="leads">My Leads</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="active">Active Jobs</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="pt-2">
        <AvailableTabContent />
      </TabsContent>
      
      <TabsContent value="leads" className="pt-2">
        <LeadsTabContent 
          isLoadingSettings={isLoadingSettings}
          isLoadingLeads={isLoadingLeads}
          leadSettings={leadSettings}
          projectLeads={projectLeads}
        />
      </TabsContent>
      
      <TabsContent value="applications" className="pt-2">
        <ApplicationsTabContent />
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
