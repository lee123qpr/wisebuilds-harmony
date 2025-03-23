
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import CompletionStatusBadge from './CompletionStatusBadge';

interface CardHeaderProps {
  projectTitle: string;
  isFullyCompleted: boolean;
  isPartiallyCompleted: boolean;
}

const JobCardHeader: React.FC<CardHeaderProps> = ({
  projectTitle,
  isFullyCompleted,
  isPartiallyCompleted
}) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <CardTitle className="text-xl">{projectTitle}</CardTitle>
        <CompletionStatusBadge 
          isFullyCompleted={isFullyCompleted} 
          isPartiallyCompleted={isPartiallyCompleted}
        />
      </div>
    </CardHeader>
  );
};

export default JobCardHeader;
