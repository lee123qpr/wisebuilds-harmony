
import React from 'react';
import BackButton from '@/components/common/BackButton';

interface QuoteDetailsHeaderProps {
  projectId: string;
  projectTitle: string | undefined;
}

const QuoteDetailsHeader: React.FC<QuoteDetailsHeaderProps> = ({ 
  projectId, 
  projectTitle 
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <BackButton to={`/project/${projectId}/quotes`} />
      <div>
        <h1 className="text-2xl font-bold">Quote Details</h1>
        <p className="text-muted-foreground">
          Project: {projectTitle || 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default QuoteDetailsHeader;
