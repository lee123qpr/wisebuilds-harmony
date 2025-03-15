
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AvailableProjectsTab from '@/components/dashboard/freelancer/AvailableProjectsTab';
import LeadsTab from '@/components/dashboard/freelancer/LeadsTab';
import ApplicationsTab from '@/components/dashboard/freelancer/ApplicationsTab';
import ActiveJobsTab from '@/components/dashboard/freelancer/ActiveJobsTab';
import MessagesTab from '@/components/dashboard/freelancer/MessagesTab';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import AvailableTabContent from './tabs/AvailableTabContent';
import LeadsTabContent from './tabs/LeadsTabContent';
import ApplicationsTabContent from './tabs/ApplicationsTabContent';
import ActiveJobsTabContent from './tabs/ActiveJobsTabContent';
import MessagesTabContent from './tabs/MessagesTabContent';

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
  return (
    <Tabs defaultValue="available" className="w-full">
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
