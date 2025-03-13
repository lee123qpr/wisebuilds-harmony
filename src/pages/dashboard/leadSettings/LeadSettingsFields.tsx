
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadSettingsFormValues } from './schema';
import { LocationField } from '@/components/location/LocationField';
import { roleOptions, workTypeOptions } from '@/components/projects/new-project/constants';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const LeadSettingsFields: React.FC<{ form: UseFormReturn<LeadSettingsFormValues> }> = ({ form }) => {
  const addKeyword = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (event.key === 'Enter' && input.value) {
      event.preventDefault();
      const currentKeywords = form.getValues('keywords') || [];
      const newKeyword = input.value.trim();
      
      if (newKeyword && !currentKeywords.includes(newKeyword)) {
        form.setValue('keywords', [...currentKeywords, newKeyword]);
        input.value = '';
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    const currentKeywords = form.getValues('keywords') || [];
    form.setValue(
      'keywords',
      currentKeywords.filter(k => k !== keyword)
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role Required</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select required role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the role you're interested in
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <LocationField 
        form={form} 
        name="location"
        label="Location"
        description="Where you want to work (UK and Ireland locations only)"
      />
      
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
                {workTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Specify if you prefer remote, on-site, or hybrid work
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="max_budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Budget</FormLabel>
            <FormControl>
              <Input placeholder="e.g. £5,000" {...field} />
            </FormControl>
            <FormDescription>
              The maximum budget you're looking for (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keywords</FormLabel>
            <FormControl>
              <Input 
                placeholder="Type keyword and press Enter" 
                onKeyDown={addKeyword}
              />
            </FormControl>
            <FormDescription>
              Add keywords related to projects you're interested in
            </FormDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {(field.value || []).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LeadSettingsFields;
