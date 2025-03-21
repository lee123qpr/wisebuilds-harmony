
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
    <div className="flex items-center gap-2 mb-4">
      <Briefcase className="h-6 w-6 text-primary" />
      <h2 className="text-2xl font-bold tracking-tight">
        My Hires
      </h2>
      <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
        {totalJobs}
      </Badge>
    </div>
  );
};

export default JobsHeader;
