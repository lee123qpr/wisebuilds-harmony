
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import QuoteStatusBadge from '@/components/quotes/table/QuoteStatusBadge';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';
import { Quote } from '@/types/quotes';

interface ProjectHeaderProps {
  project: any;
  quoteStatus: string | undefined;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, quoteStatus }) => {
  // Ensure the quoteStatus is a valid value for QuoteStatusBadge
  const validQuoteStatus = quoteStatus as Quote['status'] | undefined;
  
  return (
    <div className="flex flex-wrap justify-between items-start gap-2">
      <CardTitle className="text-xl">{project.title}</CardTitle>
      <div className="flex items-center gap-2">
        {validQuoteStatus && <QuoteStatusBadge status={validQuoteStatus} />}
        <HiringStatusBadge status={project.hiring_status} />
      </div>
    </div>
  );
};

export default ProjectHeader;
