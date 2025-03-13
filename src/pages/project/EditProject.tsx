
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EditProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/project/${projectId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Project</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Update your project details</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              Edit project form will be implemented here.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => navigate(`/project/${projectId}`)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditProject;
