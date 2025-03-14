
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { leadSettingsSchema, LeadSettingsFormValues } from '../schema';
import { useAuth } from '@/context/AuthContext';

export const useLeadSettingsForm = () => {
  const { user } = useAuth();
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
  
  // Fetch existing lead settings
  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ['leadSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching lead settings for user:', user.id);
      
      try {
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
      } catch (err) {
        console.error('Exception in query function:', err);
        throw err;
      }
    },
    enabled: !!user,
  });
  
  // Update form with existing settings when data is loaded
  React.useEffect(() => {
    if (!existingSettings || isFormInitialized) return;
    
    console.log('Setting form values from existing settings:', existingSettings);
    
    // Handle arrays safely - ensure they're always arrays
    const project_type = Array.isArray(existingSettings.project_type) 
      ? existingSettings.project_type 
      : (existingSettings.project_type ? [existingSettings.project_type] : []);
    
    const keywords = Array.isArray(existingSettings.keywords) 
      ? existingSettings.keywords 
      : (existingSettings.keywords ? [existingSettings.keywords] : []);
    
    // Create values object with correct types
    const values: LeadSettingsFormValues = {
      role: existingSettings.role || '',
      location: existingSettings.location || '',
      budget: existingSettings.budget || existingSettings.max_budget || '',
      duration: existingSettings.duration || '',
      work_type: existingSettings.work_type || '',
      project_type,
      keywords,
      hiring_status: existingSettings.hiring_status || '',
      requires_insurance: !!existingSettings.requires_insurance,
      requires_site_visits: !!existingSettings.requires_site_visits,
      notifications_enabled: existingSettings.notifications_enabled !== false,
      email_alerts: existingSettings.email_alerts !== false,
    };
    
    console.log('Form values being set:', values);
    
    form.reset(values);
    setIsFormInitialized(true);
    
    console.log('Form state after reset:', form.getValues());
  }, [existingSettings, form, isFormInitialized]);

  return {
    form,
    existingSettings,
    isLoading,
  };
};
