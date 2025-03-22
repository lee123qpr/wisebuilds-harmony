
import React from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocationInputHandlers } from './hooks/useLocationInputHandlers';

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
  const {
    handleBlur,
    handleMouseDown,
    handleChange,
    handleKeyDown
  } = useLocationInputHandlers({
    inputRef,
    isLoaded,
    field
  });

  return (
    <div className="relative" onMouseDown={handleMouseDown}>
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
        onChange={handleChange}
        // Prevent dialog closing on key events
        onKeyDown={handleKeyDown}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
