
import { useRef, useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useToast } from '@/hooks/use-toast';

// Define libraries as a constant to prevent recreation on each render
// The type needs to match what @react-google-maps/api expects
const libraries: ["places"] = ["places"];

// Custom hook for Google Maps Places Autocomplete on location inputs
export const useLocationAutocomplete = (form: any, fieldName: string) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBJsbbC2Pv91pusMWPaF979yK-XpyHzLtM",
    libraries,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Set up the autocomplete once the script is loaded and the input is available
  useEffect(() => {
    if (!isLoaded || !inputRef.current || isInitialized) return;

    try {
      const options = {
        types: ['(cities)'],
        componentRestrictions: { country: ['uk', 'ie'] },
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // When a place is selected, extract and update the form field
      google.maps.event.addListener(autocompleteRef.current, 'place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          // Update form field with the formatted address
          form.setValue(fieldName, place.formatted_address, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true // Mark as touched to trigger validation
          });
          
          // Force React to update by triggering a change event
          const event = new Event('input', { bubbles: true });
          inputRef.current?.dispatchEvent(event);
          
          // Log for debugging
          console.log('Place selected:', place.formatted_address);
        }
      });

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Google Maps Error',
        description: 'Unable to initialize location search.'
      });
    }
  }, [isLoaded, form, fieldName, isInitialized, toast]);

  // Handle errors from the Google Maps API
  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps script:', loadError);
      toast({
        variant: 'destructive',
        title: 'Google Maps Error',
        description: 'Failed to load location search. Please try again later.'
      });
    }
  }, [loadError, toast]);

  return { 
    inputRef, 
    isLoaded,
    isLoading: !isLoaded // Derive isLoading from isLoaded
  };
};
