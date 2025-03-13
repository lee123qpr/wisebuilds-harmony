
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from './schema';
import { hiringStatusOptions } from './constants';

interface ProjectRequirementsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectRequirements: React.FC<ProjectRequirementsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="hiringStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hiring Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select hiring status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {hiringStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Your current hiring intention
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-3">
        <FormLabel>Specific Requirements</FormLabel>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="requiresSiteVisits"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Requires Site Visits</FormLabel>
                  <FormDescription>
                    Check if availability for site visits is required
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requiresEquipment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Equipment Needed</FormLabel>
                  <FormDescription>
                    Check if specific equipment is needed for this project
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};
