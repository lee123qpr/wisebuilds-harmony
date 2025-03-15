
import React, { useState, useEffect } from 'react';
import { Project } from '@/components/projects/useProjects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { LeadPurchaseButton } from '@/components/projects/lead-purchase';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ProjectListSkeleton from './ProjectListSkeleton';
import EmptyProjectState from './EmptyProjectState';
import ProjectCard from './ProjectCard';
import ProjectDetailPlaceholder from './ProjectDetailPlaceholder';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

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
  const [purchasedProjects, setPurchasedProjects] = useState<Record<string, boolean>>({});
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';
  const queryClient = useQueryClient();

  const handlePurchaseSuccess = () => {
    toast({
      title: 'Lead purchased',
      description: 'You can now view the client contact information',
    });
    
    // Refresh purchase status
    setRefreshTrigger(prev => prev + 1);
    
    // Update purchased status for the current project
    if (selectedProject) {
      setPurchasedProjects(prev => ({
        ...prev,
        [selectedProject.id]: true
      }));
    }
    
    // Refresh applications data for the "My Responses" tab
    queryClient.invalidateQueries({ queryKey: ['applications'] });
  };

  useEffect(() => {
    const checkPurchasedProjects = async () => {
      if (!user || !isFreelancer || projects.length === 0) return;
      
      try {
        const projectIds = projects.map(project => project.id);
        const purchasedStatus: Record<string, boolean> = {};
        
        for (const projectId of projectIds) {
          const { data, error } = await supabase.rpc('check_application_exists', {
            p_project_id: projectId,
            p_user_id: user.id
          });
          
          if (error) {
            console.error('Error checking application exists:', error);
            continue;
          }
          
          purchasedStatus[projectId] = data === true;
          console.log(`Project ${projectId} purchased status:`, data);
        }
        
        setPurchasedProjects(purchasedStatus);
      } catch (err) {
        console.error('Error checking purchased projects:', err);
      }
    };
    
    checkPurchasedProjects();
  }, [projects, user, isFreelancer, refreshTrigger]);

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
              isPurchased={purchasedProjects[project.id] || false}
            />
          ))}
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={60}>
        {selectedProject ? (
          <div className="p-6 h-[700px] overflow-auto">
            {isFreelancer && !showContactInfo && !purchasedProjects[selectedProject.id] && (
              <div className="flex justify-end mb-4">
                <LeadPurchaseButton 
                  projectId={selectedProject.id}
                  projectTitle={selectedProject.title}
                  project={selectedProject}
                  purchasesCount={selectedProject.purchases_count || 0}
                  onPurchaseSuccess={handlePurchaseSuccess}
                />
              </div>
            )}
            <ProjectDetails 
              project={selectedProject}
              refreshTrigger={refreshTrigger}
              forceShowContactInfo={showContactInfo || purchasedProjects[selectedProject.id] || false}
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
