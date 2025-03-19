
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface NoQuotesViewProps {
  projectId: string;
  userId?: string;
  directQuotesCount: number | null;
  isRefetching: boolean;
  onRefresh: () => void;
}

const NoQuotesView: React.FC<NoQuotesViewProps> = ({
  projectId,
  userId,
  directQuotesCount,
  isRefetching,
  onRefresh,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Quotes Yet</CardTitle>
        <CardDescription>
          You haven't received any quotes for this project yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          When freelancers submit quotes for your project, they will appear here for comparison.
        </p>
        
        {directQuotesCount !== null && directQuotesCount > 0 && (
          <Alert className="mb-4 border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Inconsistency Detected</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                There {directQuotesCount === 1 ? 'is' : 'are'} {directQuotesCount} quote{directQuotesCount === 1 ? '' : 's'} in the database, 
                but {directQuotesCount === 1 ? 'it is' : 'they are'} not showing up here. 
                This may be due to incorrect client IDs or duplicate IDs.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the diagnostic tools below to fix this issue.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Diagnostic Information</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              <p><strong>Project ID:</strong> {projectId}</p>
              <p><strong>User ID:</strong> {userId}</p>
              <p><strong>Quotes count:</strong> 0</p>
              {directQuotesCount !== null && (
                <p><strong>Direct DB quotes count:</strong> {directQuotesCount}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="default" onClick={onRefresh} disabled={isRefetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh Quotes
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/project/${projectId}`}>Back to Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoQuotesView;
