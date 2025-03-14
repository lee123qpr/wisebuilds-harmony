
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LeadSettingsFormValues } from '../schema';
import { useAuth } from '@/context/AuthContext';

export const useLeadSettingsMutation = (existingSettings: any) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const saveSettingsMutation = useMutation({
    mutationFn: async (values: LeadSettingsFormValues) => {
      if (!user) throw new Error('User not authenticated');
      
      // Log all values received from the form to debug
      console.log('Form values received for saving:', values);
      
      // Ensure arrays are properly handled
      const project_type = Array.isArray(values.project_type) ? values.project_type : [];
      const keywords = Array.isArray(values.keywords) ? values.keywords : [];
      
      // Ensure booleans are proper boolean values
      const requires_insurance = !!values.requires_insurance;
      const requires_site_visits = !!values.requires_site_visits;
      const notifications_enabled = values.notifications_enabled !== false; // Default to true
      const email_alerts = values.email_alerts !== false; // Default to true
      
      const settingsData = {
        user_id: user.id,
        role: values.role || '',
        location: values.location || '',
        budget: values.budget || '',
        max_budget: values.budget || '', // Copy budget to max_budget for compatibility
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
      
      console.log('Data being saved to Supabase:', settingsData);
      
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
    onSuccess: (data) => {
      // Log the data returned from the mutation
      console.log('onSuccess data:', data);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      // Show success toast
      toast({
        title: existingSettings ? 'Settings updated' : 'Settings created',
        description: 'Your lead settings have been saved successfully',
        variant: 'default',
      });
      
      // Navigate to freelancer dashboard
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

  return saveSettingsMutation;
};
