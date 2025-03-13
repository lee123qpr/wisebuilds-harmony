
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BusinessFormValues } from "../types";

type CompanyInfoFieldsProps = {
  form: UseFormReturn<BusinessFormValues>;
  isLoading: boolean;
};

const CompanyInfoFields = ({ form, isLoading }: CompanyInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="ABC Construction Ltd" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="companyAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Business Street, London, UK" {...field} disabled={isLoading} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="companyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description of your company and the types of projects you typically handle..." 
                {...field} 
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </FormControl>
            <FormDescription>
              This will be visible to professionals reviewing your projects.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CompanyInfoFields;
