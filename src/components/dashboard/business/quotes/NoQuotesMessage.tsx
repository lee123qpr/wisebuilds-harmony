
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NoQuotesMessage: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          You don't have any quotes yet. When freelancers submit quotes for your projects, they'll appear here.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoQuotesMessage;
