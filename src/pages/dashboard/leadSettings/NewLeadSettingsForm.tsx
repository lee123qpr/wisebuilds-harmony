
import React from 'react';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSettingsSchema, LeadSettingsFormValues } from './schema';
import { useLeadSettingsData } from './hooks/useLeadSettingsData';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { FormActions } from './components/FormActions';

const NewLeadSettingsForm = () => {
  const { leadSettings, isLoading } = useLeadSettingsData();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);
  
  // Create form with zod validation
  const form = useForm<LeadSettingsFormValues>({
    resolver: zodResolver(leadSettingsSchema),
    defaultValues: {
      role: '',
      location: '',
      budget: '',
      duration: '',
      work_type: '',
      project_type: [],
      keywords: [],
      hiring_status: '',
      requires_insurance: false,
      requires_site_visits: false,
      notifications_enabled: true,
      email_alerts: true,
    },
    mode: 'onChange',
  });

  // Update form with existing settings when data is loaded
  React.useEffect(() => {
    if (!leadSettings || isFormInitialized) return;
    
    console.log('Setting form values from existing settings:', leadSettings);
    
    // Handle arrays safely - ensure they're always arrays
    const project_type = Array.isArray(leadSettings.project_type) 
      ? leadSettings.project_type 
      : (leadSettings.project_type ? [leadSettings.project_type] : []);
    
    const keywords = Array.isArray(leadSettings.keywords) 
      ? leadSettings.keywords 
      : (leadSettings.keywords ? [leadSettings.keywords] : []);
    
    // Create values object with correct types
    const values: LeadSettingsFormValues = {
      role: leadSettings.role || '',
      location: leadSettings.location || '',
      budget: leadSettings.budget || leadSettings.max_budget || '',
      duration: leadSettings.duration || '',
      work_type: leadSettings.work_type || '',
      project_type,
      keywords,
      hiring_status: leadSettings.hiring_status || '',
      requires_insurance: !!leadSettings.requires_insurance,
      requires_site_visits: !!leadSettings.requires_site_visits,
      notifications_enabled: leadSettings.notifications_enabled !== false,
      email_alerts: leadSettings.email_alerts !== false,
    };
    
    form.reset(values);
    setIsFormInitialized(true);
  }, [leadSettings, form, isFormInitialized]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (values: LeadSettingsFormValues) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Form values received for saving:', values);
      
      // Ensure arrays are properly handled
      const project_type = Array.isArray(values.project_type) ? values.project_type : [];
      const keywords = Array.isArray(values.keywords) ? values.keywords : [];
      
      // Ensure booleans are proper boolean values
      const requires_insurance = !!values.requires_insurance;
      const requires_site_visits = !!values.requires_site_visits;
      const notifications_enabled = !!values.notifications_enabled; 
      const email_alerts = !!values.email_alerts;
      
      const settingsData = {
        user_id: user.id,
        role: values.role || '',
        location: values.location || '',
        budget: values.budget || '',
        max_budget: values.budget || '',
        duration: values.duration || '',
        work_type: values.work_type || '',
        project_type,
        keywords,
        hiring_status: values.hiring_status || '',
        requires_insurance,
        requires_site_visits,
        notifications_enabled,
        email_alerts,
        updated_at: new Date().toISOString()
      };
      
      if (leadSettings?.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('lead_settings')
          .update(settingsData)
          .eq('id', leadSettings.id)
          .select();
        
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        
        console.log('Settings updated successfully:', data);
        return data?.[0] || { ...leadSettings, ...settingsData };
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('lead_settings')
          .insert({
            ...settingsData, 
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        
        console.log('Settings created successfully:', data);
        return data?.[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      toast({
        title: leadSettings ? 'Settings updated' : 'Settings created',
        description: 'Your lead settings have been saved successfully',
        variant: 'default',
      });
      
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

  const onSubmit = (values: LeadSettingsFormValues) => {
    console.log('Form submitted with values:', values);
    saveSettingsMutation.mutate(values);
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

export default NewLeadSettingsForm;
