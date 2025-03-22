
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormValues } from './schema';

export const useProjectSubmit = (
  form: UseFormReturn<ProjectFormValues>,
  selectedFiles: File[],
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFilesToSupabase = async () => {
    if (!user || selectedFiles.length === 0) return [];
    
    const uploadPromises = selectedFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      // Generate a unique filename to avoid collisions
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('project-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Upload error:', error);
          throw error;
        }
        
        // Get the public URL for the file
        const { data: { publicUrl } } = supabase.storage
          .from('project-documents')
          .getPublicUrl(data.path);
        
        return {
          path: data.path,
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl
        };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    });
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Failed to upload one or more files:', error);
      throw error;
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsUploading(true);
      console.log('Creating new project:', data);
      if (!user) {
        throw new Error('You must be logged in to create a project');
      }

      let documentReferences = [];
      try {
        documentReferences = await uploadFilesToSupabase();
        console.log('Uploaded documents:', documentReferences);
      } catch (uploadError) {
        console.error('Error uploading files:', uploadError);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: 'Failed to upload project documents. Please try again.',
        });
        setIsUploading(false);
        return;
      }

      const projectData = {
        user_id: user.id,
        title: data.title,
        description: data.description,
        role: data.role,
        requires_insurance: data.requiresInsurance,
        location: data.location,
        work_type: data.workType,
        duration: data.duration,
        budget: data.budget,
        start_date: data.startDate.toISOString(),
        hiring_status: data.hiringStatus,
        requires_site_visits: data.requiresSiteVisits,
        requires_equipment: data.requiresEquipment,
        status: 'active',
        documents: documentReferences.length > 0 ? documentReferences : null
      };

      const { error } = await supabase
        .from('projects')
        .insert(projectData);

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Project created',
        description: 'Your project was successfully posted.',
      });
      
      form.reset();
      setSelectedFiles([]);
      setOpen(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create project. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { onSubmit, isUploading };
};
