
import { useState, useEffect } from 'react';

interface UseGoogleMapsScriptOptions {
  googleMapsApiKey: string;
  libraries?: string[];
  version?: string;
  language?: string;
  region?: string;
}

const defaultOptions = {
  libraries: ['places'],
  version: 'weekly',
  language: 'en',
  region: 'GB'
};

export const useGoogleMapsScript = (options: UseGoogleMapsScriptOptions) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
      libraries = defaultOptions.libraries,
      version = defaultOptions.version,
      language = defaultOptions.language,
      region = defaultOptions.region
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
      setError(new Error('Google Maps script failed to load.'));
      script.remove();
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
  }, [options]); // Only re-run if the options change

  return { isLoaded, error };
};
