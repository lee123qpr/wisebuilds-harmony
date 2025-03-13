
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { leadSettingsSchema, LeadSettingsFormValues } from './schema';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LeadSettingsForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch existing lead settings
  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ['leadSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('lead_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching lead settings:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  const form = useForm<LeadSettingsFormValues>({
    resolver: zodResolver(leadSettingsSchema),
    defaultValues: {
      role: '',
      location: '',
      max_budget: '',
      work_type: '',
      project_type: [],
      keywords: [],
      notifications_enabled: true,
      email_alerts: true,
    },
  });
  
  // Update form with existing settings when data is loaded
  React.useEffect(() => {
    if (existingSettings) {
      form.reset({
        role: existingSettings.role,
        location: existingSettings.location,
        max_budget: existingSettings.max_budget || '',
        work_type: existingSettings.work_type || '',
        project_type: existingSettings.project_type || [],
        keywords: existingSettings.keywords || [],
        notifications_enabled: existingSettings.notifications_enabled,
        email_alerts: existingSettings.email_alerts,
      });
    }
  }, [existingSettings, form]);
  
  // Create or update settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (values: LeadSettingsFormValues) => {
      if (!user) throw new Error('User not authenticated');
      
      const settingsData = {
        user_id: user.id,
        ...values,
        updated_at: new Date().toISOString()
      };
      
      if (existingSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('lead_settings')
          .update(settingsData)
          .eq('id', existingSettings.id);
        
        if (error) throw error;
        return { ...existingSettings, ...settingsData };
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('lead_settings')
          .insert([{ 
            ...settingsData, 
            created_at: new Date().toISOString() 
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      toast({
        title: existingSettings ? 'Settings updated' : 'Settings created',
        description: 'Your lead settings have been saved',
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
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/freelancer')}
              disabled={saveSettingsMutation.isPending || isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saveSettingsMutation.isPending || isLoading}
            >
              {saveSettingsMutation.isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                  Saving...
                </>
              ) : 'Save Settings'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LeadSettingsForm;
