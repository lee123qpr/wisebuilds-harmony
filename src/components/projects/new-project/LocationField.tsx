
import React, { useState, useEffect } from 'react';
import { Check, MapPin, Filter } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { filterLocations, Location } from '@/utils/locationService';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from './schema';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LocationFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const LocationField: React.FC<LocationFieldProps> = ({ form }) => {
  const [locationInputValue, setLocationInputValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'UK' | 'Ireland'>('all');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const selectedLocation = form.watch('location');

  useEffect(() => {
    setFilteredLocations(
      filterLocations(locationInputValue, {
        country: activeFilter !== 'all' ? activeFilter as 'UK' | 'Ireland' : undefined,
        region: activeRegion || undefined,
        minInputLength: locationInputValue ? 1 : 0, // Show results immediately when filtering
        limit: 50 // Increased from 20 to 50 to show more locations
      })
    );
  }, [locationInputValue, activeFilter, activeRegion]);

  const regions = {
    UK: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    Ireland: []
  };

  const groupedLocations = filteredLocations.reduce((groups, location) => {
    const country = location.country;
    if (!groups[country]) {
      groups[country] = [];
    }
    groups[country].push(location);
    return groups;
  }, {} as Record<string, Location[]>);

  const handleSelectLocation = (location: Location) => {
    form.setValue('location', location.name);
    setLocationInputValue("");
    setLocationPopoverOpen(false);
  };

  const resetFilters = () => {
    setActiveFilter('all');
    setActiveRegion(null);
  };

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
                  {field.value ? (
                    <span className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 shrink-0" />
                      {field.value}
                    </span>
                  ) : (
                    "Select location..."
                  )}
                  <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Tabs defaultValue="search" className="w-full">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="filter">Filter</TabsTrigger>
                  </TabsList>
                  {(activeFilter !== 'all' || activeRegion) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
                
                <TabsContent value="search" className="p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search UK/Ireland location..." 
                      value={locationInputValue}
                      onValueChange={setLocationInputValue}
                      className="h-9"
                    />
                    <CommandList className="max-h-[300px]">
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
                              {field.value === location.name && (
                                <Check className="h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </TabsContent>
                
                <TabsContent value="filter" className="p-3 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Country</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={activeFilter === 'all' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveFilter('all')}
                      >
                        All
                      </Badge>
                      <Badge 
                        variant={activeFilter === 'UK' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveFilter('UK')}
                      >
                        UK
                      </Badge>
                      <Badge 
                        variant={activeFilter === 'Ireland' ? 'default' : 'outline'} 
                        className="cursor-pointer"
                        onClick={() => setActiveFilter('Ireland')}
                      >
                        Ireland
                      </Badge>
                    </div>
                  </div>
                  
                  {activeFilter === 'UK' && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Region</h4>
                      <div className="flex flex-wrap gap-2">
                        {regions.UK.map(region => (
                          <Badge 
                            key={region}
                            variant={activeRegion === region ? 'default' : 'outline'} 
                            className="cursor-pointer"
                            onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
