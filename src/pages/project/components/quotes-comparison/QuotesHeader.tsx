
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuotesHeaderProps {
  projectId: string;
  projectTitle?: string;
  isRefetching: boolean;
  onRefresh: () => void;
}

const QuotesHeader: React.FC<QuotesHeaderProps> = ({ 
  projectId, 
  projectTitle, 
  isRefetching, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quotes Comparison</h1>
          <p className="text-muted-foreground">Project: {projectTitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh Quotes
        </Button>
      </div>
    </div>
  );
};

export default QuotesHeader;
