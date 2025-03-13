import React from 'react';
import { Check } from 'lucide-react';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Location } from '@/utils/location';

interface LocationSearchContentProps {
  locationInputValue: string;
  setLocationInputValue: (value: string) => void;
  groupedLocations: Record<string, Location[]>;
  handleSelectLocation: (location: Location) => void;
  selectedLocation: string;
  filteredLocations: Location[];
}

export const LocationSearchContent: React.FC<LocationSearchContentProps> = ({
  locationInputValue,
  setLocationInputValue,
  groupedLocations,
  handleSelectLocation,
  selectedLocation,
  filteredLocations
}) => {
  return (
    <Command>
      <CommandInput 
        placeholder="Search UK/Ireland location..." 
        value={locationInputValue}
        onValueChange={setLocationInputValue}
        className="h-9"
      />
      <CommandList className="max-h-[300px] overflow-auto">
        <CommandEmpty>No location found.</CommandEmpty>
        {Object.entries(groupedLocations).map(([country, locations]) => (
          <CommandGroup key={country} heading={country}>
            {locations.map((location) => (
              <CommandItem
                key={`${location.name}-${location.country}`}
                value={location.name}
                onSelect={() => handleSelectLocation(location)}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span>{location.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {location.region ? `${location.region}, ` : ''}
                    {location.country}
                  </span>
                </div>
                {selectedLocation === location.name && (
                  <Check className="h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        {filteredLocations.length > 30 && (
          <div className="py-2 px-3 text-xs text-muted-foreground">
            Showing {filteredLocations.length} locations. Refine your search for more specific results.
          </div>
        )}
      </CommandList>
    </Command>
  );
};
