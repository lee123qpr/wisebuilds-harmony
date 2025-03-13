
import { useEffect, useRef, RefObject } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseLocationAutocompleteProps {
  isOpen: boolean;
  isGoogleMapsLoaded: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onPlaceSelect: (place: { formatted_address: string }) => void;
}

/**
 * Hook for handling Google Places Autocomplete functionality
 */
export const useLocationAutocomplete = ({
  isOpen,
  isGoogleMapsLoaded,
  inputRef,
  onPlaceSelect,
}: UseLocationAutocompleteProps) => {
  const autocompleteInstanceRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const { toast } = useToast();

  // Initialize autocomplete only when popover is open and Google Maps is loaded
  useEffect(() => {
    // Clean up previous instance if it exists
    if (listenerRef.current && window.google?.maps?.event) {
      google.maps.event.removeListener(listenerRef.current);
      listenerRef.current = null;
    }
    
    // Exit early if any condition is not met
    if (!isOpen || !inputRef.current || !isGoogleMapsLoaded) {
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
        inputRef.current,
        {
          componentRestrictions: { country: ['gb', 'ie'] }, // UK and Ireland only
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['(cities)'] // Restrict to cities
        }
      );
      
      // Store the instance in a ref for cleanup
      autocompleteInstanceRef.current = autocomplete;
      
      // Add place_changed event listener
      listenerRef.current = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Selected place:', place);
        
        if (place && place.formatted_address) {
          onPlaceSelect(place);
        } else {
          console.warn('No place address found');
        }
      });
      
      // Return cleanup function
      return () => {
        if (window.google?.maps?.event && listenerRef.current) {
          google.maps.event.removeListener(listenerRef.current);
          listenerRef.current = null;
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
  }, [isOpen, isGoogleMapsLoaded, inputRef, onPlaceSelect, toast]);

  return { autocompleteInstanceRef };
};
