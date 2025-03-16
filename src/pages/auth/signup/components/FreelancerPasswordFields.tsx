
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FreelancerFormValues } from './FreelancerSignupForm';

type FreelancerPasswordFieldsProps = {
  form: UseFormReturn<FreelancerFormValues>;
  isLoading: boolean;
};

const FreelancerPasswordFields = ({ form, isLoading }: FreelancerPasswordFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FreelancerPasswordFields;
