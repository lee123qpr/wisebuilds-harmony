
import React from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JobsHeaderProps {
  activeJobsCount: number;
  completedJobsCount: number;
}

const JobsHeader: React.FC<JobsHeaderProps> = ({ activeJobsCount, completedJobsCount }) => {
  const totalJobs = activeJobsCount + completedJobsCount;
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          My Hires
          <Badge variant="secondary" className="ml-2 text-sm font-medium">
            {totalJobs}
          </Badge>
        </h2>
      </div>
    </div>
  );
};

export default JobsHeader;
