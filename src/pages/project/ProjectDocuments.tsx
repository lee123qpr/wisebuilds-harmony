
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectDocuments = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/project/${projectId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Project Documents</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Documents</CardTitle>
            <CardDescription>Upload, view, and delete project documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              Document management interface will be implemented here.
            </p>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => navigate(`/project/${projectId}`)}>
                Back to Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProjectDocuments;
