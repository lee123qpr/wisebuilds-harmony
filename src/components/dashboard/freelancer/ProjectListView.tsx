
import React from 'react';
import { Project } from '@/components/projects/useProjects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ProjectListSkeleton from './ProjectListSkeleton';
import EmptyProjectState from './EmptyProjectState';
import ProjectCard from './ProjectCard';
import ProjectDetailPlaceholder from './ProjectDetailPlaceholder';

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
    return <ProjectListSkeleton />;
  }

  if (projects.length === 0) {
    return <EmptyProjectState />;
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
          <ProjectDetailPlaceholder />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProjectListView;
