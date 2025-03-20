
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/common/BackButton';

const ProjectNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <BackButton to="/dashboard/business" />
        <h1 className="text-2xl font-bold">Project not found</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">The project you're looking for doesn't exist or you don't have permission to view it.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate('/dashboard/business')}>
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectNotFound;
