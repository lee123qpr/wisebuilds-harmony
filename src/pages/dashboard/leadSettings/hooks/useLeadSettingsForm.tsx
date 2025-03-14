
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { leadSettingsSchema, LeadSettingsFormValues } from '../schema';
import { useAuth } from '@/context/AuthContext';

export const useLeadSettingsForm = () => {
  const { user } = useAuth();
  
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
  });
  
  // Fetch existing lead settings
  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ['leadSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching lead settings for user:', user.id);
      
      const { data, error } = await supabase
        .from('lead_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching lead settings:', error);
        throw error;
      }
      
      console.log('Retrieved lead settings:', data);
      return data;
    },
    enabled: !!user
  });
  
  // Update form with existing settings when data is loaded
  React.useEffect(() => {
    if (existingSettings) {
      console.log('Setting form values from existing settings:', existingSettings);
      
      form.reset({
        role: existingSettings.role || '',
        location: existingSettings.location || '',
        budget: existingSettings.budget || '',
        duration: existingSettings.duration || '',
        work_type: existingSettings.work_type || '',
        project_type: Array.isArray(existingSettings.project_type) ? existingSettings.project_type : [],
        keywords: Array.isArray(existingSettings.keywords) ? existingSettings.keywords : [],
        hiring_status: existingSettings.hiring_status || '',
        requires_insurance: existingSettings.requires_insurance !== undefined ? existingSettings.requires_insurance : false,
        requires_site_visits: existingSettings.requires_site_visits !== undefined ? existingSettings.requires_site_visits : false,
        notifications_enabled: existingSettings.notifications_enabled !== undefined ? existingSettings.notifications_enabled : true,
        email_alerts: existingSettings.email_alerts !== undefined ? existingSettings.email_alerts : true,
      });
      
      // Log the form state after reset
      console.log('Form state after reset:', form.getValues());
    }
  }, [existingSettings, form]);

  return {
    form,
    existingSettings,
    isLoading,
  };
};
