
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

  // Delay blur handling to allow selecting from dropdown
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Increased delay to give more time for selection
    setTimeout(() => {
      if (field.onBlur) field.onBlur();
    }, 200);
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
        // Ensure the value is always controlled by React
        value={field.value || ''}
        // Add onChange handler to ensure React state is updated
        onChange={(e) => {
          field.onChange(e);
          console.log('Input changed:', e.target.value);
        }}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
