import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { FormActions } from './components/FormActions';
import { useLeadSettingsForm } from './hooks/useLeadSettingsForm';
import { LeadSettingsFormValues } from './schema';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewLeadSettingsForm = () => {
  const { form, leadSettings, isLoading } = useLeadSettingsForm();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use a direct mutation approach to avoid potential issues with multiple hooks
  const mutation = useMutation({
    mutationFn: async (values: LeadSettingsFormValues) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Form values submitted:', values);
      
      // Format the data for saving
      const settingsData = {
        user_id: user.id,
        role: values.role || '',
        location: values.location || '',
        budget: values.budget || '',
        max_budget: values.budget || '',
        duration: values.duration || '',
        work_type: values.work_type || '',
        project_type: Array.isArray(values.project_type) ? values.project_type : [],
        hiring_status: values.hiring_status || '',
        requires_insurance: !!values.requires_insurance,
        requires_site_visits: !!values.requires_site_visits,
        notifications_enabled: !!values.notifications_enabled,
        email_alerts: !!values.email_alerts,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (leadSettings?.id) {
        // Update existing settings
        console.log('Updating existing settings with ID:', leadSettings.id);
        const { data, error } = await supabase
          .from('lead_settings')
          .update(settingsData)
          .eq('id', leadSettings.id)
          .select();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Settings updated successfully:', data);
        result = data?.[0];
      } else {
        // Create new settings
        console.log('Creating new lead settings');
        const { data, error } = await supabase
          .from('lead_settings')
          .insert({
            ...settingsData, 
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Settings created successfully:', data);
        result = data?.[0];
      }
      
      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      toast({
        title: leadSettings?.id ? 'Settings updated' : 'Settings created',
        description: 'Your lead settings have been saved successfully',
        variant: 'default',
      });
      
      // Redirect to the dashboard
      navigate('/dashboard/freelancer');
    },
    onError: (error: any) => {
      console.error('Error saving lead settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving settings',
        description: error.message || 'Failed to save lead settings',
      });
    }
  });

  const handleSubmit = (values: LeadSettingsFormValues) => {
    console.log('Form submitted with values:', values);
    mutation.mutate(values);
  };

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
            isSubmitting={mutation.isPending} 
            isLoading={isLoading} 
          />
        </form>
      </Form>
    </Card>
  );
};

export default NewLeadSettingsForm;
