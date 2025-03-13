
import React from 'react';
import { TableRow, TableCell, TableBody } from '@/components/ui/table';
import ProjectStatusBadge from './ProjectStatusBadge';
import HiringStatusBadge from './HiringStatusBadge';
import ProjectActions from './ProjectActions';
import { format } from 'date-fns';

type Project = {
  id: string;
  title: string;
  created_at: string;
  role: string;
  budget: string;
  status: string;
  hiring_status: string;
  applications: number;
};

type ProjectTableBodyProps = {
  projects: Project[];
  isLoading: boolean;
};

const ProjectTableBody = ({ projects, isLoading }: ProjectTableBodyProps) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
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
          <TableCell>{project.role}</TableCell>
          <TableCell>{project.budget}</TableCell>
          <TableCell>
            <ProjectStatusBadge status={project.status} />
          </TableCell>
          <TableCell>
            <HiringStatusBadge status={project.hiring_status} />
          </TableCell>
          <TableCell>{project.applications}</TableCell>
          <TableCell className="text-right">
            <ProjectActions applications={project.applications} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProjectTableBody;
