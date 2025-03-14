
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  isLoaded: boolean;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  field: any;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  isLoaded, 
  isLoading, 
  inputRef, 
  field 
}) => {
  return (
    <div className="relative" style={{ zIndex: 50 }}>
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
      ) : (
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        placeholder={isLoaded ? "Enter any location" : "Loading location service..."}
        className="pl-9 h-12" // Increased height for better visibility
        disabled={isLoading && !isLoaded}
        autoComplete="off"
        {...field}
        ref={(el) => {
          inputRef.current = el;
          
          // Handle react-hook-form's ref properly with type assertion
          if (typeof field.ref === 'function') {
            field.ref(el);
          } else if (field.ref) {
            // Use type assertion to fix the TypeScript error
            (field.ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
          }
        }}
        // Prevent default browser autocomplete behavior
        onFocus={(e) => {
          // Ensure the dropdown shows on focus
          e.currentTarget.setAttribute('autocomplete', 'off');
          e.stopPropagation();
        }}
        // Make sure form field's onBlur callback is called
        onBlur={(e) => {
          e.stopPropagation();
          field.onBlur();
        }}
        // Prevent click events from propagating upward
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};
