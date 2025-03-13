
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
      
      const settingsData = {
        user_id: user.id,
        role: values.role,
        location: values.location,
        budget: values.budget,
        duration: values.duration,
        work_type: values.work_type,
        project_type: values.project_type,
        keywords: values.keywords,
        hiring_status: values.hiring_status,
        requires_insurance: values.requires_insurance,
        requires_site_visits: values.requires_site_visits,
        notifications_enabled: values.notifications_enabled,
        email_alerts: values.email_alerts,
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
        // Create new settings - add the created_at field
        const { data, error } = await supabase
          .from('lead_settings')
          .insert({
            ...settingsData, 
            created_at: new Date().toISOString()
          })
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

  return saveSettingsMutation;
};
