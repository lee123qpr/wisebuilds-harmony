
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Don't load if already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('Google Maps API already loaded');
      setIsLoaded(true);
      return;
    }
    
    // Don't reload if already loading
    if (isLoading) return;
    
    // Don't reload if script tag exists
    if (document.getElementById('google-maps-script')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Loading Google Maps API script');
      
      // Create a unique callback name
      const callbackName = `initGoogleMaps${Date.now()}`;
      
      // Set up the callback function
      window[callbackName] = () => {
        console.log('Google Maps API loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
        delete window[callbackName];
      };
      
      // Create and append the script
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCq_7VhK8-OEdlfPH6bna-5t5VuxPIDckE&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      // Handle script loading error
      script.onerror = () => {
        console.error('Failed to load Google Maps API script');
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error loading location service',
          description: 'Please check your internet connection and try again.'
        });
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error setting up Google Maps script:', error);
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error loading location service',
        description: 'An unexpected error occurred.'
      });
    }
    
    return () => {
      // No cleanup needed for the script
    };
  }, [toast, isLoading]);

  return { isLoaded, isLoading };
};
