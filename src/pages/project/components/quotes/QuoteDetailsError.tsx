
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuoteDetailsHeader from './QuoteDetailsHeader';

interface QuoteDetailsErrorProps {
  projectId: string;
}

const QuoteDetailsError: React.FC<QuoteDetailsErrorProps> = ({ projectId }) => {
  return (
    <>
      <QuoteDetailsHeader 
        projectId={projectId} 
        projectTitle={undefined}
      />
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Quote</CardTitle>
          <CardDescription>
            The quote could not be found or you don't have permission to view it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to={`/project/${projectId}/quotes`}>Back to Quotes</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default QuoteDetailsError;
