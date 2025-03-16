
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

export const getClientInfo = async (clientId: string): Promise<ClientInfo> => {
  try {
    // First, try to get data from client_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', clientId)
      .maybeSingle();
    
    // If no profile found, get basic user data
    if (!profileData && clientId) {
      try {
        const { data: userData, error: userError } = await supabase.functions.invoke('get-user-email', {
          body: { userId: clientId }
        });
        
        if (userError || !userData) {
          return {
            id: clientId,
            company_name: 'Unknown Client',
            contact_name: null
          };
        }
        
        return {
          id: clientId,
          company_name: userData.full_name || 'Unknown Client',
          contact_name: userData.full_name || null,
          email: userData.email || null
        };
      } catch (error) {
        console.error('Error calling edge function:', error);
        return {
          id: clientId,
          company_name: 'Unknown Client',
          contact_name: null
        };
      }
    }
    
    // If profile found, format and return
    return {
      id: clientId,
      company_name: profileData?.company_name || 'Unknown Client',
      contact_name: profileData?.contact_name || null,
      logo_url: profileData?.logo_url || null,
      email: profileData?.email || null,
      phone_number: profileData?.phone_number || null,
      location: profileData?.company_address || null
    };
  } catch (error) {
    console.error('Error getting client info:', error);
    return {
      id: clientId,
      company_name: 'Unknown Client',
      contact_name: null
    };
  }
};
