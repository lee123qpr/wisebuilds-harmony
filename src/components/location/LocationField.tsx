
import React, { useState, useRef, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { useGoogleMapsScript } from './useGoogleMapsScript';
import { useLocationAutocomplete } from './useLocationAutocomplete';
import { LocationPopoverContent } from './LocationPopoverContent';
import { LocationTriggerButton } from './LocationTriggerButton';
import { LocationFieldProps } from './types';
import { useToast } from '@/hooks/use-toast';

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed (UK and Ireland locations only)'
}) => {
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Get the current value of the location field from the form
  const selectedLocation = form.watch(name);
  
  // Load Google Maps API
  const { isLoading, isLoaded } = useGoogleMapsScript();
  
  // Log when component mounts and when Google Maps loads
  useEffect(() => {
    console.log('LocationField mounted, Google Maps loaded:', isLoaded);
    
    if (isLoaded) {
      console.log('Google Maps API is loaded and ready');
    }
  }, [isLoaded]);
  
  // Handle manual closing on selection
  const handlePlaceSelect = (place: { formatted_address: string }) => {
    if (place && place.formatted_address) {
      form.setValue(name, place.formatted_address, {
        shouldValidate: true,
        shouldDirty: true
      });
      console.log(`Setting form value for ${name} to:`, place.formatted_address);
      
      toast({
        title: "Location Selected",
        description: `Selected ${place.formatted_address}`,
      });
      
      // Close the popover after selection
      setLocationPopoverOpen(false);
    }
  };
  
  // Setup autocomplete with our custom hook
  useLocationAutocomplete({
    isOpen: locationPopoverOpen,
    isGoogleMapsLoaded: isLoaded,
    inputRef: autocompleteRef,
    onPlaceSelect: handlePlaceSelect
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
              console.log('Popover open state changing to:', open);
              // Only allow opening via button click, manual closing is still allowed
              if (open) {
                setLocationPopoverOpen(true);
                // Wait for the popover to open before focusing on the input
                setTimeout(() => {
                  if (autocompleteRef.current) {
                    autocompleteRef.current.focus();
                  }
                }, 200);
              } else {
                setLocationPopoverOpen(false);
              }
            }}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <LocationTriggerButton 
                  value={field.value}
                  isOpen={locationPopoverOpen}
                  onClick={() => {
                    console.log('Location trigger button clicked');
                    setLocationPopoverOpen(true);
                  }}
                />
              </FormControl>
            </PopoverTrigger>
            <LocationPopoverContent 
              inputRef={autocompleteRef}
              isLoading={isLoading && !isLoaded}
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
