
import React, { RefObject, useEffect } from 'react';
import { PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface LocationPopoverContentProps {
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
}

export const LocationPopoverContent: React.FC<LocationPopoverContentProps> = ({
  inputRef,
  isLoading
}) => {
  // Focus the input when popover opens
  useEffect(() => {
    if (inputRef.current) {
      // Short timeout to ensure the popover is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Clear any previous value to ensure a fresh search
          inputRef.current.value = '';
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [inputRef]);

  return (
    <PopoverContent 
      className="w-[300px] p-4 z-[9999]" // High z-index for better stacking
      align="start" 
      sideOffset={5}
      onOpenAutoFocus={(e) => {
        // We need to prevent the default behavior to manually handle our own focus
        e.preventDefault();
      }}
      // Remove any pointer-events: none that might be applied
      style={{ pointerEvents: 'auto' }}
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Search location</h4>
        <Input
          ref={inputRef}
          placeholder="Type to search UK/Ireland cities..."
          className="w-full"
          autoComplete="off"
          // Add these attributes to prevent browser's autocomplete interference
          autoCorrect="off"
          spellCheck="false"
          aria-autocomplete="list"
          // Explicitly set a high tab index to ensure it receives focus
          tabIndex={0}
          // Ensure the input is actually clickable
          style={{ pointerEvents: 'auto' }}
          // Make sure clicking works
          onClick={(e) => {
            // Stop event propagation to prevent the popover from closing
            e.stopPropagation();
            // Ensure the input gets focus when clicked
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        />
        {isLoading && (
          <div className="text-xs text-amber-500">
            Loading location service...
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Search limited to cities in UK and Ireland
        </p>
      </div>
    </PopoverContent>
  );
};
