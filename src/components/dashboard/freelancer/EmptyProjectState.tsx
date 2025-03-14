
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyProjectState: React.FC = () => (
  <Card>
    <CardContent className="py-10 px-6 text-center">
      <h3 className="text-xl font-medium mb-2">No projects available</h3>
      <p className="text-muted-foreground">There are currently no available projects that match your criteria.</p>
    </CardContent>
  </Card>
);

export default EmptyProjectState;
