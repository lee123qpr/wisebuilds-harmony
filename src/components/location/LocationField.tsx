
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

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
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  const autocompleteRef = React.useRef<HTMLInputElement>(null);
  const selectedLocation = form.watch(name);

  // Load Google Maps API script
  useEffect(() => {
    // Check if the script is already loaded
    if (!document.getElementById('google-maps-script') && !window.google?.maps) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBZMS5xAMkXiIl3j8vxJPPo5ROUTPRXAnE&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeAutocomplete();
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      initializeAutocomplete();
    }
  }, []);

  // Initialize autocomplete when popover opens
  useEffect(() => {
    if (locationPopoverOpen && window.google?.maps && !autocompleteInitialized) {
      initializeAutocomplete();
    }
  }, [locationPopoverOpen]);

  const initializeAutocomplete = () => {
    if (!autocompleteRef.current || autocompleteInitialized) return;

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

      setAutocompleteInitialized(true);
      console.log('Google Maps Places Autocomplete initialized');
    } catch (error) {
      console.error('Error initializing Google Maps Places Autocomplete:', error);
    }
  };

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
