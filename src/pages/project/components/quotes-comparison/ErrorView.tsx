
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorViewProps {
  projectId: string;
  error: Error | null;
  onRefresh: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ projectId, error, onRefresh }) => {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Quotes Comparison</h1>
      </div>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load quotes. Please try refreshing the page.
          {error instanceof Error ? ` Error: ${error.message}` : ''}
        </AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorView;
