
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to load the Google Maps script with async loading for better performance
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
    
    // Define callback function that will be called when the script loads
    window.initMap = function() {
      console.log('Google Maps API loaded successfully');
      setIsLoading(false);
      setIsLoaded(true);
    };
    
    // Skip if the script tag is already in the document
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      console.log('Google Maps script tag already exists, waiting for it to load');
      return;
    }

    console.log('Loading Google Maps API');
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCq_7VhK8-OEdlfPH6bna-5t5VuxPIDckE&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
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
      // We don't remove the script since it should remain available throughout the app
    };
  }, [toast]);

  return { isLoading, isLoaded, error };
};
