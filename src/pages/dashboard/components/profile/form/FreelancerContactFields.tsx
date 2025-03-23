
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Phone, Globe } from 'lucide-react';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerContactFieldsProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerContactFields: React.FC<FreelancerContactFieldsProps> = ({ form, disabled = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-5 rounded-md border shadow-sm">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter phone number" 
                  {...field} 
                  disabled={disabled} 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </FormControl>
              <FormDescription className="mt-2">
                This will be visible to clients after they purchase your contact information
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="bg-white p-5 rounded-md border shadow-sm">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Website
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="example.com" 
                  {...field} 
                  disabled={disabled}
                  className="border-gray-300 focus:border-primary focus:ring-primary" 
                />
              </FormControl>
              <FormDescription className="mt-2">
                Enter domain without http:// (it will be added automatically)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FreelancerContactFields;
