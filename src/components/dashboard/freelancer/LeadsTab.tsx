
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProjectLeadCard from './ProjectLeadCard';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  tags?: string[];
}

interface LeadsTabProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ isLoadingSettings, leadSettings, projectLeads }) => {
  const navigate = useNavigate();
  
  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!leadSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Lead Settings</CardTitle>
          <CardDescription>Set up your lead preferences to get customized project recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/dashboard/freelancer/lead-settings')}
            className="w-full"
          >
            Set Up Lead Settings
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (projectLeads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Leads Available</CardTitle>
          <CardDescription>We'll notify you when projects matching your preferences become available</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/dashboard/freelancer/lead-settings')}
            variant="outline"
          >
            Update Lead Settings
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projectLeads.map((lead) => (
        <ProjectLeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
};

export default LeadsTab;
