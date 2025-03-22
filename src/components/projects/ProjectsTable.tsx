
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/components/projects/useProjects';
import ProjectCardHorizontal from './ProjectCardHorizontal';

const ProjectsTable = () => {
  const { 
    projects, 
    isLoading, 
    refreshProjects
  } = useProjects();

  // Refresh projects data periodically with a longer interval
  useEffect(() => {
    // Initial load is handled by useProjects
    
    // Set up a longer refresh interval - 60 seconds instead of 15
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing projects (60s interval)');
      refreshProjects();
    }, 60000); // Refresh every 60 seconds instead of 15
    
    return () => clearInterval(intervalId);
  }, [refreshProjects]);

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          You don't have any projects yet. Create your first project to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCardHorizontal key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
