
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AvailableProjectsTab from '@/components/dashboard/freelancer/AvailableProjectsTab';
import LeadsTab from '@/components/dashboard/freelancer/LeadsTab';
import ApplicationsTab from '@/components/dashboard/freelancer/ApplicationsTab';
import ActiveJobsTab from '@/components/dashboard/freelancer/ActiveJobsTab';
import MessagesTab from '@/components/dashboard/freelancer/MessagesTab';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

// Updated to fully match Project interface required fields
interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  work_type: string;
  tags?: string[];
  duration: string;
  hiring_status: string;
  requires_equipment: boolean;
  requires_security_check: boolean;
  requires_insurance: boolean;
  requires_qualifications: boolean;
  published: boolean;
  client_id: string;
  client_name?: string;
  client_company?: string;
  start_date?: string;
  applications: number;
  documents: any;
  // Adding missing properties required by Project interface
  requires_site_visits: boolean;
  status: string;
  updated_at: string;
  user_id: string;
}

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
        <AvailableProjectsTab />
      </TabsContent>
      
      <TabsContent value="leads" className="space-y-6">
        <LeadsTab 
          isLoadingSettings={isLoadingSettings} 
          leadSettings={leadSettings} 
          projectLeads={projectLeads} 
        />
      </TabsContent>
      
      <TabsContent value="applied" className="space-y-4">
        <ApplicationsTab />
      </TabsContent>
      
      <TabsContent value="active" className="space-y-4">
        <ActiveJobsTab />
      </TabsContent>
      
      <TabsContent value="messages" className="space-y-4">
        <MessagesTab />
      </TabsContent>
    </Tabs>
  );
};

export default FreelancerTabs;
