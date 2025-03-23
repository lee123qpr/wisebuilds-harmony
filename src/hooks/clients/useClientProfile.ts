
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientProfileData } from '@/pages/client/types';

export const useClientProfile = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ['clientProfile', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('No client ID provided');
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .maybeSingle();
        
      if (error) throw error;
      return data as ClientProfileData;
    },
    enabled: !!clientId
  });
};

/**
 * Formats a date string into a more readable format
 */
export const formatProfileDate = (dateString: string | null) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });
};
