
import React, { RefObject } from 'react';
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
  return (
    <PopoverContent className="w-[300px] p-4" align="start">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Search location</h4>
        <Input
          ref={inputRef}
          placeholder="Type to search UK/Ireland cities..."
          className="w-full"
          // Focus the input when popover opens
          onFocus={() => console.log('Input focused')}
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
