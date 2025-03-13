
import React, { useState, useEffect } from 'react';
import { Check, MapPin } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { filterLocations, getLocationDisplayString, Location } from '@/utils/locationService';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from './schema';
import { Badge } from '@/components/ui/badge';

interface LocationFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const LocationField: React.FC<LocationFieldProps> = ({ form }) => {
  const [locationInputValue, setLocationInputValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  useEffect(() => {
    setFilteredLocations(filterLocations(locationInputValue));
  }, [locationInputValue]);

  const groupedLocations = filteredLocations.reduce((groups, location) => {
    const country = location.country;
    if (!groups[country]) {
      groups[country] = [];
    }
    groups[country].push(location);
    return groups;
  }, {} as Record<string, Location[]>);

  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Location</FormLabel>
          <Popover 
            open={locationPopoverOpen} 
            onOpenChange={setLocationPopoverOpen}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationPopoverOpen}
                  className="w-full justify-between"
                >
                  {field.value || "Select location..."}
                  <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search UK/Ireland location..." 
                  value={locationInputValue}
                  onValueChange={setLocationInputValue}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  {Object.entries(groupedLocations).map(([country, locations]) => (
                    <CommandGroup key={country} heading={country}>
                      {locations.map((location) => (
                        <CommandItem
                          key={`${location.name}-${location.country}`}
                          value={location.name}
                          onSelect={(value) => {
                            field.onChange(value);
                            setLocationInputValue("");
                            setLocationPopoverOpen(false);
                          }}
                        >
                          <span>{location.name}</span>
                          {location.region && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {location.region}
                            </Badge>
                          )}
                          {field.value === location.name && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Where the work will be performed (UK and Ireland locations only)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
