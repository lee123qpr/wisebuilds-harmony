
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CompletionLoadingCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Status</CardTitle>
        <CardDescription>Loading status...</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CompletionLoadingCard;
