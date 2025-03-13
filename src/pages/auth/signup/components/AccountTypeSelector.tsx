
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
                Business Client
              </ToggleGroupItem>
            </ToggleGroup>
          </FormControl>
          <FormDescription>
            {userType === 'freelancer' 
              ? "Select Freelancer if you're looking for construction projects" 
              : "Select Business if you want to post construction projects"}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AccountTypeSelector;
