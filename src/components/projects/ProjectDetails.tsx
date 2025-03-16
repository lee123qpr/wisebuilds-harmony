
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Project } from '@/components/projects/useProjects';
import ProjectDescription from './ProjectDescription';
import ProjectMetadata from './ProjectMetadata';
import ProjectRequirements from './ProjectRequirements';
import { useAuth } from '@/context/AuthContext';
import ClientContactInfo from './ClientContactInfo';
import { supabase } from '@/integrations/supabase/client';

interface ProjectDetailsProps {
  project: Project;
  refreshTrigger?: number;
  forceShowContactInfo?: boolean;
}

const ProjectDetails = ({ project, refreshTrigger = 0, forceShowContactInfo = false }: ProjectDetailsProps) => {
  const [hasBeenPurchased, setHasBeenPurchased] = useState(false);
  const { user } = useAuth();
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';

  // Check if the user has already applied to this project
  useEffect(() => {
    const checkIfApplicationExists = async () => {
      if (!user || !isFreelancer) return;
      
      try {
        const { data, error } = await supabase.rpc('check_application_exists', {
          p_project_id: project.id,
          p_user_id: user.id
        });
        
        if (error) {
          console.error('Error checking application exists:', error);
          return;
        }
        
        setHasBeenPurchased(data === true);
      } catch (err) {
        console.error('Error in check_application_exists:', err);
      }
    };
    
    checkIfApplicationExists();
  }, [project.id, user, isFreelancer, refreshTrigger]);

  const shouldShowContactInfo = forceShowContactInfo || hasBeenPurchased;

  return (
    <Card>
      <CardHeader>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Project Details</h2>
          <p className="text-muted-foreground">All information about this project</p>
        </div>
        <div className="flex justify-between items-start">
          <CardTitle>{project.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {shouldShowContactInfo && (
          <>
            <ClientContactInfo projectId={project.id} />
            <Separator />
          </>
        )}
        
        <ProjectDescription description={project.description} />
        
        <Separator />
        
        <ProjectMetadata
          created_at={project.created_at}
          start_date={project.start_date}
          role={project.role}
          budget={project.budget}
          duration={project.duration}
          location={project.location}
          work_type={project.work_type}
        />
        
        <Separator />
        
        <ProjectRequirements
          requires_insurance={project.requires_insurance}
          requires_equipment={project.requires_equipment}
          requires_site_visits={project.requires_site_visits}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
