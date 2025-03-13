
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
        // Add other necessary types
      };
      event?: {
        removeListener: (listener: any) => void;
      };
    };
  };
}

// Declare global Google Maps namespace
declare global {
  interface Window {
    google?: any;
  }
  
  namespace google.maps.places {
    class Autocomplete {
      addListener(event: string, callback: () => void): any;
      getPlace(): {
        formatted_address?: string;
        geometry?: any;
        name?: string;
      };
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
}
