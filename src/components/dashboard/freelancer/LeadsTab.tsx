
import React from 'react';
import { Project } from '@/components/projects/useProjects';
import { ProjectLead } from '@/types/projects';
import ProjectListView from './ProjectListView';
import LeadSettingsAlert from './leads/LeadSettingsAlert';
import { useLeadFiltering } from './leads/useLeadFiltering';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Info, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface LeadsTabProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ isLoadingSettings, leadSettings, projectLeads }) => {
  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    // This would typically refresh the lead data
  };
  
  // Use our custom hook for lead filtering
  const { 
    filteredLeads, 
    selectedProject, 
    selectedProjectId, 
    setSelectedProjectId 
  } = useLeadFiltering(leadSettings, projectLeads);
  
  // If loading or no settings, show alert
  if (isLoadingSettings || !leadSettings) {
    return <LeadSettingsAlert isLoading={isLoadingSettings} />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">My Leads</h2>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline" 
            className="flex items-center"
            disabled={isLoadingSettings}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingSettings ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {filteredLeads.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>No Leads Found</CardTitle>
                <CardDescription>
                  There are currently no leads matching your settings.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={handleRefresh} className="mt-4 flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" /> Check for New Leads
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectListView 
          projects={filteredLeads as unknown as Project[]}
          isLoading={isLoadingSettings}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as unknown as Project}
          showContactInfo={true}
        />
      )}
    </div>
  );
};

export default LeadsTab;
