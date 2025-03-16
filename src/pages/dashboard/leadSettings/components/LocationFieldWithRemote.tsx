
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadSettingsFormValues } from '../schema';
import { LocationField } from '@/components/location/LocationField';

interface LocationFieldWithRemoteProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const LocationFieldWithRemote: React.FC<LocationFieldWithRemoteProps> = ({ form }) => {
  const [locationType, setLocationType] = useState<'specific' | 'any'>(() => {
    // Initialize based on current form value
    return form.getValues().location === 'Any' ? 'any' : 'specific';
  });

  const handleLocationTypeChange = (value: 'specific' | 'any') => {
    setLocationType(value);
    
    // If "Any" is selected, update the form value
    if (value === 'any') {
      form.setValue('location', 'Any', { shouldValidate: true });
    } else if (form.getValues().location === 'Any') {
      // If switching from "Any" to specific, clear the field
      form.setValue('location', '', { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel className="mb-2 block">Location Type</FormLabel>
        <Select
          value={locationType}
          onValueChange={(value) => handleLocationTypeChange(value as 'specific' | 'any')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="specific">Specific Location</SelectItem>
            <SelectItem value="any">Any Location (Remote)</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground mt-1">
          Select "Any Location" if you're willing to work remotely
        </div>
      </div>

      {locationType === 'specific' ? (
        <LocationField 
          form={form} 
          name="location"
          label="Location"
          description="Where you want to work"
        />
      ) : (
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <input
                  type="text"
                  readOnly
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100"
                  value="Any"
                  {...field}
                />
              </FormControl>
              <FormDescription>Remote work - any location accepted</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
