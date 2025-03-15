
import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { FormActions } from './components/FormActions';
import { useLeadSettingsSubmit } from './hooks/useLeadSettingsSubmit';
import { useLeadSettingsForm } from './hooks/useLeadSettingsForm';

const NewLeadSettingsForm = () => {
  const { form, leadSettings, isLoading } = useLeadSettingsForm();
  const { handleSubmit, isSubmitting } = useLeadSettingsSubmit(leadSettings);

  // Debug output
  React.useEffect(() => {
    console.log('Form state in NewLeadSettingsForm:', {
      isLoading,
      leadSettings,
      formValues: form.getValues(),
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
    });
  }, [form, isLoading, leadSettings]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Lead Settings</CardTitle>
        <CardDescription>
          Configure what types of projects you want to receive as leads
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Progress value={45} className="w-full" />
                <p className="text-muted-foreground">Loading your settings...</p>
              </div>
            ) : (
              <>
                <LeadSettingsFields form={form} />
                <NotificationSettings form={form} />
              </>
            )}
          </CardContent>
          <FormActions 
            isSubmitting={isSubmitting} 
            isLoading={isLoading} 
          />
        </form>
      </Form>
    </Card>
  );
};

export default NewLeadSettingsForm;
