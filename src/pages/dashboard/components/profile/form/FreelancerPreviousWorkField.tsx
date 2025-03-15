
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { freelancerProfileSchema } from '../freelancerSchema';
import FileUpload from '@/components/projects/FileUpload';
import { UploadedFile } from '@/components/projects/file-upload/types';
import * as z from 'zod';

type FreelancerPreviousWorkFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerPreviousWorkField: React.FC<FreelancerPreviousWorkFieldProps> = ({ form, disabled = false }) => {
  const previousWork = form.watch('previousWork') as UploadedFile[];

  const handleFilesUploaded = (files: UploadedFile[]) => {
    form.setValue('previousWork', files);
  };

  return (
    <FormField
      control={form.control}
      name="previousWork"
      render={() => (
        <FormItem>
          <FormLabel>Examples of Previous Work</FormLabel>
          <div className="mt-2">
            <FileUpload 
              onFilesUploaded={handleFilesUploaded}
              existingFiles={previousWork}
            />
          </div>
          <FormDescription>
            Upload examples of your previous work to showcase your skills and experience
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FreelancerPreviousWorkField;
