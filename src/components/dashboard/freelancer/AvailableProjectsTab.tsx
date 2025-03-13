
import React, { useState, useEffect } from 'react';
import { useProjects } from '@/components/projects/useProjects';
import ProjectListView from './ProjectListView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AvailableProjectsTab: React.FC = () => {
  const { projects, isLoading, refreshProjects, error } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
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
  const handleRefresh = () => {
    refreshProjects();
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Error Loading Projects</CardTitle>
            <CardDescription>
              There was an error loading projects. Please try again.
            </CardDescription>
          </div>
          <Button onClick={handleRefresh} size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Available Projects</h2>
        <Button onClick={handleRefresh} size="sm" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      <ProjectListView 
        projects={projects}
        isLoading={isLoading}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default AvailableProjectsTab;
