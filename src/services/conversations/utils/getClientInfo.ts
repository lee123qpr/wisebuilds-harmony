
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

/**
 * Gets client full name from either client_profiles or auth user data
 */
export const getClientInfo = async (clientId: string): Promise<ClientInfo> => {
  console.log('getClientInfo called with clientId:', clientId);
  
  if (!clientId) {
    console.error('No clientId provided to getClientInfo');
    return {
      contact_name: 'Client',
      company_name: null,
      logo_url: null,
      email: null
    };
  }
  
  // Try to get client info from client_profiles first
  const { data: clientProfile, error: clientError } = await supabase
    .from('client_profiles')
    .select('contact_name, company_name, logo_url, email')
    .eq('id', clientId)
    .maybeSingle();
  
  if (clientError) {
    console.error('Error fetching client profile:', clientError);
  }
  
  console.log('Client profile data from database:', clientProfile);
  
  // If profile exists with contact_name, return it immediately
  if (clientProfile && clientProfile.contact_name) {
    console.log('Returning client name from profile:', clientProfile.contact_name);
    return {
      contact_name: clientProfile.contact_name,
      company_name: clientProfile.company_name,
      logo_url: clientProfile.logo_url,
      email: clientProfile.email
    };
  }
  
  // If no complete profile, try to get user data from auth using edge function
  try {
    console.log('Attempting to fetch user data from edge function for userId:', clientId);
    
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-email',
      {
        body: { userId: clientId }
      }
    );
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      return {
        contact_name: 'Client',
        company_name: null,
        logo_url: null,
        email: null
      };
    }
    
    console.log('User data received from edge function:', userData);
    
    // Extract full name from metadata or use a default value
    const fullName = userData.full_name || 
                    (userData.user_metadata?.full_name) || 
                    (userData.email ? userData.email.split('@')[0] : 'Client');
                    
    console.log('Extracted full name:', fullName);
    
    // Return the full name
    return {
      contact_name: fullName,
      company_name: null,
      logo_url: null,
      email: userData.email
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // No data available
    return {
      contact_name: 'Client',
      company_name: null,
      logo_url: null,
      email: null
    };
  }
};
