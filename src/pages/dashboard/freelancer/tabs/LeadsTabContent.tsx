
import React from 'react';
import { useProjectsWithFiltering } from '@/hooks/projects/useProjectsWithFiltering';
import { LeadSettings } from '@/hooks/freelancer/types';
import ProjectListView from '@/components/dashboard/freelancer/ProjectListView';
import LeadSettingsAlert from '@/components/dashboard/freelancer/leads/LeadSettingsAlert';
import LeadsHeader from '@/components/dashboard/freelancer/leads/LeadsHeader';
import { useState, useEffect } from 'react';
import EmptyLeadsMessage from '@/components/dashboard/freelancer/leads/EmptyLeadsMessage';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface LeadsTabContentProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
}

const LeadsTabContent: React.FC<LeadsTabContentProps> = ({ 
  isLoadingSettings, 
  leadSettings 
}) => {
  console.log('LeadsTabContent render:', { isLoadingSettings, leadSettings });
  
  const queryClient = useQueryClient();
  // Use our hook with filtering enabled (true) based on leadSettings
  const { projectLeads: filteredProjects, isLoading: isLoadingLeads, refreshProjects } = useProjectsWithFiltering(true, leadSettings);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    console.log('Filtered projects in LeadsTabContent:', filteredProjects.length);
    console.log('Projects data:', filteredProjects);
  }, [filteredProjects]);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? filteredProjects.find(project => project.id === selectedProjectId)
    : filteredProjects.length > 0 ? filteredProjects[0] : null;
  
  // Set the first project as selected by default when projects load
  useEffect(() => {
    if (filteredProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedProjectId]);

  // Handle refresh - improved to use the refreshProjects function
  const handleRefresh = async () => {
    console.log('Refreshing leads...');
    setIsRefreshing(true);
    
    toast({
      title: "Refreshing leads",
      description: "Looking for new matching leads...",
    });
    
    try {
      // Use the refreshProjects function from useProjectsWithFiltering
      await refreshProjects();
      
      // Force a refresh of the lead settings as well
      await queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
    } catch (error) {
      console.error('Error refreshing leads:', error);
      toast({
        variant: 'destructive',
        title: "Error refreshing leads",
        description: "There was a problem refreshing your leads. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // If loading or no settings, show alert
  if (isLoadingSettings) {
    console.log('Lead settings still loading');
    return <LeadSettingsAlert isLoading={true} />;
  }
  
  if (!leadSettings) {
    console.log('No lead settings found');
    return <LeadSettingsAlert isLoading={false} />;
  }
  
  return (
    <div className="space-y-4">
      <LeadsHeader 
        onRefresh={handleRefresh} 
        isLoading={isLoadingSettings || isLoadingLeads || isRefreshing}
        location={leadSettings.location} 
      />
      
      {filteredProjects.length === 0 && !isLoadingLeads && !isRefreshing ? (
        <EmptyLeadsMessage />
      ) : (
        <ProjectListView 
          projects={filteredProjects as any}
          isLoading={isLoadingLeads || isRefreshing}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as any}
        />
      )}
    </div>
  );
};

export default LeadsTabContent;
