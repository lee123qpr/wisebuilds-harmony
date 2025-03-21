
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyQuoteStateProps {
  activeTab: string;
}

const EmptyQuoteState: React.FC<EmptyQuoteStateProps> = ({ activeTab }) => {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-center text-muted-foreground">
          No {activeTab} quotes found.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyQuoteState;
