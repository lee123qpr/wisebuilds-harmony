
import React from 'react';
import { FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/components/projects/useProjects';

interface ProjectsHeaderProps {
  projectCount?: number;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ projectCount }) => {
  const { projects } = useProjects();
  
  // Use the projectCount prop if provided, otherwise use the actual length of projects array
  const displayCount = projectCount !== undefined ? projectCount : (projects ? projects.length : 0);
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <FolderKanban className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          My Projects
        </h2>
        <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
          {displayCount}
        </Badge>
      </div>
    </div>
  );
};

export default ProjectsHeader;
