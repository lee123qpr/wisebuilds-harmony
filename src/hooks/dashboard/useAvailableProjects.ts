
import { useState, useEffect } from 'react';
import { useProjectsWithFiltering } from '@/hooks/projects/useProjectsWithFiltering';
import { ProjectLead } from '@/types/projects';

export const useAvailableProjects = () => {
  // Use our hook with filtering disabled (false) to fetch all available projects
  const { projectLeads: projects, isLoading, refreshProjects, error } = useProjectsWithFiltering(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? projects.find(project => project.id === selectedProjectId)
    : projects.length > 0 ? projects[0] : null;
  
  // Set the first project as selected by default when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Handle refresh
  const handleRefresh = async () => {
    console.log('Refreshing projects...');
    try {
      await refreshProjects();
      setLocalError(null);
    } catch (err) {
      console.error('Error refreshing projects:', err);
      setLocalError('Failed to refresh projects. Please try again.');
    }
  };

  return {
    projects,
    isLoading,
    error: error || localError,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    handleRefresh
  };
};
