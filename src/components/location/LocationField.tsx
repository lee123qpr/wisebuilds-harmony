
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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useGoogleMapsScript();
  const { toast } = useToast();

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      // Create the autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: ['gb', 'ie'] }, // UK and Ireland only
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['(cities)'] // Restrict to cities
        }
      );
      
      // Store the instance for later cleanup
      autocompleteRef.current = autocomplete;
      
      // Add place_changed event listener
      const listener = window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place && place.formatted_address) {
          form.setValue(name, place.formatted_address, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        } else {
          toast({
            variant: 'default',
            title: 'Location not found',
            description: 'Please select a location from the dropdown.'
          });
        }
      });
      
      // Return cleanup function
      return () => {
        if (listener) window.google.maps.event.removeListener(listener);
      };
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Error initializing location search',
        description: 'Please try again later.'
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
                ref={inputRef}
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
