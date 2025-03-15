
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FreelancerFormValues } from './FreelancerSignupForm';

type ProfessionalInfoFieldsProps = {
  form: UseFormReturn<FreelancerFormValues>;
  isLoading: boolean;
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

const ProfessionalInfoFields = ({ form, isLoading }: ProfessionalInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="profession"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profession</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {professions.map((profession) => (
                  <SelectItem key={profession} value={profession}>
                    {profession}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="London, UK" {...field} disabled={isLoading} />
            </FormControl>
            <FormDescription>
              City, Country
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfessionalInfoFields;
