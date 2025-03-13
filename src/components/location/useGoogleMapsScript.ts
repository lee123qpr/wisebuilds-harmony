
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to load the Google Maps script
 * @returns Object containing loading state and error information
 */
export const useGoogleMapsScript = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Skip if the script is already loaded or being loaded
    if (document.getElementById('google-maps-script') || window.google?.maps) {
      if (window.google?.maps) {
        console.log('Google Maps API already loaded');
        setIsLoading(false);
        setIsLoaded(true);
      }
      return;
    }

    console.log('Loading Google Maps API');
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCq_7VhK8-OEdlfPH6bna-5t5VuxPIDckE&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set up success handler
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      setIsLoading(false);
      setIsLoaded(true);
    };
    
    // Set up error handler
    script.onerror = (e) => {
      console.error('Failed to load Google Maps API script');
      setIsLoading(false);
      setError(new Error('Failed to load Google Maps API'));
      toast({
        variant: 'destructive',
        title: 'Error loading location service',
        description: 'Please check your internet connection and try again.'
      });
    };
    
    // Append to document
    document.head.appendChild(script);
    
    // Cleanup function - not removing script as it might be used elsewhere
    return () => {
      // Script stays in the DOM for reuse
    };
  }, [toast]);

  return { isLoading, isLoaded, error };
};
