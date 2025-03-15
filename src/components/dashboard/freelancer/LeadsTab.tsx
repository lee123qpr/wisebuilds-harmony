
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, Info, Briefcase, Filter } from 'lucide-react';
import ProjectListView from './ProjectListView';
import { Project } from '@/components/projects/useProjects';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

// Updated to match Project interface required fields
interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  work_type?: string;
  tags?: string[];
  // Add missing properties required by Project interface
  duration: string;
  hiring_status?: string;
  requires_equipment: boolean;
  requires_security_check: boolean;
  requires_insurance: boolean;
  requires_qualifications: boolean;
  published: boolean;
  client_id: string;
  client_name?: string;
  client_company?: string;
  start_date?: string;
  applications?: number;
  documents?: any;
}

interface LeadsTabProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ isLoadingSettings, leadSettings, projectLeads }) => {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Filter leads based on the user's lead settings
  const filteredLeads = React.useMemo(() => {
    if (!leadSettings) return [];
    
    return projectLeads.filter(lead => {
      // Match by role (required)
      const roleMatches = lead.role === leadSettings.role;
      
      // Match by location (required)
      const locationMatches = lead.location === leadSettings.location || 
                              lead.location.includes(leadSettings.location) || 
                              leadSettings.location.includes(lead.location);
      
      // Match by work type (if specified)
      const workTypeMatches = !leadSettings.work_type || 
                              lead.work_type === leadSettings.work_type;
      
      // Match by keywords (if any)
      const keywordsMatch = !leadSettings.keywords || 
                            leadSettings.keywords.length === 0 || 
                            (lead.tags && lead.tags.some(tag => 
                              leadSettings.keywords?.some(keyword => 
                                tag.toLowerCase().includes(keyword.toLowerCase())
                              )
                            ));
      
      // Return true if all specified criteria match
      return roleMatches && locationMatches && workTypeMatches && keywordsMatch;
    });
  }, [leadSettings, projectLeads]);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? filteredLeads.find(project => project.id === selectedProjectId)
    : filteredLeads.length > 0 ? filteredLeads[0] : null;
  
  // Set the first project as selected by default when projects load
  useEffect(() => {
    if (filteredLeads.length > 0 && !selectedProjectId) {
      setSelectedProjectId(filteredLeads[0].id);
    }
  }, [filteredLeads, selectedProjectId]);
  
  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    // This would typically refresh the lead data
    // For now, it just re-filters the existing leads
  };
  
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">My Leads</h2>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/dashboard/freelancer/lead-settings')} 
            variant="outline" 
            size="sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Update Filters
          </Button>
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
                <CardTitle>No Matching Leads Available</CardTitle>
                <CardDescription>
                  We couldn't find any projects matching your current preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => navigate('/dashboard/freelancer/lead-settings')}
              variant="outline"
              className="mt-4"
            >
              Update Lead Settings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectListView 
          projects={filteredLeads as Project[]}
          isLoading={isLoadingSettings}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as Project}
          showContactInfo={true}
        />
      )}
    </div>
  );
};

export default LeadsTab;
