
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from './schema';

interface StartDateFieldProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const StartDateField: React.FC<StartDateFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="startDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Preferred Start Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  type="button" // Explicitly set type to button to prevent form submission
                  onClick={(e) => {
                    // Stop propagation to prevent other components from reacting
                    e.stopPropagation();
                  }}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0 z-50" 
              align="start"
              onClick={(e) => e.stopPropagation()} // Stop click events inside popover from propagating
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            When you would like the project to start
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
