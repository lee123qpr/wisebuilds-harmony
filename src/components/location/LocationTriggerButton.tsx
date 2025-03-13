
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { LocationTriggerButtonProps } from './types';

export const LocationTriggerButton: React.FC<LocationTriggerButtonProps> = ({
  value,
  isOpen
}) => {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={isOpen}
      className="w-full justify-between"
      type="button"
    >
      {value ? (
        <span className="flex items-center truncate">
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          {value}
        </span>
      ) : (
        <span className="text-muted-foreground">Select location...</span>
      )}
      <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
};
