
import React, { useEffect } from 'react';
import { useProjectsWithFiltering } from '@/hooks/projects/useProjectsWithFiltering';
import ProjectListView from '@/components/dashboard/freelancer/ProjectListView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Info, Briefcase } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { ProjectLead } from '@/types/projects';

const AvailableTabContent: React.FC = () => {
  // Use our hook with filtering disabled (false) to fetch all available projects
  const { projectLeads: projects, isLoading, refreshProjects } = useProjectsWithFiltering(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Debug logging
  useEffect(() => {
    console.log('Available projects:', projects);
    console.log('Is loading:', isLoading);
  }, [projects, isLoading]);
  
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
    } catch (err) {
      console.error('Error refreshing projects:', err);
      setError('Failed to refresh projects. Please try again.');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
          <div>
            <AlertTitle className="text-lg font-semibold">Error Loading Projects</AlertTitle>
            <AlertDescription className="mt-1">
              <p>{error}</p>
              <div className="mt-4 flex">
                <Button onClick={handleRefresh} size="sm" variant="outline" className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Available Projects</h2>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline" 
            className="flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {projects.length === 0 && !isLoading ? (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>No Projects Found</CardTitle>
                <CardDescription>
                  There are currently no projects available.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={handleRefresh} className="mt-4 flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" /> Check for New Projects
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectListView 
          projects={projects as any}
          isLoading={isLoading}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as any}
        />
      )}
    </div>
  );
};

export default AvailableTabContent;
