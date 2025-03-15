
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadSettingsFormValues } from '../schema';
import { budgetOptions, durationOptions } from '@/components/projects/new-project/constants';

interface BudgetDurationFieldsProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const BudgetDurationFields: React.FC<BudgetDurationFieldsProps> = ({ form }) => {
  console.log('Budget field value:', form.watch('budget'));
  console.log('Duration field value:', form.watch('duration'));
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Budget</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined} 
              defaultValue={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {budgetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The budget range you're looking for
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined} 
              defaultValue={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Your preferred project duration
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
