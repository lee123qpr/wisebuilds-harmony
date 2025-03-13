
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/projects/useProjects';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectDetails from '@/components/projects/ProjectDetails';
import ProjectStatus from '@/components/projects/ProjectStatus';
import ProjectDocuments from '@/components/projects/ProjectDocuments';
import ProjectNotFound from '@/components/projects/ProjectNotFound';

const ViewProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        // Parse documents field if it exists
        const projectWithDocuments = {
          ...data,
          documents: Array.isArray(data.documents) 
            ? data.documents 
            : (data.documents ? JSON.parse(String(data.documents)) : [])
        } as Project;
        
        setProject(projectWithDocuments);
      } catch (error: any) {
        console.error('Error fetching project:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching project',
          description: error.message || 'Failed to fetch project details'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  const handleDelete = async () => {
    try {
      if (!projectId) return;

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });

      navigate('/dashboard/business');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        variant: 'destructive',
        title: "Error deleting project",
        description: error.message || "There was an error deleting the project.",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold">Loading project...</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <ProjectNotFound />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <ProjectHeader 
          projectId={project.id} 
          title={project.title} 
          onDelete={handleDelete} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProjectDetails project={project} />
          </div>

          <div className="space-y-6">
            <ProjectStatus 
              projectId={project.id}
              status={project.status}
              hiringStatus={project.hiring_status}
              applicationsCount={project.applications || 0}
            />

            <ProjectDocuments 
              projectId={project.id}
              documents={project.documents}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewProject;
