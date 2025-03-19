
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/project/${projectId}/quotes`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
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
