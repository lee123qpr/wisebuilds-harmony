
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { clientProfileSchema } from './schema';
import * as z from 'zod';
import { LocationField } from '@/components/location/LocationField';

type ProfileFormProps = {
  form: UseFormReturn<z.infer<typeof clientProfileSchema>>;
  disabled?: boolean;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ form, disabled = false }) => {
  // Add custom CSS class for disabled fields
  const getDisabledClass = () => {
    return disabled ? "cursor-default opacity-80 bg-muted" : "";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter company name" 
                  {...field} 
                  disabled={disabled} 
                  className={getDisabledClass()}
                />
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter full name" 
                  {...field} 
                  disabled={disabled} 
                  className={getDisabledClass()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <LocationField
        form={form}
        name="companyLocation"
        label="Company Location"
        description="Company's primary location or headquarters address"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter phone number" 
                  {...field} 
                  disabled={disabled} 
                  className={getDisabledClass()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input 
                  placeholder="example.com" 
                  {...field} 
                  disabled={disabled} 
                  className={getDisabledClass()}
                />
              </FormControl>
              <FormDescription>Enter domain without http:// (it will be added automatically)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Type</FormLabel>
              <Select 
                disabled={disabled} 
                value={field.value || ""} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className={disabled ? "cursor-default opacity-80" : ""}>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Limited Company">Limited Company</SelectItem>
                  <SelectItem value="Sole Trader">Sole Trader</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                  <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyTurnover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Turnover</FormLabel>
              <Select 
                disabled={disabled} 
                value={field.value || ""} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className={disabled ? "cursor-default opacity-80" : ""}>
                    <SelectValue placeholder="Select turnover range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Under £50,000">Under £50,000</SelectItem>
                  <SelectItem value="£50,000 - £100,000">£50,000 - £100,000</SelectItem>
                  <SelectItem value="£100,000 - £500,000">£100,000 - £500,000</SelectItem>
                  <SelectItem value="£500,000 - £1 million">£500,000 - £1 million</SelectItem>
                  <SelectItem value="£1 million - £5 million">£1 million - £5 million</SelectItem>
                  <SelectItem value="£5 million +">£5 million +</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="employeeSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Employees</FormLabel>
              <Select 
                disabled={disabled} 
                value={field.value || ""} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className={disabled ? "cursor-default opacity-80" : ""}>
                    <SelectValue placeholder="Select employee range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="6-10">6-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-100">51-100</SelectItem>
                  <SelectItem value="101-500">101-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companySpecialism"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Specialism</FormLabel>
              <Select 
                disabled={disabled} 
                value={field.value || ""} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className={disabled ? "cursor-default opacity-80" : ""}>
                    <SelectValue placeholder="Select specialism" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Residential Construction">Residential Construction</SelectItem>
                  <SelectItem value="Commercial Construction">Commercial Construction</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Industrial Construction">Industrial Construction</SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                  <SelectItem value="Interior Design">Interior Design</SelectItem>
                  <SelectItem value="Landscaping">Landscaping</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="companyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Briefly describe your company and services..."
                className={`min-h-[120px] ${getDisabledClass()}`}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormDescription>
              Provide a short description of your company and services
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileForm;
