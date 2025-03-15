
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Project } from '@/components/projects/useProjects';
import ProjectDescription from './ProjectDescription';
import ProjectMetadata from './ProjectMetadata';
import ProjectRequirements from './ProjectRequirements';
import { useAuth } from '@/context/AuthContext';
import ClientContactInfo from './ClientContactInfo';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const [hasBeenPurchased, setHasBeenPurchased] = useState(false);
  const { user } = useAuth();
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';

  const handlePurchaseSuccess = () => {
    setHasBeenPurchased(true);
  };

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
        {hasBeenPurchased && (
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
