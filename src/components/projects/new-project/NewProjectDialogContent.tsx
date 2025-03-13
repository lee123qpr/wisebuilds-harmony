
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ProjectDetails } from './ProjectDetails';
import { LocationField } from '@/components/location/LocationField';
import { StartDateField } from './StartDateField';
import { ProjectRequirements } from './ProjectRequirements';
import { DocumentUpload } from './DocumentUpload';
import { useProjectSubmit } from './useProjectSubmit';
import { projectSchema, ProjectFormValues } from './schema';

interface NewProjectDialogContentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewProjectDialogContent: React.FC<NewProjectDialogContentProps> = ({ setOpen }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      role: '',
      requiresInsurance: false,
      location: '',
      workType: '',
      duration: '',
      budget: '',
      hiringStatus: '',
      requiresSiteVisits: false,
      requiresEquipment: false,
    },
  });

  const { onSubmit, isUploading } = useProjectSubmit(form, selectedFiles, setSelectedFiles, setOpen);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Post a New Project</DialogTitle>
        <DialogDescription>
          Fill in the details below to post a new construction project.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProjectDetails form={form} />
          <LocationField form={form} />
          <StartDateField form={form} />
          <ProjectRequirements form={form} />
          <DocumentUpload 
            form={form} 
            selectedFiles={selectedFiles} 
            setSelectedFiles={setSelectedFiles} 
          />
          
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isUploading || form.formState.isSubmitting}>
              {isUploading || form.formState.isSubmitting ? 
                "Creating..." : 
                "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
