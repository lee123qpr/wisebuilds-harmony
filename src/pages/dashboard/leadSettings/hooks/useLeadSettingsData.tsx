
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useLeadSettingsData = () => {
  const { user } = useAuth();
  
  const { data: leadSettings, isLoading, error } = useQuery({
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

  return {
    leadSettings,
    isLoading,
    error
  };
};
