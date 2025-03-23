
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientProfileData } from '@/pages/client/types';

export const useClientProfile = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ['clientProfile', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('No client ID provided');
      
      console.log('Fetching client profile with ID:', clientId);
      
      // First, try directly from client_profiles
      let { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching client profile:', error);
        throw error;
      }
      
      if (data) {
        console.log('Client profile data found in client_profiles:', data);
        return data as ClientProfileData;
      }

      console.log('No client profile found in client_profiles table, checking auth user...');
      
      // Try to get user information from auth user metadata
      try {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(clientId);
        
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData?.user) {
          console.log('User data found:', userData.user);
          
          // Create a minimal profile from user data
          const userMetadata = userData.user.user_metadata || {};
          const userEmail = userData.user.email;
          
          // Construct a minimal profile
          const minimalProfile: ClientProfileData = {
            id: clientId,
            contact_name: userMetadata.full_name || userMetadata.name || userEmail?.split('@')[0] || 'Client',
            company_name: userMetadata.company_name || null,
            email: userEmail || null,
            phone_number: userMetadata.phone_number || null,
            website: null,
            company_address: null,
            company_description: null,
            member_since: userData.user.created_at || null,
            jobs_completed: null,
            logo_url: null,
            company_type: null,
            employee_size: null,
            company_specialism: null,
            company_turnover: null
          };
          
          console.log('Created minimal profile from user data:', minimalProfile);
          return minimalProfile;
        }
      } catch (err) {
        console.error('Error accessing auth user:', err);
      }
      
      // Try to use edge function as fallback
      try {
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
          'get-user-email',
          { body: { userId: clientId } }
        );
        
        if (edgeError) {
          console.error('Error from edge function:', edgeError);
        } else if (edgeData) {
          console.log('Data from edge function:', edgeData);
          
          // Construct minimal profile from edge function data
          const minimalProfile: ClientProfileData = {
            id: clientId,
            contact_name: edgeData.full_name || edgeData.name || edgeData.email?.split('@')[0] || 'Client',
            company_name: edgeData.user_metadata?.company_name || null,
            email: edgeData.email || null,
            phone_number: edgeData.user_metadata?.phone_number || null,
            website: null,
            company_address: null,
            company_description: null,
            member_since: edgeData.created_at || null,
            jobs_completed: null,
            logo_url: null,
            company_type: null,
            employee_size: null,
            company_specialism: null,
            company_turnover: null
          };
          
          console.log('Created minimal profile from edge function data:', minimalProfile);
          return minimalProfile;
        }
      } catch (err) {
        console.error('Error using edge function:', err);
      }
      
      // If we've reached here, we couldn't find any data
      console.log('No client data found with ID:', clientId);
      throw new Error('Client profile not found');
    },
    enabled: !!clientId,
    retry: 2,
    retryDelay: 1000
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
