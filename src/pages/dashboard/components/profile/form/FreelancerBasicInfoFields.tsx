
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerBasicInfoFieldsProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const professions = [
  "Architect",
  "Building Surveyor",
  "Civil Engineer", 
  "Construction Estimator",
  "Electrical Engineer",
  "Interior Designer",
  "Mechanical Engineer",
  "Project Manager",
  "Quantity Surveyor",
  "Structural Engineer"
];

const FreelancerBasicInfoFields: React.FC<FreelancerBasicInfoFieldsProps> = ({ form, disabled = false }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-md border shadow-sm">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  {...field} 
                  disabled={disabled} 
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-md border shadow-sm">
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Profession</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ""} 
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:ring-primary">
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80">
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="mt-2">
                  Your primary professional role
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-white p-5 rounded-md border shadow-sm">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="City, Country" 
                    {...field} 
                    disabled={disabled} 
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormDescription className="mt-2">
                  Your primary work location
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FreelancerBasicInfoFields;
