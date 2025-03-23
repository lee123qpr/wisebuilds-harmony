
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LeadSettingsFormValues } from '../schema';

export const useLeadSettingsMutation = (existingSettings: any) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (values: LeadSettingsFormValues) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Form values received for saving:', values);
      
      // Ensure arrays are properly handled
      const project_type = Array.isArray(values.project_type) ? values.project_type : [];
      
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
        hiring_status: values.hiring_status || '',
        requires_insurance,
        requires_site_visits,
        notifications_enabled,
        email_alerts,
        updated_at: new Date().toISOString()
      };
      
      if (existingSettings?.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('lead_settings')
          .update(settingsData)
          .eq('id', existingSettings.id)
          .select();
        
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        
        console.log('Settings updated successfully:', data);
        return data?.[0] || { ...existingSettings, ...settingsData };
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
        title: existingSettings ? 'Settings updated' : 'Settings created',
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

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending
  };
};
