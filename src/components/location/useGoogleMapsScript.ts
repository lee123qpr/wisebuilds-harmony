
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to load the Google Maps script with improved loading logic
 * @returns Object containing loading state and error information
 */
export const useGoogleMapsScript = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // If Google Maps is already available, we can skip loading the script
    if (window.google?.maps?.places) {
      console.log('Google Maps API already loaded');
      setIsLoading(false);
      setIsLoaded(true);
      return;
    }
    
    // Skip if the script tag is already in the document
    if (document.getElementById('google-maps-script')) {
      console.log('Google Maps script tag already exists, waiting for it to load');

      // Setup callback to monitor for the script load
      window.initMap = function() {
        console.log('Google Maps API loaded successfully via existing script');
        setIsLoading(false);
        setIsLoaded(true);
      };
      
      return;
    }

    console.log('Loading Google Maps API');
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCq_7VhK8-OEdlfPH6bna-5t5VuxPIDckE&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Define callback function
    window.initMap = function() {
      console.log('Google Maps API loaded successfully');
      setIsLoading(false);
      setIsLoaded(true);
    };
    
    // Set up error handler
    script.onerror = (e) => {
      console.error('Failed to load Google Maps API script', e);
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
    
    // Cleanup function
    return () => {
      // We'll leave the global callback in place to ensure the script loads properly if already in process
      // Don't remove the script tag to prevent reloading issues
    };
  }, [toast]);

  return { isLoading, isLoaded, error };
};
