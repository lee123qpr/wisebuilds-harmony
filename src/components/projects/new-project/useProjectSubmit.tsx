
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFormValues } from './schema';
import { generateFilePath } from '../file-upload/utils';

export const useProjectSubmit = (
  form: UseFormReturn<ProjectFormValues>,
  selectedFiles: File[],
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFilesToSupabase = async (projectId: string) => {
    if (!user || selectedFiles.length === 0) return [];
    
    const uploadPromises = selectedFiles.map(async (file) => {
      // Generate appropriate file path for project files
      const filePath = generateFilePath(file, {
        projectId,
        userId: user.id,
        userType: user.user_metadata?.user_type
      });
      
      try {
        console.log(`Starting upload for file: ${file.name} to path: ${filePath}`);
        
        const { data, error } = await supabase.storage
          .from('project-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Upload error:', error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
        
        console.log(`File uploaded successfully: ${data.path}`);
        
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
      console.log(`Attempting to upload ${uploadPromises.length} files...`);
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

      // First create the project to get the ID
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
        documents: null
      };

      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();

      if (projectError) {
        console.error('Database error:', projectError);
        throw new Error(`Database error: ${projectError.message}`);
      }

      // Now upload the files using the project ID
      let documentReferences = [];
      try {
        documentReferences = await uploadFilesToSupabase(newProject.id);
        console.log('Uploaded documents:', documentReferences);
      } catch (uploadError: any) {
        console.error('Error uploading files:', uploadError);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: uploadError.message || 'Failed to upload project documents. Please try again.',
        });
        // Continue with project creation even if file upload fails
      }

      // Update the project with document references if we have any
      if (documentReferences.length > 0) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ documents: documentReferences })
          .eq('id', newProject.id);

        if (updateError) {
          console.error('Error updating project with documents:', updateError);
          // Non-critical error, continue
        }
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
