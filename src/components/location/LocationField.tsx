
import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Define props interface
interface LocationFieldProps {
  form: any; // This is generic to work with different form schemas
  name?: string; // Optional field name, defaults to 'location'
  label?: string; // Optional label, defaults to 'Location'
  description?: string; // Optional description text
}

// Helper function to load script
const loadGoogleMapsScript = (callback: () => void, onError: () => void) => {
  // Check if script already exists
  if (document.getElementById('google-maps-script') || window.google?.maps) {
    if (window.google?.maps) {
      callback();
    }
    return;
  }

  // Create script element
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDJUlU7aa-kjhph-XZrx4CUiZdsOrTM4NE&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  script.onerror = onError;
  
  // Append to document
  document.head.appendChild(script);
};

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed (UK and Ireland locations only)'
}) => {
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteInstanceRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  
  // Get the current value of the location field from the form
  const selectedLocation = form.watch(name);

  // Load Google Maps API when component mounts
  useEffect(() => {
    console.log('Loading Google Maps API');
    loadGoogleMapsScript(
      () => {
        console.log('Google Maps API loaded successfully');
        setIsLoading(false);
      },
      () => {
        console.error('Failed to load Google Maps API script');
        toast({
          variant: 'destructive',
          title: 'Error loading location service',
          description: 'Please check your internet connection and try again.'
        });
      }
    );

    // Cleanup function - not removing script as it might be used elsewhere
    return () => {
      if (autocompleteInstanceRef.current) {
        // Google doesn't provide a clear way to cleanup autocomplete
        autocompleteInstanceRef.current = null;
      }
    };
  }, [toast]);

  // Initialize autocomplete only when popover is open and Google Maps is loaded
  useEffect(() => {
    // Exit early if any condition is not met
    if (!locationPopoverOpen || !autocompleteRef.current || isLoading) {
      return;
    }
    
    // Verify Google Maps Places API is available
    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not available');
      toast({
        variant: 'destructive',
        title: 'Location service unavailable',
        description: 'Please refresh the page and try again.'
      });
      return;
    }

    console.log('Initializing Google Places Autocomplete');
    
    try {
      // Create the autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          componentRestrictions: { country: ['gb', 'ie'] }, // UK and Ireland only
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['(cities)'] // Restrict to cities
        }
      );
      
      // Store the instance in a ref for cleanup
      autocompleteInstanceRef.current = autocomplete;
      
      // Add place_changed event listener
      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Selected place:', place);
        
        if (place && place.formatted_address) {
          form.setValue(name, place.formatted_address, {
            shouldValidate: true,
            shouldDirty: true
          });
          console.log(`Setting form value for ${name} to:`, place.formatted_address);
          setLocationPopoverOpen(false);
        } else {
          console.warn('No place address found');
        }
      });
      
      // Return cleanup function
      return () => {
        if (window.google?.maps) {
          // @ts-ignore - google.maps.event might not be properly typed
          google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Error initializing location search',
        description: 'Please refresh the page and try again.'
      });
    }
  }, [locationPopoverOpen, isLoading, form, name, toast]);

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
            <PopoverContent className="w-[300px] p-4" align="start">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Search location</h4>
                <Input
                  ref={autocompleteRef}
                  placeholder="Type to search UK/Ireland cities..."
                  className="w-full"
                  // Focus the input when popover opens
                  onFocus={() => console.log('Input focused')}
                />
                {isLoading && (
                  <div className="text-xs text-amber-500">
                    Loading location service...
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Search limited to cities in UK and Ireland
                </p>
              </div>
            </PopoverContent>
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

// Add TypeScript interface for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              componentRestrictions?: { country: string[] };
              fields?: string[];
              types?: string[];
            }
          ) => google.maps.places.Autocomplete;
          // Add other necessary types
        };
        event?: {
          removeListener: (listener: any) => void;
        };
      };
    };
  }
}

// Define google.maps.places.Autocomplete for TypeScript
declare namespace google.maps.places {
  class Autocomplete {
    addListener(event: string, callback: () => void): any;
    getPlace(): {
      formatted_address?: string;
      geometry?: any;
      name?: string;
    };
  }
}
