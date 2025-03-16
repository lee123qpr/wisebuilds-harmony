
import React from 'react';
import { TableRow, TableCell, TableBody } from '@/components/ui/table';
import ProjectStatusBadge from './ProjectStatusBadge';
import HiringStatusBadge from './HiringStatusBadge';
import ProjectActions from './ProjectActions';
import { format } from 'date-fns';
import { Project } from './useProjects';
import { formatBudget } from '@/utils/projectFormatters';

type ProjectTableBodyProps = {
  projects: Project[];
  isLoading: boolean;
  refreshProjects: () => Promise<void>;
};

const ProjectTableBody = ({ projects, isLoading, refreshProjects }: ProjectTableBodyProps) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  // Function to format role
  const formatRole = (role: string) => {
    // Replace underscores with spaces and capitalize each word
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8">
            Loading projects...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (projects.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
            No projects found. Try adjusting your filters or create a new project.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {projects.map((project) => (
        <TableRow key={project.id}>
          <TableCell className="font-medium">{project.title}</TableCell>
          <TableCell>{formatDate(project.created_at)}</TableCell>
          <TableCell>{formatRole(project.role)}</TableCell>
          <TableCell>{formatBudget(project.budget)}</TableCell>
          <TableCell>
            <ProjectStatusBadge status={project.status} />
          </TableCell>
          <TableCell>
            <HiringStatusBadge status={project.hiring_status} />
          </TableCell>
          <TableCell>{project.applications}</TableCell>
          <TableCell className="text-right">
            <ProjectActions 
              applications={project.applications} 
              projectId={project.id}
              hasDocuments={project.documents && project.documents.length > 0}
              refreshProjects={refreshProjects}
              projectTitle={project.title}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProjectTableBody;
