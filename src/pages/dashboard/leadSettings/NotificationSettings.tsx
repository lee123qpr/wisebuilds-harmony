
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { LeadSettingsFormValues } from './schema';
import EmailSettingsGroup from './components/EmailSettingsGroup';

const NotificationSettings: React.FC<{ form: UseFormReturn<LeadSettingsFormValues> }> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        
        <FormField
          control={form.control}
          name="notifications_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable In-App Notifications</FormLabel>
                <FormDescription>
                  Receive notifications about new matching projects in the app
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <EmailSettingsGroup form={form} />
    </div>
  );
};

export default NotificationSettings;
