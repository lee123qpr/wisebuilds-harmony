
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProjectFormValues } from './schema';
import { LocationField } from '@/components/projects/new-project/LocationField';

const ProjectDetailsFields: React.FC<{ form: UseFormReturn<ProjectFormValues> }> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter project title" {...field} />
            </FormControl>
            <FormDescription>A clear and concise title for your project</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project in detail..." 
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description of the project, including goals and requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service/Role Required</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Architect, Surveyor, etc." {...field} />
            </FormControl>
            <FormDescription>
              Specify the type of professional or service you need
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <LocationField form={form} />
      
      <FormField
        control={form.control}
        name="work_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Work Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on_site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Specify if the work can be done remotely, on-site, or a mix of both
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectDetailsFields;
