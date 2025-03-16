
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

/**
 * Gets client information from client_profiles table
 */
export const getClientInfo = async (clientId: string): Promise<ClientInfo> => {
  // Try to get client info from client_profiles
  const { data: clientProfile, error: clientError } = await supabase
    .from('client_profiles')
    .select('contact_name, company_name, phone_number, website, company_address, logo_url, email')
    .eq('id', clientId)
    .maybeSingle();
  
  if (clientError) {
    console.error('Error fetching client profile:', clientError);
  }
  
  // If profile exists with essential data, return it
  if (clientProfile) {
    // If the profile has at least one of the essential fields, return it
    if (clientProfile.contact_name || clientProfile.email || clientProfile.phone_number) {
      return {
        contact_name: clientProfile.contact_name || 'Unknown Client',
        company_name: clientProfile.company_name,
        logo_url: clientProfile.logo_url,
        phone_number: clientProfile.phone_number,
        website: clientProfile.website,
        company_address: clientProfile.company_address,
        email: clientProfile.email
      };
    }
  }
  
  // If no complete profile or if essential data is missing, try to get user data from auth
  try {
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-email',
      {
        body: { userId: clientId }
      }
    );
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      
      // If we have partial client profile data (but missing essential fields), use that
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
    
    // Combine data from both sources, prioritizing client profile data
    return {
      contact_name: clientProfile?.contact_name || userData.full_name || 'Unknown Client',
      company_name: clientProfile?.company_name || null,
      logo_url: clientProfile?.logo_url || null,
      phone_number: clientProfile?.phone_number || null,
      website: clientProfile?.website || null,
      company_address: clientProfile?.company_address || null,
      email: clientProfile?.email || userData.email || null
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
        email: clientProfile.email
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
