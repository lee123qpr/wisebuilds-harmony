
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
        max-height: 240px !important;
        overflow-y: auto !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        border-radius: 0.375rem !important;
      }
      .pac-item {
        pointer-events: auto !important;
        cursor: pointer !important;
        padding: 0.5rem 1rem !important;
      }
      .pac-item:hover {
        background-color: rgba(243, 244, 246, 1) !important;
      }
      .pac-container:empty {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      // Find and remove any pac-container elements when component unmounts
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach(container => {
        container.remove();
      });
    };
  }, []);

  // Delay blur handling to allow selecting from dropdown
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delayed blur to give time for autocomplete selection
    setTimeout(() => {
      if (field.onBlur) field.onBlur();
    }, 300); // Slightly longer delay
  };

  // Make sure inputRef and field.value stay in sync - crucial for showing the selected location
  useEffect(() => {
    if (inputRef.current && field.value !== undefined && inputRef.current.value !== field.value) {
      inputRef.current.value = field.value;
      console.log('Syncing input with form value:', field.value);
    }
  }, [field.value, inputRef]);

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
        // Handle change events
        onChange={(e) => {
          const newValue = e.target.value;
          field.onChange(newValue);
          console.log('Input changed:', newValue);
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
