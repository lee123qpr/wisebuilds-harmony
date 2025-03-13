
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/projects/useProjects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { formatDate, formatBudget } from '@/utils/projectFormatters';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectListViewProps {
  projects: Project[];
  isLoading: boolean;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | null;
}

const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  isLoading,
  selectedProjectId,
  setSelectedProjectId,
  selectedProject
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No projects available</CardTitle>
          <CardDescription>There are currently no available projects that match your criteria.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={33} minSize={25}>
        <div className="divide-y h-[700px] overflow-auto">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={project.id === selectedProjectId}
              onClick={() => setSelectedProjectId(project.id)}
            />
          ))}
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={67}>
        {selectedProject ? (
          <div className="p-6 h-[700px] overflow-auto">
            <ProjectDetails project={selectedProject} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a project to view details</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected, onClick }) => {
  return (
    <div 
      className={`p-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-muted' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <h3 className="font-medium text-lg truncate">{project.title}</h3>
      <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
        <span>{formatBudget(project.budget)}</span>
        <span>•</span>
        <span>{project.location}</span>
      </div>
      <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
      <div className="mt-2 flex gap-2 flex-wrap">
        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          {project.role.replace(/_/g, ' ')}
        </span>
        <span className="bg-muted text-xs px-2 py-1 rounded-full">
          {project.work_type.replace(/_/g, ' ')}
        </span>
        <span className="bg-muted text-xs px-2 py-1 rounded-full">
          Posted {formatDate(project.created_at).split(' ')[0]}
        </span>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
    <ResizablePanel defaultSize={33} minSize={25}>
      <div className="divide-y h-[700px] overflow-auto p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </ResizablePanel>
    
    <ResizableHandle withHandle />
    
    <ResizablePanel defaultSize={67}>
      <div className="p-6 h-[700px] overflow-auto space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
);

export default ProjectListView;
