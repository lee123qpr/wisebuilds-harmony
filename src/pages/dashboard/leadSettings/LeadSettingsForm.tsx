
import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { useLeadSettingsForm } from './hooks/useLeadSettingsForm';
import { useLeadSettingsMutation } from './hooks/useLeadSettingsMutation';
import { FormActions } from './components/FormActions';
import { LeadSettingsFormValues } from './schema';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const LeadSettingsForm = () => {
  const { form, existingSettings, isLoading } = useLeadSettingsForm();
  const saveSettingsMutation = useLeadSettingsMutation(existingSettings);
  const { toast } = useToast();

  const onSubmit = (values: LeadSettingsFormValues) => {
    console.log('Form submitted with values:', values);
    
    try {
      saveSettingsMutation.mutate(values);
    } catch (error) {
      console.error('Error in submit handler:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    }
  };

  // Debug output
  React.useEffect(() => {
    console.log('Form state in LeadSettingsForm:', {
      isLoading,
      existingSettings,
      formValues: form.getValues(),
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
    });
  }, [form, isLoading, existingSettings]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Lead Settings</CardTitle>
        <CardDescription>
          Configure what types of projects you want to receive as leads
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            isSubmitting={saveSettingsMutation.isPending} 
            isLoading={isLoading} 
          />
        </form>
      </Form>
    </Card>
  );
};

export default LeadSettingsForm;
