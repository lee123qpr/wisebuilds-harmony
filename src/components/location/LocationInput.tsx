
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  field: any;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoaded: boolean;
  isLoading: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  field,
  inputRef,
  isLoaded,
  isLoading,
}) => {
  // Add global styles for the autocomplete dropdown when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .pac-container {
        z-index: 9999 !important;
        position: fixed !important;
        pointer-events: auto !important;
        transform: translateZ(0) !important;
      }
      .pac-item {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Create a minimum 1000ms delay for blur events to allow selecting autocomplete options
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      field.onBlur();
    }, 1000);
  };

  // Add a visual feedback when API key is missing
  const placeholder = !import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
    ? "Google Maps API key missing" 
    : "Enter city or town";

  return (
    <div className="relative">
      <Input
        {...field}
        ref={inputRef}
        placeholder={placeholder}
        onBlur={handleBlur}
        disabled={isLoading || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        className={cn(
          "pr-10",
          !isLoaded && "cursor-not-allowed opacity-50"
        )}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
