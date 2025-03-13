
import React, { useState, useEffect } from 'react';
import { useProjects } from '@/components/projects/useProjects';
import ProjectListView from './ProjectListView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AvailableProjectsTab: React.FC = () => {
  const { user } = useAuth();
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
    console.log('Manually refreshing projects...');
    refreshProjects();
  };

  console.log('Current projects in AvailableProjectsTab:', projects);
  console.log('Is loading:', isLoading);
  console.log('Error state:', error);
  console.log('User authentication state:', user ? 'Logged in' : 'Not logged in');

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
            <div>
              <CardTitle>Error Loading Projects</CardTitle>
              <CardDescription>
                There was an error loading projects. Please try again.
              </CardDescription>
            </div>
          </div>
          <Button onClick={handleRefresh} size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-destructive font-mono text-sm bg-destructive/10 p-2 rounded">{error}</p>
          <p className="mt-4">This could be due to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Database connection issues</li>
            <li>Authentication problems</li>
            <li>Row Level Security (RLS) policy restrictions</li>
          </ul>
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
      {projects.length === 0 && !isLoading ? (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>No Projects Found</CardTitle>
                <CardDescription>
                  There are currently no projects available. This could be for several reasons:
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>No projects have been created in the system yet</li>
              <li>You may not have the correct permissions to view projects</li>
              <li>Row Level Security (RLS) policies might be restricting access</li>
              <li>Your current authentication state: {user ? `Logged in as ${user.email}` : 'Not logged in'}</li>
              <li>The projects table might be empty</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <Button onClick={handleRefresh} className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
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
