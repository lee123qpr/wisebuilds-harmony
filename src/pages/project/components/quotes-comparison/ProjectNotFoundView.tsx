
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/common/BackButton';

const ProjectNotFoundView: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <BackButton to="/dashboard/business" />
      </div>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist or you don't have access to it.</p>
        <Button className="mt-4" asChild>
          <Link to="/dashboard/business">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectNotFoundView;
