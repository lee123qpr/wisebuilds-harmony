
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

/**
 * Gets client information from either client_profiles or auth user data
 */
export const getClientInfo = async (clientId: string): Promise<ClientInfo> => {
  // Try to get client info from client_profiles
  const { data: clientProfile, error: clientError } = await supabase
    .from('client_profiles')
    .select('contact_name, company_name, phone_number, website, company_address, logo_url')
    .eq('id', clientId)
    .maybeSingle();
  
  if (clientError) {
    console.error('Error fetching client profile:', clientError);
  }
  
  // If profile exists with essential data, return it
  if (clientProfile && clientProfile.contact_name) {
    return {
      contact_name: clientProfile.contact_name,
      company_name: clientProfile.company_name,
      logo_url: clientProfile.logo_url,
      phone_number: clientProfile.phone_number,
      website: clientProfile.website,
      company_address: clientProfile.company_address,
      email: null
    };
  }
  
  // If no complete profile, try to get user data from auth using edge function
  try {
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-email',
      {
        body: { userId: clientId }
      }
    );
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      
      // If we have partial client profile data (but no contact_name), use that
      if (clientProfile) {
        return {
          contact_name: 'Unknown Client',
          company_name: clientProfile.company_name,
          logo_url: clientProfile.logo_url,
          phone_number: clientProfile.phone_number,
          website: clientProfile.website,
          company_address: clientProfile.company_address,
          email: null
        };
      }
      
      // No data available at all
      return {
        contact_name: 'Unknown Client',
        company_name: null,
        logo_url: null,
        email: null
      };
    }
    
    // Combine data from both sources
    return {
      contact_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Client'),
      company_name: clientProfile?.company_name || null,
      logo_url: clientProfile?.logo_url || null,
      phone_number: clientProfile?.phone_number || null,
      website: clientProfile?.website || null,
      company_address: clientProfile?.company_address || null,
      email: userData.email || null
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // If we have partial client profile data, use that
    if (clientProfile) {
      return {
        contact_name: clientProfile.contact_name || 'Unknown Client',
        company_name: clientProfile.company_name,
        logo_url: clientProfile.logo_url,
        phone_number: clientProfile.phone_number,
        website: clientProfile.website,
        company_address: clientProfile.company_address,
        email: null
      };
    }
    
    // No data available at all
    return {
      contact_name: 'Unknown Client',
      company_name: null,
      logo_url: null,
      email: null
    };
  }
};
