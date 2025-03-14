
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/projects/useProjects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { formatDate, formatBudget } from '@/utils/projectFormatters';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, Briefcase, Clock, Tag } from 'lucide-react';

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
        <CardContent className="py-10 px-6 text-center">
          <h3 className="text-xl font-medium mb-2">No projects available</h3>
          <p className="text-muted-foreground">There are currently no available projects that match your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-white">
      <ResizablePanel defaultSize={40} minSize={30}>
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
      
      <ResizablePanel defaultSize={60}>
        {selectedProject ? (
          <div className="p-6 h-[700px] overflow-auto">
            <ProjectDetails project={selectedProject} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select a project</h3>
            <p className="text-muted-foreground max-w-md">
              Choose a project from the list to view detailed information and requirements
            </p>
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
  // Extract the date part from the created_at timestamp
  const postedDate = formatDate(project.created_at).split(' ')[0];
  
  return (
    <div 
      className={`p-5 cursor-pointer transition-all ${
        isSelected 
          ? 'bg-primary/5 border-l-4 border-primary' 
          : 'hover:bg-muted/50 border-l-4 border-transparent'
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg truncate">{project.title}</h3>
      
      <div className="flex flex-wrap items-center gap-4 mt-2">
        <div className="flex items-center text-muted-foreground">
          <Tag className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatBudget(project.budget)}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{project.location}</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm line-clamp-2 text-muted-foreground">{project.description}</p>
      
      <div className="mt-4 flex gap-2 flex-wrap">
        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          {project.role.replace(/_/g, ' ')}
        </span>
        <span className="bg-muted text-xs px-2 py-1 rounded-full">
          {project.work_type.replace(/_/g, ' ')}
        </span>
      </div>
      
      <div className="mt-3 flex items-center text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 mr-1" />
        <span>Posted {postedDate}</span>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-white">
    <ResizablePanel defaultSize={40} minSize={30}>
      <div className="divide-y h-[700px] overflow-auto p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex gap-4 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
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
    
    <ResizablePanel defaultSize={60}>
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
