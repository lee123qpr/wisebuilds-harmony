
// Type definitions for Google Maps JavaScript API v3
declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          options?: AutocompleteOptions
        );
        getPlace(): PlaceResult;
        addListener(eventName: string, handler: () => void): MapsEventListener;
        bindTo(bindKey: string, target: any, targetKey?: string): void;
      }
      
      interface AutocompleteOptions {
        componentRestrictions?: {
          country: string | string[];
        };
        fields?: string[];
        types?: string[];
        bounds?: LatLngBounds;
        strictBounds?: boolean;
      }
      
      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location: LatLng;
          viewport?: LatLngBounds;
        };
        name?: string;
        place_id?: string;
        types?: string[];
        address_components?: Array<{
          long_name: string;
          short_name: string;
          types: string[];
        }>;
        photos?: PlacePhoto[];
        url?: string;
        utc_offset_minutes?: number;
        vicinity?: string;
      }

      interface PlacePhoto {
        getUrl(opts?: PhotoOptions): string;
        height: number;
        width: number;
        html_attributions: string[];
      }

      interface PhotoOptions {
        maxWidth?: number;
        maxHeight?: number;
      }
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toString(): string;
      toUrlValue(precision?: number): string;
      equals(other: LatLng): boolean;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      contains(latLng: LatLng): boolean;
      equals(other: LatLngBounds): boolean;
      extend(latLng: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds): boolean;
      isEmpty(): boolean;
      toJSON(): object;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds): LatLngBounds;
    }
    
    namespace event {
      function addListener(
        instance: any,
        eventName: string,
        handler: Function
      ): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
      function clearInstanceListeners(instance: any): void;
      function clearListeners(instance: any, eventName: string): void;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
  }
}

interface Window {
  google: typeof google;
  [key: string]: any;
}
