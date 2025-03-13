
import React, { useState } from 'react';
import { useProjects } from '@/components/projects/useProjects';
import ProjectListView from './ProjectListView';

const AvailableProjectsTab: React.FC = () => {
  const { projects, isLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? projects.find(project => project.id === selectedProjectId)
    : projects.length > 0 ? projects[0] : null;
  
  // Set the first project as selected by default when projects load
  React.useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  return (
    <ProjectListView 
      projects={projects}
      isLoading={isLoading}
      selectedProjectId={selectedProjectId}
      setSelectedProjectId={setSelectedProjectId}
      selectedProject={selectedProject}
    />
  );
};

export default AvailableProjectsTab;
