
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { LeadSettings } from './types';

type LeadSettingsResponse = LeadSettings | null;

export const useLeadSettingsData = () => {
  const { user } = useAuth();
  
  const { data: leadSettings, isLoading, error } = useQuery<LeadSettingsResponse, Error>({
    queryKey: ['leadSettings', user?.id],
    queryFn: async (): Promise<LeadSettingsResponse> => {
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
      
      return data as LeadSettings | null;
    },
    enabled: !!user
  });

  return {
    leadSettings,
    isLoading,
    error
  };
};
