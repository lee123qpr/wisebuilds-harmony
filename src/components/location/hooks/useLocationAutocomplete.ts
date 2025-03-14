
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
          const formattedAddress = place.formatted_address;
          
          // Update the form field
          form.setValue(fieldName, formattedAddress, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
          
          // Directly update input value
          if (inputRef.current) {
            inputRef.current.value = formattedAddress;
          }
          
          // Force a React change event to update state
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 
            "value"
          )?.set;
          
          if (inputRef.current && nativeInputValueSetter) {
            nativeInputValueSetter.call(inputRef.current, formattedAddress);
            
            // Create and dispatch events for React to detect
            const event = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(event);
            
            // Also dispatch a change event
            const changeEvent = new Event('change', { bubbles: true });
            inputRef.current.dispatchEvent(changeEvent);
          }
          
          console.log('Place selected and saved:', formattedAddress);
        }
      });

      // Add input listener to handle when user clears the input field
      if (inputRef.current) {
        inputRef.current.addEventListener('input', (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.value === '') {
            // Update the form when input is cleared
            form.setValue(fieldName, '', {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
          }
        });
      }

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
