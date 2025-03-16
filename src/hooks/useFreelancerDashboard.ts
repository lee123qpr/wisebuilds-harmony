
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
      
      console.log('Fetched lead settings in useFreelancerDashboard:', data);
      return data as LeadSettings | null;
    },
    enabled: !!user,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });

  return {
    leadSettings,
    isLoadingSettings,
    error,
    refetchLeadSettings
  };
};
