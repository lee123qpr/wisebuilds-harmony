
import React, { useState, useEffect } from 'react';
import { useProjects } from '@/components/projects/useProjects';
import ProjectListView from './ProjectListView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Info, Briefcase, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AvailableProjectsTab: React.FC = () => {
  const { user } = useAuth();
  const { projects, isLoading, refreshProjects, error } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [insertError, setInsertError] = useState<string | null>(null);
  
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
    console.log('Manually refreshing projects...');
    refreshProjects();
  };

  console.log('Current projects in AvailableProjectsTab:', projects);
  console.log('Is loading:', isLoading);
  console.log('Error state:', error);
  console.log('User authentication state:', user ? 'Logged in' : 'Not logged in');

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
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
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
      
      {insertError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Permission Error</AlertTitle>
          <AlertDescription>{insertError}</AlertDescription>
        </Alert>
      )}
      
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
          projects={projects}
          isLoading={isLoading}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default AvailableProjectsTab;
