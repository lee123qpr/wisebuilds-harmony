
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

/**
 * Gets client information from either client_profiles or auth user data
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
    .select('contact_name, company_name, phone_number, website, company_address, logo_url, email')
    .eq('id', clientId)
    .maybeSingle();
  
  if (clientError) {
    console.error('Error fetching client profile:', clientError);
  }
  
  console.log('Client profile data from database:', clientProfile);
  
  // If profile exists with essential data, return it
  if (clientProfile && clientProfile.contact_name) {
    console.log('Returning client info from profile with contact name:', clientProfile.contact_name);
    return {
      contact_name: clientProfile.contact_name,
      company_name: clientProfile.company_name,
      logo_url: clientProfile.logo_url,
      phone_number: clientProfile.phone_number,
      website: clientProfile.website,
      company_address: clientProfile.company_address,
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
      
      // If we have partial client profile data, use that
      if (clientProfile) {
        return {
          contact_name: clientProfile.contact_name || 'Client',
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
        contact_name: 'Client',
        company_name: null,
        logo_url: null,
        email: null
      };
    }
    
    console.log('User data received from edge function:', userData);
    
    // Extract full name from metadata or create a display name from email
    const fullName = userData.full_name || 
                    (userData.user_metadata?.full_name) || 
                    (userData.email ? userData.email.split('@')[0] : null);
                    
    console.log('Extracted full name:', fullName);
    
    // Combine data from both sources, prioritizing full name from auth
    return {
      contact_name: fullName || clientProfile?.contact_name || 'Client',
      company_name: clientProfile?.company_name || null,
      logo_url: clientProfile?.logo_url || null,
      phone_number: clientProfile?.phone_number || null,
      website: clientProfile?.website || null,
      company_address: clientProfile?.company_address || null,
      email: userData.email || clientProfile?.email || null
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // If we have partial client profile data, use that
    if (clientProfile) {
      return {
        contact_name: clientProfile.contact_name || 'Client',
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
      contact_name: 'Client',
      company_name: null,
      logo_url: null,
      email: null
    };
  }
};
