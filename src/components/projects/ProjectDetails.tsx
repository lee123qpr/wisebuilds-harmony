
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Project } from '@/components/projects/useProjects';
import ProjectDescription from './ProjectDescription';
import ProjectMetadata from './ProjectMetadata';
import ProjectRequirements from './ProjectRequirements';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>All information about this project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
