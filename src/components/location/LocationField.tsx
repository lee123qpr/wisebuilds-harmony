
import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { useGoogleMapsScript } from './useGoogleMapsScript';
import { useLocationAutocomplete } from './useLocationAutocomplete';
import { LocationPopoverContent } from './LocationPopoverContent';
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
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationPopoverOpen}
                  className="w-full justify-between"
                  type="button"
                >
                  {field.value ? (
                    <span className="flex items-center truncate">
                      <MapPin className="mr-2 h-4 w-4 shrink-0" />
                      {field.value}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select location...</span>
                  )}
                  <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
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

// Add this for window type extension
declare global {
  interface Window {
    google?: any;
  }
}
