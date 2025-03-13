
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

  // Initialize autocomplete when popover is open and Google Maps is loaded
  useEffect(() => {
    // Clean up function to remove event listeners
    const cleanupListener = () => {
      if (listenerRef.current && window.google?.maps?.event) {
        try {
          google.maps.event.removeListener(listenerRef.current);
          listenerRef.current = null;
          console.log('Removed event listener');
        } catch (error) {
          console.error('Error removing event listener:', error);
        }
      }
    };
    
    // Exit early if any condition is not met
    if (!isOpen || !inputRef.current || !isGoogleMapsLoaded) {
      return cleanupListener;
    }
    
    // Verify Google Maps Places API is available
    if (!window.google?.maps?.places) {
      console.error('Google Maps Places API not available');
      toast({
        variant: 'destructive',
        title: 'Location service unavailable',
        description: 'Please refresh the page and try again.'
      });
      return cleanupListener;
    }

    console.log('Initializing Google Places Autocomplete');
    
    try {
      // Short delay to ensure input is ready
      const timeoutId = setTimeout(() => {
        if (!inputRef.current || !window.google?.maps?.places) {
          return;
        }
        
        // Clean up any existing instance
        cleanupListener();
        
        // Create the autocomplete instance
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: ['gb', 'ie'] }, // UK and Ireland only
            fields: ['formatted_address', 'geometry', 'name'],
            types: ['(cities)'] // Restrict to cities
          }
        );
        
        // Store the instance for later use
        autocompleteInstanceRef.current = autocomplete;
        
        console.log('Created autocomplete instance');
        
        // Add place_changed event listener safely
        if (window.google?.maps?.event) {
          listenerRef.current = google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            console.log('Selected place:', place);
            
            if (place && place.formatted_address) {
              onPlaceSelect(place);
            } else {
              console.warn('No place address found');
              toast({
                variant: 'default', // Changed from 'warning' to 'default'
                title: 'Location not found',
                description: 'Please select a location from the dropdown.'
              });
            }
          });
          
          console.log('Added place_changed event listener');
        }
      }, 300);
      
      // Return cleanup function that clears the timeout and listener
      return () => {
        clearTimeout(timeoutId);
        cleanupListener();
      };
    } catch (error) {
      console.error('Error initializing Places Autocomplete:', error);
      toast({
        variant: 'destructive',
        title: 'Error initializing location search',
        description: 'Please refresh the page and try again.'
      });
      return cleanupListener;
    }
  }, [isOpen, isGoogleMapsLoaded, inputRef, onPlaceSelect, toast]);

  return { autocompleteInstanceRef };
};
