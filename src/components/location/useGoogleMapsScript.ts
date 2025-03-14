
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to load the Google Maps script asynchronously
 */
export const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('Google Maps API already loaded');
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }
    
    // Generate a unique callback name
    const callbackName = `initGoogleMaps${Math.random().toString(36).substring(2, 9)}`;
    
    // Create the callback function that will be called when the script loads
    window[callbackName] = function() {
      console.log('Google Maps API loaded successfully');
      setIsLoaded(true);
      setIsLoading(false);
      // Clean up the callback
      delete window[callbackName];
    };
    
    // Check if script already exists
    if (document.getElementById('google-maps-script')) {
      console.log('Script tag already exists');
      return;
    }
    
    try {
      console.log('Loading Google Maps API script');
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCq_7VhK8-OEdlfPH6bna-5t5VuxPIDckE&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      // Handle script load error
      script.onerror = () => {
        console.error('Failed to load Google Maps API script');
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error loading location service',
          description: 'Please check your internet connection and try again.'
        });
      };
      
      // Add the script to the document
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error setting up Google Maps script:', error);
      setIsLoading(false);
    }
    
    // No cleanup needed for the script as it should stay available
  }, [toast]);

  return { isLoaded, isLoading };
};
