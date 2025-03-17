
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { LeadSettings } from './freelancer/types';

export type { LeadSettings };

export const useFreelancerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { 
    data: leadSettings, 
    isLoading: isLoadingSettings, 
    error,
    refetch: refetchLeadSettings
  } = useQuery({
    queryKey: ['leadSettings', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, skipping lead settings fetch');
        return null;
      }
      
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
      
      console.log('Fetched lead settings in useFreelancerDashboard:', data);
      
      if (!data) {
        console.log('No lead settings found for user');
      }
      
      return data as LeadSettings | null;
    },
    enabled: !!user,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });

  // Function to manually refresh lead settings
  const forceRefreshLeadSettings = () => {
    console.log('Manually refreshing lead settings...');
    queryClient.invalidateQueries({ queryKey: ['leadSettings', user?.id] });
    return refetchLeadSettings();
  };

  return {
    leadSettings,
    isLoadingSettings,
    error,
    refetchLeadSettings: forceRefreshLeadSettings
  };
};
