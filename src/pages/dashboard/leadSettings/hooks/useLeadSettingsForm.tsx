
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
    if (!existingSettings) return;
    
    console.log('Setting form values from existing settings:', existingSettings);
    
    // Ensure array fields are properly handled - convert to arrays if they're not already
    let project_type = [];
    try {
      if (existingSettings.project_type) {
        if (Array.isArray(existingSettings.project_type)) {
          project_type = existingSettings.project_type;
        } else if (typeof existingSettings.project_type === 'string') {
          // Try to parse if it's a JSON string
          project_type = JSON.parse(existingSettings.project_type);
        } else {
          project_type = [existingSettings.project_type];
        }
      }
    } catch (e) {
      console.error('Error parsing project_type:', e);
      project_type = existingSettings.project_type ? [existingSettings.project_type] : [];
    }
    
    let keywords = [];
    try {
      if (existingSettings.keywords) {
        if (Array.isArray(existingSettings.keywords)) {
          keywords = existingSettings.keywords;
        } else if (typeof existingSettings.keywords === 'string') {
          // Try to parse if it's a JSON string
          keywords = JSON.parse(existingSettings.keywords);
        } else {
          keywords = [existingSettings.keywords];
        }
      }
    } catch (e) {
      console.error('Error parsing keywords:', e);
      keywords = existingSettings.keywords ? [existingSettings.keywords] : [];
    }
    
    // Force the values to be the correct type
    const values = {
      role: existingSettings.role || '',
      location: existingSettings.location || '',
      budget: existingSettings.budget || 
            (existingSettings.max_budget ? existingSettings.max_budget : ''),
      duration: existingSettings.duration || '',
      work_type: existingSettings.work_type || '',
      project_type,
      keywords,
      hiring_status: existingSettings.hiring_status || '',
      requires_insurance: Boolean(existingSettings.requires_insurance),
      requires_site_visits: Boolean(existingSettings.requires_site_visits),
      notifications_enabled: Boolean(existingSettings.notifications_enabled),
      email_alerts: Boolean(existingSettings.email_alerts),
    };
    
    console.log('Form values being set:', values);
    
    // Reset form with values from database - using setTimeout to ensure it runs after React rendering
    setTimeout(() => {
      form.reset(values);
      console.log('Form state after reset:', form.getValues());
    }, 0);
    
  }, [existingSettings, form]);

  return {
    form,
    existingSettings,
    isLoading,
  };
};
