
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleMapsLoader } from './useGoogleMapsLoader';
import { useAutocompleteEvents } from './useAutocompleteEvents';
import { useAutocompleteDomObserver } from './useAutocompleteDomObserver';

// Custom hook for Google Maps Places Autocomplete on location inputs
export const useLocationAutocomplete = (form: any, fieldName: string) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const eventListenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Use our Google Maps loader hook
  const { isLoaded, loadError } = useGoogleMapsLoader({
    googleMapsApiKey: "AIzaSyBJsbbC2Pv91pusMWPaF979yK-XpyHzLtM",
    libraries: ["places"],
  });

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

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Google Maps Error',
        description: 'Unable to initialize location search.'
      });
    }
  }, [isLoaded, isInitialized, toast]);

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

  // Use our hooks for events and DOM observations
  useAutocompleteEvents({
    inputRef,
    autocompleteRef,
    form,
    fieldName,
    eventListenersRef,
    isInitialized
  });

  useAutocompleteDomObserver({
    inputRef,
    isInitialized
  });

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
