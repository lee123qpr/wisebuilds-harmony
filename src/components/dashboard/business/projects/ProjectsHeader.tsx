
import React from 'react';
import { FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NewProjectDialog from '@/components/projects/NewProjectDialog';

interface ProjectsHeaderProps {
  projectCount: number;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ projectCount }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <FolderKanban className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          My Projects
        </h2>
        <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
          {projectCount}
        </Badge>
      </div>
      <NewProjectDialog />
    </div>
  );
};

export default ProjectsHeader;
