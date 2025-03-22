
import React, { useCallback } from 'react';
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

  // Refresh leads when the component mounts and after lead purchases
  useEffect(() => {
    // Refetch leads data when the component mounts
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.refetchQueries({ queryKey: ['leads'] });
    
    // Explicitly get fresh data from server
    refreshProjects();
  }, [queryClient, refreshProjects]);

  // Handle refresh - improved to use the refreshProjects function
  const handleRefresh = async () => {
    console.log('Refreshing leads...');
    setIsRefreshing(true);
    
    toast({
      title: "Refreshing leads",
      description: "Looking for new matching leads...",
    });
    
    try {
      // Force a full refresh
      await queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.refetchQueries({ queryKey: ['leads'] });
      
      // Use the refreshProjects function from useProjectsWithFiltering
      const refreshResult = await refreshProjects();
      console.log('Projects refresh result:', refreshResult);
      
      // Sometimes a more aggressive refresh is needed
      if (filteredProjects.length === 0) {
        await queryClient.resetQueries({ queryKey: ['leads'] });
        await queryClient.refetchQueries({ queryKey: ['leads'] });
      }
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

  // Handle purchase success to refresh leads data
  const handlePurchaseSuccess = useCallback(async () => {
    console.log('Lead purchase success, refreshing leads data...');
    try {
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      await queryClient.refetchQueries({ queryKey: ['leads'] });
      await refreshProjects();
      
      toast({
        title: "Lead Purchase Successful",
        description: "Your lead list has been updated with your new purchase.",
      });
    } catch (error) {
      console.error('Error refreshing after purchase:', error);
    }
  }, [queryClient, refreshProjects]);
  
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
        leadsCount={filteredProjects.length}
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
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default LeadsTabContent;
