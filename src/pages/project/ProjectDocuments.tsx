import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/projects/FileUpload';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectDocument } from '@/components/projects/useProjects';
import { Json } from '@/integrations/supabase/types';

const ProjectDocuments = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { project, loading } = useProjectDetails(projectId);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Initialize documents from project data when loaded
  React.useEffect(() => {
    if (project && project.documents) {
      setDocuments(project.documents);
    }
  }, [project]);

  const handleFilesUploaded = (files: any[]) => {
    // Convert FileUpload component's files to ProjectDocument format
    const projectDocuments = files.map(file => ({
      id: file.path, // Use the file path as the document ID
      name: file.name,
      url: file.url,
      type: file.type,
    }));
    
    setDocuments(projectDocuments);
  };

  const handleSaveDocuments = async () => {
    if (!projectId) return;
    
    setIsSaving(true);
    
    try {
      // Convert ProjectDocument[] to a plain object/array structure for Json compatibility
      const documentsForJson = documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        url: doc.url,
        type: doc.type,
      }));
      
      const { error } = await supabase
        .from('projects')
        .update({ 
          documents: documentsForJson as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: 'Documents saved',
        description: 'Project documents have been updated successfully.',
      });
      
      // Navigate back to project page
      navigate(`/project/${projectId}`);
    } catch (error: any) {
      console.error('Error saving documents:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save documents',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
          <CardContent className="space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
                <div className="h-40 bg-gray-200 rounded-md"></div>
              </div>
            ) : (
              <>
                <FileUpload 
                  onFilesUploaded={handleFilesUploaded} 
                  existingFiles={project?.documents?.map(doc => ({
                    name: doc.name,
                    size: 0, // Size isn't stored in ProjectDocument
                    type: doc.type || 'application/octet-stream',
                    url: doc.url,
                    path: doc.id,
                  }))}
                />
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/project/${projectId}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveDocuments}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Documents'}
                    {!isSaving && <Save className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProjectDocuments;
