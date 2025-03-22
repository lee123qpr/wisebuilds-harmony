
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const CompletionLoadingIndicator: React.FC = () => {
  return (
    <Button variant="outline" disabled className="gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Checking status...
    </Button>
  );
};

export default CompletionLoadingIndicator;
