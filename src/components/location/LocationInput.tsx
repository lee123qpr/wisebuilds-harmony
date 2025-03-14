
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
        position: absolute !important;
        pointer-events: auto !important;
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

  // Create a minimum 500ms delay for blur events to allow selecting autocomplete options
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      field.onBlur();
    }, 500);
  };

  return (
    <div className="relative">
      <Input
        {...field}
        ref={inputRef}
        placeholder="Enter city or town"
        onBlur={handleBlur}
        disabled={isLoading}
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
