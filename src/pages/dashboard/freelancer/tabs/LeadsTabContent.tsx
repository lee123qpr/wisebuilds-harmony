
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
  // Use our new hook with filtering enabled (true) based on leadSettings
  const { projectLeads: filteredProjects, isLoading: isLoadingLeads } = useProjectsWithFiltering(true, leadSettings);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    console.log('Filtered projects in LeadsTabContent:', filteredProjects.length);
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

  // Handle refresh - improved to stay on the current tab
  const handleRefresh = async () => {
    console.log('Refreshing leads without page reload...');
    setIsRefreshing(true);
    
    toast({
      title: "Refreshing leads",
      description: "Looking for new matching leads...",
    });
    
    // Invalidate relevant queries to refresh data
    await queryClient.invalidateQueries({ queryKey: ['projects'] });
    await queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
    
    // Small delay to ensure the UI shows something is happening
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
      <LeadsHeader onRefresh={handleRefresh} isLoading={isLoadingSettings || isLoadingLeads || isRefreshing} />
      
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
