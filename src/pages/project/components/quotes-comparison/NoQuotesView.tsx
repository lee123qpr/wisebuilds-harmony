
import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
