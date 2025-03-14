
import React, { useRef, useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { LocationFieldProps } from './types';
import { useGoogleMapsScript } from './useGoogleMapsScript';
import { useToast } from '@/hooks/use-toast';

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed'
}) => {
  // Explicitly type the ref as HTMLInputElement
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded, isLoading, error } = useGoogleMapsScript();
  const { toast } = useToast();
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  const [placesListener, setPlacesListener] = useState<google.maps.MapsEventListener | null>(null);
  
  // Set up the autocomplete when Google Maps is loaded
  useEffect(() => {
    // Exit early if Google Maps is not loaded or input doesn't exist
    if (!isLoaded || !inputRef.current) return;
    
    try {
      console.log('Setting up Places Autocomplete');
      
      // Create the autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        types: ['geocode', 'establishment'] // Allow geocoded locations and establishments
      });
      
      setAutocompleteInstance(autocomplete);
      
      // Add the place_changed event listener
      const listener = window.google.maps.event.addListener(
        autocomplete, 
        'place_changed', 
        () => {
          const place = autocomplete.getPlace();
          console.log('Selected place:', place);
          
          if (place && place.formatted_address) {
            console.log('Selected address:', place.formatted_address);
            form.setValue(name, place.formatted_address, { 
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
          } else if (place && place.name) {
            // Fallback to place name if no formatted address is available
            console.log('Using place name as address:', place.name);
            form.setValue(name, place.name, { 
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
          } else {
            console.warn('No address found in selected place');
            toast({
              title: 'Location not found',
              description: 'Please select a location from the dropdown.'
            });
          }
        }
      );
      
      setPlacesListener(listener);
      
      // Return cleanup function
      return () => {
        if (listener) {
          console.log('Cleaning up Google Maps event listener');
          window.google.maps.event.removeListener(listener);
          setPlacesListener(null);
        }
      };
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Error initializing location search',
        description: 'Please try again or enter location manually.'
      });
    }
  }, [isLoaded, form, name, toast]);

  // Clean up the autocomplete instance and listener on unmount
  useEffect(() => {
    return () => {
      if (placesListener) {
        console.log('Cleaning up Places listener on unmount');
        placesListener.remove();
      }
      
      if (autocompleteInstance) {
        // Additional cleanup if needed
      }
    };
  }, [autocompleteInstance, placesListener]);

  // Handle script loading error
  useEffect(() => {
    if (error) {
      console.error('Google Maps script loading error:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading location service',
        description: 'Please refresh the page or enter location manually.'
      });
    }
  }, [error, toast]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {isLoading ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              ) : (
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                placeholder={isLoaded ? "Enter any location" : "Loading location service..."}
                className="pl-9"
                disabled={isLoading && !isLoaded}
                autoComplete="off"
                {...field}
                ref={(el) => {
                  inputRef.current = el;
                  
                  // Handle react-hook-form's ref properly with type assertion
                  if (typeof field.ref === 'function') {
                    field.ref(el);
                  } else if (field.ref) {
                    // Use type assertion to fix the TypeScript error
                    (field.ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
                  }
                }}
                // Prevent default browser autocomplete behavior
                onFocus={(e) => {
                  // Ensure the dropdown shows on focus
                  e.currentTarget.setAttribute('autocomplete', 'off');
                  e.stopPropagation();
                }}
                // Make sure form field's onBlur callback is called
                onBlur={(e) => {
                  e.stopPropagation();
                  field.onBlur();
                }}
                // Prevent click events from propagating upward
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
