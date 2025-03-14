
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
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
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      console.log('Google Maps script tag already exists');
      return;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      console.log('Loading Google Maps API script');
      
      // Create a unique callback name
      const callbackName = `initGoogleMaps${Date.now()}`;
      
      // Set up the callback function
      window[callbackName] = () => {
        console.log('Google Maps API loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
        
        // Check if the pac-container exists and needs debugging
        setTimeout(() => {
          const pacContainer = document.querySelector('.pac-container');
          if (pacContainer) {
            console.log('PAC container found:', pacContainer);
          } else {
            console.warn('PAC container not found. Autocomplete might not be initialized.');
          }
        }, 5000); // Check after 5 seconds
        
        // Delete the callback function to prevent memory leaks
        delete window[callbackName];
      };
      
      // Create and append the script with loading=async for better performance
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBJsbbC2Pv91pusMWPaF979yK-XpyHzLtM&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.loading = 'async'; // Use the proper attribute loading
      
      // Handle script loading error
      script.onerror = (event) => {
        console.error('Failed to load Google Maps API script', event);
        setIsLoading(false);
        setLoadError(new Error('Failed to load Google Maps API'));
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
      setLoadError(error instanceof Error ? error : new Error('Unknown error loading Google Maps'));
      toast({
        variant: 'destructive',
        title: 'Error loading location service',
        description: 'An unexpected error occurred.'
      });
    }
    
    // Define the cleanup function
    return () => {
      // TypeScript fix: Explicitly declare the callback name type
      const globalCallbackName = `initGoogleMaps${Date.now()}` as keyof typeof window;
      if (window[globalCallbackName]) {
        delete window[globalCallbackName];
      }
    };
  }, [toast, isLoading]);

  return { 
    isLoaded, 
    isLoading,
    error: loadError 
  };
};
