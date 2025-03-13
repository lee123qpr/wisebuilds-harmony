
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
import { Skeleton } from '@/components/ui/skeleton';

// Loading skeleton components
const ProjectHeaderSkeleton = () => (
  <div className="flex items-center gap-2 mb-6">
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-8 w-64" />
    <div className="ml-auto">
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

const ProjectDetailsSkeleton = () => (
  <div className="space-y-6 border rounded-lg p-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-60" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
    <Skeleton className="h-px w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
    <Skeleton className="h-px w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-md p-3">
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  </div>
);

const ProjectStatusSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-6">
    <Skeleton className="h-7 w-24" />
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
    <Skeleton className="h-9 w-full" />
  </div>
);

const ProjectDocumentsSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-6">
    <div className="space-y-1">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
    <Skeleton className="h-9 w-full" />
  </div>
);

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

  if (!project && !loading) {
    return (
      <MainLayout>
        <ProjectNotFound />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {loading ? (
          <>
            <ProjectHeaderSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ProjectDetailsSkeleton />
              </div>
              <div className="space-y-6">
                <ProjectStatusSkeleton />
                <ProjectDocumentsSkeleton />
              </div>
            </div>
          </>
        ) : (
          <>
            <ProjectHeader 
              projectId={project!.id} 
              title={project!.title} 
              onDelete={handleDelete} 
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ProjectDetails project={project!} />
              </div>

              <div className="space-y-6">
                <ProjectStatus 
                  projectId={project!.id}
                  status={project!.status}
                  hiringStatus={project!.hiring_status}
                  applicationsCount={project!.applications || 0}
                />

                <ProjectDocuments 
                  projectId={project!.id}
                  documents={project!.documents}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ViewProject;
