
declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          options?: AutocompleteOptions
        );
        getPlace(): PlaceResult;
      }
      
      interface AutocompleteOptions {
        componentRestrictions?: {
          country: string | string[];
        };
        fields?: string[];
        types?: string[];
      }
      
      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location: LatLng;
        };
        name?: string;
      }
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    namespace event {
      function addListener(
        instance: any,
        eventName: string,
        handler: Function
      ): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
  }
}

// Extend the window interface to include Google Maps
interface Window {
  google?: typeof google;
  [key: string]: any;
}
