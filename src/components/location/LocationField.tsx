
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { LocationFieldProps } from './types';
import { useLocationAutocomplete } from './hooks/useLocationAutocomplete';
import { LocationInput } from './LocationInput';

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed'
}) => {
  const { inputRef, isLoaded, isLoading } = useLocationAutocomplete(form, name);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <LocationInput 
              isLoaded={isLoaded}
              isLoading={isLoading}
              inputRef={inputRef}
              field={field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
