
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { LeadSettingsFormValues } from '../schema';

interface KeywordsFieldProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const KeywordsField: React.FC<KeywordsFieldProps> = ({ form }) => {
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
    <FormField
      control={form.control}
      name="keywords"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Keywords</FormLabel>
          <FormControl>
            <input 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
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
  );
};
