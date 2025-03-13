
import React, { useState, useEffect } from 'react';
import { Check, CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { filterLocations } from '@/utils/locationService';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from './schema';

interface LocationFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const LocationField: React.FC<LocationFieldProps> = ({ form }) => {
  const [locationInputValue, setLocationInputValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  useEffect(() => {
    setFilteredLocations(filterLocations(locationInputValue));
  }, [locationInputValue]);

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
                  <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {filteredLocations.map((location) => (
                    <CommandItem
                      key={location}
                      value={location}
                      onSelect={(value) => {
                        field.onChange(value);
                        setLocationInputValue("");
                        setLocationPopoverOpen(false);
                      }}
                    >
                      {location}
                      {field.value === location && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
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
