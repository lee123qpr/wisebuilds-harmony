
import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { filterLocations, Location } from '@/utils/location';
import { UseFormReturn } from 'react-hook-form';
import { FilterTabs } from './FilterTabs';
import { LocationSearchContent } from './LocationSearchContent';

interface LocationFieldProps {
  form: any; // This is generic to work with different form schemas
  name?: string; // Optional field name, defaults to 'location'
  label?: string; // Optional label, defaults to 'Location'
  description?: string; // Optional description text
}

export const LocationField: React.FC<LocationFieldProps> = ({ 
  form, 
  name = 'location',
  label = 'Location',
  description = 'Where the work will be performed (UK and Ireland locations only)'
}) => {
  const [locationInputValue, setLocationInputValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'UK' | 'Ireland'>('all');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const selectedLocation = form.watch(name);

  useEffect(() => {
    setFilteredLocations(
      filterLocations(locationInputValue, {
        country: activeFilter !== 'all' ? activeFilter as 'UK' | 'Ireland' : undefined,
        region: activeRegion || undefined,
        minInputLength: 0, // Show results immediately
        limit: 100 // Show more locations
      })
    );
  }, [locationInputValue, activeFilter, activeRegion]);

  // Group locations by country and region for better organization
  const groupedLocations = filteredLocations.reduce((groups, location) => {
    const country = location.country;
    if (!groups[country]) {
      groups[country] = [];
    }
    groups[country].push(location);
    return groups;
  }, {} as Record<string, Location[]>);

  const handleSelectLocation = (location: Location) => {
    form.setValue(name, location.name);
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
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
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
              <FilterTabs 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                activeRegion={activeRegion}
                setActiveRegion={setActiveRegion}
                resetFilters={resetFilters}
              />
              
              <div className="search-content">
                <LocationSearchContent 
                  locationInputValue={locationInputValue}
                  setLocationInputValue={setLocationInputValue}
                  groupedLocations={groupedLocations}
                  handleSelectLocation={handleSelectLocation}
                  selectedLocation={field.value}
                  filteredLocations={filteredLocations}
                />
              </div>
            </PopoverContent>
          </Popover>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
