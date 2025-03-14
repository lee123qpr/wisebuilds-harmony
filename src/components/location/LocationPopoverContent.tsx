
import React, { RefObject, useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface LocationPopoverContentProps {
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
}

export const LocationPopoverContent: React.FC<LocationPopoverContentProps> = ({
  inputRef,
  isLoading
}) => {
  const [searchText, setSearchText] = useState('');

  // Focus the input when popover opens
  useEffect(() => {
    if (inputRef.current) {
      // Short timeout to ensure the popover is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
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
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Search location</h4>
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="Type to search UK/Ireland cities..."
            className="w-full pr-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            aria-autocomplete="list"
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        
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
