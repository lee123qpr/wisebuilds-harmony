
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import QuoteStatusBadge from '@/components/quotes/table/QuoteStatusBadge';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';

interface ProjectHeaderProps {
  project: any;
  quoteStatus: string | undefined;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, quoteStatus }) => {
  return (
    <div className="flex flex-wrap justify-between items-start gap-2">
      <CardTitle className="text-xl">{project.title}</CardTitle>
      <div className="flex items-center gap-2">
        {quoteStatus && <QuoteStatusBadge status={quoteStatus} />}
        <HiringStatusBadge status={project.hiring_status} />
      </div>
    </div>
  );
};

export default ProjectHeader;
