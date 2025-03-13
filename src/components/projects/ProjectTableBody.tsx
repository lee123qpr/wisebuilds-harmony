
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

  // Function to format role
  const formatRole = (role: string) => {
    // Replace underscores with spaces and capitalize each word
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to format budget
  const formatBudget = (budget: string) => {
    if (budget === '1000_to_5000') return '£1,000 - £5,000';
    if (budget === '5000_to_10000') return '£5,000 - £10,000';
    if (budget === '10000_plus') return '£10,000+';
    if (budget === 'under_1000') return 'Under £1,000';
    return budget
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
            <ProjectActions applications={project.applications} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProjectTableBody;
