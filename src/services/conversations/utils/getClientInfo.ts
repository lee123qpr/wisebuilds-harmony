
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

/**
 * Gets client information from either client_profiles or auth user data
 */
export const getClientInfo = async (clientId: string): Promise<ClientInfo> => {
  // Try to get client info from client_profiles
  const { data: clientData, error: clientError } = await supabase
    .from('client_profiles')
    .select('contact_name, company_name')
    .eq('id', clientId)
    .maybeSingle();
  
  if (clientError) {
    console.error('Error fetching client info:', clientError);
  }
  
  // If profile exists, return the data
  if (clientData) {
    return {
      contact_name: clientData.contact_name || 'Unknown Client',
      company_name: clientData.company_name,
      email: null
    };
  }
  
  // If no profile, try to get user data from auth using edge function
  try {
    const { data: userData, error: userError } = await supabase.functions.invoke('get-user-email', {
      body: { userId: clientId }
    });
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      return {
        contact_name: 'Unknown Client',
        company_name: null,
        email: null
      };
    }
    
    // Use the full name if available, otherwise fallback to email username
    return {
      contact_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Client'),
      company_name: null,
      email: userData.email || null
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    return {
      contact_name: 'Unknown Client',
      company_name: null,
      email: null
    };
  }
};
