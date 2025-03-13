
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { ProjectFormValues, projectSchema } from './components/schema';
import ProjectForm from './components/ProjectForm';
import ProjectLoadingSkeleton from './components/ProjectLoadingSkeleton';

const EditProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { project, loading } = useProjectDetails(projectId);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      role: '',
      location: '',
      work_type: 'remote',
      duration: 'less_than_1_week',
      budget: 'less_than_1000',
      hiring_status: 'enquiring',
      requires_insurance: false,
      requires_site_visits: false,
      requires_equipment: false,
      start_date: '',
    },
  });

  // Update form values when project data is loaded
  React.useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        role: project.role,
        location: project.location,
        work_type: project.work_type,
        duration: project.duration,
        budget: project.budget,
        hiring_status: project.hiring_status || 'enquiring',
        requires_insurance: project.requires_insurance,
        requires_site_visits: project.requires_site_visits,
        requires_equipment: project.requires_equipment,
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : undefined,
      });
    }
  }, [project, form]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setSubmitting(true);
      
      if (!projectId) {
        throw new Error('Project ID is missing');
      }
      
      const { error } = await supabase
        .from('projects')
        .update({
          title: values.title,
          description: values.description,
          role: values.role,
          location: values.location,
          work_type: values.work_type,
          duration: values.duration,
          budget: values.budget,
          hiring_status: values.hiring_status,
          requires_insurance: values.requires_insurance,
          requires_site_visits: values.requires_site_visits,
          requires_equipment: values.requires_equipment,
          start_date: values.start_date ? new Date(values.start_date).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: 'Project updated',
        description: 'The project has been updated successfully.',
      });
      
      navigate(`/project/${projectId}`);
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating project',
        description: error.message || 'Failed to update project',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/project/${projectId}`)}
            disabled={submitting}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Project</h1>
        </div>

        {loading ? (
          <ProjectLoadingSkeleton />
        ) : (
          <ProjectForm 
            form={form} 
            onSubmit={onSubmit}
            submitting={submitting}
            projectId={projectId}
            navigate={navigate}
          />
        )}
      </div>
    </MainLayout>
  );
};

// This import is below to avoid circular imports
import { supabase } from '@/integrations/supabase/client';

export default EditProject;
