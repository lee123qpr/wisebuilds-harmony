
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AvailableProjectsTab: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <Card key={item}>
          <CardHeader>
            <CardTitle>Kitchen Renovation in Manchester</CardTitle>
            <CardDescription>Posted 2 days ago · £2,000-£3,500</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Looking for an experienced contractor to renovate a kitchen in a Victorian home.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-muted text-xs px-2 py-1 rounded-full">Plumbing</span>
              <span className="bg-muted text-xs px-2 py-1 rounded-full">Tiling</span>
              <span className="bg-muted text-xs px-2 py-1 rounded-full">Carpentry</span>
            </div>
            <Button className="w-full">Apply Now</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailableProjectsTab;
