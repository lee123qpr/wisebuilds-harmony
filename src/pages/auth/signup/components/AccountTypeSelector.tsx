
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";

type AccountTypeSelectorProps = {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
};

const AccountTypeSelector = ({ form, isLoading }: AccountTypeSelectorProps) => {
  const userType = form.watch('userType');
  
  return (
    <FormField
      control={form.control}
      name="userType"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel>Account Type</FormLabel>
          <FormControl>
            <ToggleGroup
              type="single"
              variant="outline"
              className="justify-start w-full border rounded-md p-1"
              value={field.value}
              onValueChange={(value) => {
                if (value) field.onChange(value);
              }}
              disabled={isLoading}
            >
              <ToggleGroupItem 
                value="freelancer" 
                className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Freelancer
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="business" 
                className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Client
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="admin" 
                className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Admin
              </ToggleGroupItem>
            </ToggleGroup>
          </FormControl>
          <FormDescription>
            {userType === 'freelancer' 
              ? "Select Freelancer if you're looking for construction projects" 
              : userType === 'business'
                ? "Select Client if you want to post construction projects"
                : "Select Admin for administrative access"}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AccountTypeSelector;
