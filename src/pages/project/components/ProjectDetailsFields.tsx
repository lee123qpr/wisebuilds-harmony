
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { filterLocations, getLocationDisplayString, Location } from '@/utils/locationService';
import { ProjectFormValues } from './schema';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Check, MapPin } from 'lucide-react';

const ProjectDetailsFields: React.FC<{ form: UseFormReturn<ProjectFormValues> }> = ({ form }) => {
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
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter project title" {...field} />
            </FormControl>
            <FormDescription>A clear and concise title for your project</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your project in detail..." 
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description of the project, including goals and requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service/Role Required</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Architect, Surveyor, etc." {...field} />
            </FormControl>
            <FormDescription>
              Specify the type of professional or service you need
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
      
      <FormField
        control={form.control}
        name="work_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Work Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on_site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Specify if the work can be done remotely, on-site, or a mix of both
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectDetailsFields;
