
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FreelancerFormValues } from './FreelancerSignupForm';

type PersonalInfoFieldsProps = {
  form: UseFormReturn<FreelancerFormValues>;
  isLoading: boolean;
};

const PersonalInfoFields = ({ form, isLoading }: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Smith" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="name@example.com" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoFields;
