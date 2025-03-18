
import React from 'react';
import { format } from 'date-fns';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../schema/quoteFormSchema';

interface AvailableStartDateProps {
  form: UseFormReturn<QuoteFormValues>;
}

const AvailableStartDate: React.FC<AvailableStartDateProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="availableStartDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Available to Start On</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            When can you start working on this project?
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AvailableStartDate;
