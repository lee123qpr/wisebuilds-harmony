
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientProfileData } from '@/pages/client/types';

export const useClientProfile = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ['clientProfile', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('No client ID provided');
      
      console.log('Fetching client profile with ID:', clientId);
      
      // Fetch from client_profiles table
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching client profile:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No client profile found with ID:', clientId);
        throw new Error('Client profile not found');
      }
      
      console.log('Client profile data found:', data);
      return data as ClientProfileData;
    },
    enabled: !!clientId,
    retry: 1
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
