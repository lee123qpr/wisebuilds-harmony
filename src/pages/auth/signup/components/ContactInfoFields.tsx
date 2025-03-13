
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BusinessFormValues } from "../types";

type ContactInfoFieldsProps = {
  form: UseFormReturn<BusinessFormValues>;
  isLoading: boolean;
};

const ContactInfoFields = ({ form, isLoading }: ContactInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Email</FormLabel>
            <FormControl>
              <Input placeholder="info@abcconstruction.co.uk" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Phone</FormLabel>
            <FormControl>
              <Input placeholder="+44 20 1234 5678" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactInfoFields;
