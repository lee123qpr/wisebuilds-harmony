
// Define types for Google Maps API
export interface GoogleMapsWindow extends Window {
  google: {
    maps: {
      places: {
        Autocomplete: new (
          input: HTMLInputElement,
          options?: {
            componentRestrictions?: { country: string[] };
            fields?: string[];
            types?: string[];
          }
        ) => google.maps.places.Autocomplete;
      };
      event: {
        removeListener: (listener: google.maps.MapsEventListener) => void;
        addListener: (instance: any, eventName: string, handler: Function) => google.maps.MapsEventListener;
      };
    };
  };
  initMap?: () => void; // Global callback for Google Maps
}

// Declare global Google Maps namespace
declare global {
  interface Window {
    google?: any;
    initMap?: () => void; // Add global callback definition
  }
  
  namespace google.maps {
    class MapsEventListener {}
    
    namespace places {
      class Autocomplete {
        addListener(event: string, callback: () => void): MapsEventListener;
        getPlace(): {
          formatted_address?: string;
          geometry?: any;
          name?: string;
        };
      }
    }
    
    // Define the event namespace
    namespace event {
      function removeListener(listener: MapsEventListener): void;
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
    }
  }
}

// Define props interface for LocationField
export interface LocationFieldProps {
  form: any; // This is generic to work with different form schemas
  name?: string; // Optional field name, defaults to 'location'
  label?: string; // Optional label, defaults to 'Location'
  description?: string; // Optional description text
}

// Define props for the LocationTriggerButton component
export interface LocationTriggerButtonProps {
  value: string | undefined;
  isOpen: boolean;
  onClick?: () => void;
}
