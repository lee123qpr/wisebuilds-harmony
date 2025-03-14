
import React, { useRef, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { LocationFieldProps } from './types';
import { useGoogleMapsScript } from './useGoogleMapsScript';
import { useToast } from '@/hooks/use-toast';

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed (UK and Ireland locations only)'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useGoogleMapsScript();
  const { toast } = useToast();
  
  // Set up the autocomplete when Google Maps is loaded
  useEffect(() => {
    // Exit early if Google Maps is not loaded or input doesn't exist
    if (!isLoaded || !inputRef.current) return;
    
    try {
      console.log('Setting up Places Autocomplete');
      
      // Create the autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ['gb', 'ie'] }, // UK and Ireland only
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['(cities)'] // Restrict to cities
      });
      
      // Add the place_changed event listener
      const listener = window.google.maps.event.addListener(
        autocomplete, 
        'place_changed', 
        () => {
          const place = autocomplete.getPlace();
          
          if (place && place.formatted_address) {
            console.log('Selected place:', place.formatted_address);
            form.setValue(name, place.formatted_address, { 
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
      
      // Return cleanup function
      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener);
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

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter location (UK/Ireland)"
                className="pl-9"
                ref={(el) => {
                  // Set both refs (ours and react-hook-form's)
                  inputRef.current = el;
                  if (typeof field.ref === 'function') {
                    field.ref(el);
                  }
                }}
                {...field}
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
