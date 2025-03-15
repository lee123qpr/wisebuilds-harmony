
import React, { useState } from 'react';
import { Project } from '@/components/projects/useProjects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import LeadPurchaseButton from '@/components/projects/LeadPurchaseButton';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ProjectListSkeleton from './ProjectListSkeleton';
import EmptyProjectState from './EmptyProjectState';
import ProjectCard from './ProjectCard';
import ProjectDetailPlaceholder from './ProjectDetailPlaceholder';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProjectListViewProps {
  projects: Project[];
  isLoading: boolean;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | null;
  showContactInfo?: boolean;
}

const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  isLoading,
  selectedProjectId,
  setSelectedProjectId,
  selectedProject,
  showContactInfo = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';

  const handlePurchaseSuccess = () => {
    toast({
      title: 'Lead purchased',
      description: 'You can now view the client contact information',
    });
    setRefreshTrigger(prev => prev + 1);
  };

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
            {isFreelancer && !showContactInfo && (
              <div className="flex justify-end mb-4">
                <LeadPurchaseButton 
                  projectId={selectedProject.id}
                  projectTitle={selectedProject.title}
                  onPurchaseSuccess={handlePurchaseSuccess}
                />
              </div>
            )}
            <ProjectDetails 
              project={selectedProject}
              refreshTrigger={refreshTrigger}
              forceShowContactInfo={showContactInfo}
            />
          </div>
        ) : (
          <ProjectDetailPlaceholder />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProjectListView;
