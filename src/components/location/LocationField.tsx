
import React, { useState, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { useGoogleMapsScript } from './useGoogleMapsScript';
import { useLocationAutocomplete } from './useLocationAutocomplete';
import { LocationPopoverContent } from './LocationPopoverContent';
import { LocationTriggerButton } from './LocationTriggerButton';
import { LocationFieldProps } from './types';

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed (UK and Ireland locations only)'
}) => {
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  
  // Get the current value of the location field from the form
  const selectedLocation = form.watch(name);
  
  // Load Google Maps API
  const { isLoading, isLoaded } = useGoogleMapsScript();
  
  // Setup autocomplete with our custom hook
  useLocationAutocomplete({
    isOpen: locationPopoverOpen,
    isGoogleMapsLoaded: isLoaded,
    inputRef: autocompleteRef,
    onPlaceSelect: (place) => {
      form.setValue(name, place.formatted_address, {
        shouldValidate: true,
        shouldDirty: true
      });
      console.log(`Setting form value for ${name} to:`, place.formatted_address);
      setLocationPopoverOpen(false);
    }
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover 
            open={locationPopoverOpen} 
            onOpenChange={(open) => {
              setLocationPopoverOpen(open);
              // Reset the input field when opening popover
              if (open && autocompleteRef.current) {
                autocompleteRef.current.value = '';
              }
            }}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <LocationTriggerButton 
                  value={field.value}
                  isOpen={locationPopoverOpen}
                />
              </FormControl>
            </PopoverTrigger>
            <LocationPopoverContent 
              inputRef={autocompleteRef}
              isLoading={isLoading}
            />
          </Popover>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
