
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
  const eventListenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBJsbbC2Pv91pusMWPaF979yK-XpyHzLtM",
    libraries,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Clean up function to remove event listeners and disconnect autocomplete
  const cleanup = () => {
    // Remove all Google Maps event listeners
    eventListenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    eventListenersRef.current = [];
    
    // Clear the autocomplete reference
    autocompleteRef.current = null;
    
    // Reset initialization flag
    setIsInitialized(false);
    
    // Remove any existing pac-container elements that might be orphaned
    const pacContainers = document.querySelectorAll('.pac-container');
    pacContainers.forEach(container => {
      container.remove();
    });
  };

  // Set up the autocomplete once the script is loaded and the input is available
  useEffect(() => {
    if (!isLoaded || !inputRef.current || isInitialized) return;

    try {
      const options = {
        types: ['(cities)'],
        componentRestrictions: { country: ['uk', 'ie'] },
      };

      // Create new autocomplete instance specifically for this input
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // When a place is selected, extract and update the form field
      const placeChangedListener = google.maps.event.addListener(
        autocompleteRef.current, 
        'place_changed', 
        () => {
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
        }
      );
      
      // Store the listener reference for cleanup
      eventListenersRef.current.push(placeChangedListener);

      // Add input listener to handle when user clears the input field
      const inputHandler = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.value === '') {
          // Update the form when input is cleared
          form.setValue(fieldName, '', {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        }
      };
      
      if (inputRef.current) {
        inputRef.current.addEventListener('input', inputHandler);
      }
      
      // Handle blur events to hide the autocomplete when input loses focus
      const blurHandler = () => {
        // Add a small delay to allow for selecting from dropdown
        setTimeout(() => {
          // Find any pac-container elements and hide them when not needed
          const pacContainers = document.querySelectorAll('.pac-container');
          pacContainers.forEach(container => {
            container.setAttribute('style', 'display: none !important;');
          });
        }, 300);
      };
      
      if (inputRef.current) {
        inputRef.current.addEventListener('blur', blurHandler);
      }
      
      // Handle focus events to show the autocomplete when input gains focus
      const focusHandler = () => {
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => {
          container.removeAttribute('style');
        });
      };
      
      if (inputRef.current) {
        inputRef.current.addEventListener('focus', focusHandler);
      }

      // Store cleanup function to remove event listeners
      const inputCleanup = () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('input', inputHandler);
          inputRef.current.removeEventListener('blur', blurHandler);
          inputRef.current.removeEventListener('focus', focusHandler);
        }
      };

      setIsInitialized(true);

      // Return cleanup function
      return inputCleanup;
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

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return { 
    inputRef, 
    isLoaded,
    isLoading: !isLoaded // Derive isLoading from isLoaded
  };
};
