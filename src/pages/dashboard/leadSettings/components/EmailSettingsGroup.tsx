
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { LeadSettingsFormValues } from '../schema';

const EmailSettingsGroup: React.FC<{ form: UseFormReturn<LeadSettingsFormValues> }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Email Notification Preferences</h3>
      <p className="text-sm text-muted-foreground">
        Control how and when you receive email notifications about new leads and updates.
      </p>
      
      <FormField
        control={form.control}
        name="email_alerts"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Email Notifications</FormLabel>
              <FormDescription>
                Receive email notifications about new matching projects and updates
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
      
      <div className="text-sm px-4 pt-2 pb-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p>
          <strong>Note:</strong> You will receive email notifications for:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>New projects matching your lead settings</li>
          <li>Updates to projects you've applied to</li>
          <li>Messages from clients</li>
          <li>When you're hired for a project</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailSettingsGroup;
