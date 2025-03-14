
import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { useLeadSettingsForm } from './hooks/useLeadSettingsForm';
import { useLeadSettingsMutation } from './hooks/useLeadSettingsMutation';
import { FormActions } from './components/FormActions';
import { LeadSettingsFormValues } from './schema';

const LeadSettingsForm = () => {
  const { form, existingSettings, isLoading } = useLeadSettingsForm();
  const saveSettingsMutation = useLeadSettingsMutation(existingSettings);

  const onSubmit = (values: LeadSettingsFormValues) => {
    console.log('Form submitted with values:', values);
    saveSettingsMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Lead Settings</CardTitle>
        <CardDescription>
          Configure what types of projects you want to receive as leads
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <LeadSettingsFields form={form} />
                <NotificationSettings form={form} />
              </>
            )}
          </CardContent>
          <FormActions 
            isSubmitting={saveSettingsMutation.isPending} 
            isLoading={isLoading} 
          />
        </form>
      </Form>
    </Card>
  );
};

export default LeadSettingsForm;
