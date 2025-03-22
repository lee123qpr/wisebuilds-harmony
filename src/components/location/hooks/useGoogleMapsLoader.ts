
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define libraries as a constant to prevent recreation on each render
// The type needs to match what @react-google-maps/api expects
const DEFAULT_LIBRARIES: ["places"] = ["places"];
const DEFAULT_OPTIONS = {
  version: 'weekly',
  language: 'en',
  region: 'GB'
};

interface GoogleMapsLoaderOptions {
  googleMapsApiKey: string;
  libraries?: ["places"];
  version?: string;
  language?: string;
  region?: string;
}

export const useGoogleMapsLoader = (options: GoogleMapsLoaderOptions) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Don't reload the script if it's already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }
    
    // If a script is already loading, don't attempt to load again
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
      // Watch for the script to finish loading
      const checkIfLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkIfLoaded);
        }
      }, 100);
      
      return () => {
        clearInterval(checkIfLoaded);
      };
    }

    // Use the configuration options with defaults
    const {
      googleMapsApiKey,
      libraries = DEFAULT_LIBRARIES,
      version = DEFAULT_OPTIONS.version,
      language = DEFAULT_OPTIONS.language,
      region = DEFAULT_OPTIONS.region
    } = options;

    // Create and configure the script element
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    script.setAttribute('id', 'google-maps-script');
    script.setAttribute('loading', 'async');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&version=${version}&libraries=${libraries.join(',')}&language=${language}&region=${region}`;

    // Add listeners for load and error events
    const onScriptLoad = () => {
      setIsLoaded(true);
    };

    const onScriptError = (e: Event) => {
      setLoadError(new Error('Google Maps script failed to load.'));
      script.remove();
      
      toast({
        variant: 'destructive',
        title: 'Google Maps Error',
        description: 'Failed to load location search. Please try again later.'
      });
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    // Add the script to the document head
    document.head.appendChild(script);

    // Clean up function
    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
      // We don't remove the script here to prevent issues with other components using it
    };
  }, [options.googleMapsApiKey, toast]); // Only re-run if the API key changes

  return { isLoaded, loadError };
};
