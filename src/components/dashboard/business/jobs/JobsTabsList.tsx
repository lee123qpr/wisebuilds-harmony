
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface JobsTabsListProps {
  activeJobsCount: number;
  completedJobsCount: number;
}

const JobsTabsList: React.FC<JobsTabsListProps> = ({ activeJobsCount, completedJobsCount }) => {
  return (
    <TabsList>
      <TabsTrigger value="active">
        Active
        <Badge variant="secondary" className="ml-2">
          {activeJobsCount}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="completed">
        Completed
        <Badge variant="secondary" className="ml-2">
          {completedJobsCount}
        </Badge>
      </TabsTrigger>
    </TabsList>
  );
};

export default JobsTabsList;
