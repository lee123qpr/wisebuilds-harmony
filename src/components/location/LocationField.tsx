
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

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed (UK and Ireland locations only)'
}) => {
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const selectedLocation = form.watch(name);

  // Load Google Maps API script
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.getElementById('google-maps-script') && !window.google?.maps) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDJUlU7aa-kjhph-XZrx4CUiZdsOrTM4NE&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setScriptLoaded(true);
        console.log('Google Maps API script loaded');
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API script');
        toast({
          variant: 'destructive',
          title: 'Error loading location service',
          description: 'Please check your internet connection and try again.'
        });
      };
      
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      setScriptLoaded(true);
    }
  }, [toast]);

  // Initialize autocomplete when input is focused and script is loaded
  useEffect(() => {
    if (!scriptLoaded || !autocompleteRef.current) return;
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        componentRestrictions: { country: ['gb', 'ie'] }, // UK and Ireland
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['(cities)']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          form.setValue(name, place.formatted_address, { 
            shouldValidate: true, 
            shouldDirty: true 
          });
          setSearchInput('');
          setLocationPopoverOpen(false);
        }
      });
      
      console.log('Google Places Autocomplete initialized');
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Error initializing location search',
        description: 'Please refresh the page and try again.'
      });
    }
  }, [scriptLoaded, form, name, toast]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover 
            open={locationPopoverOpen} 
            onOpenChange={setLocationPopoverOpen}
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
                    <span className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 shrink-0" />
                      {field.value}
                    </span>
                  ) : (
                    "Select location..."
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
                  placeholder="Type to search locations..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full"
                />
                {!scriptLoaded && (
                  <div className="text-xs text-amber-500">
                    Loading location service...
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Locations limited to UK and Ireland
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
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              geometry?: any;
              name?: string;
            };
          };
        };
      };
    };
  }
}
