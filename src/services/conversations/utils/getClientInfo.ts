
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
  try {
    console.log('Querying client_profiles table for ID:', clientId);
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('contact_name, company_name, logo_url, email, phone_number')
      .eq('id', clientId)
      .maybeSingle();
    
    if (clientError) {
      console.error('Error fetching client profile:', clientError);
    }
    
    console.log('Client profile data from database:', clientProfile);
    
    // If profile exists, use it as the primary source, regardless of whether fields are empty
    if (clientProfile) {
      console.log('Using client profile data for contact info. Contact name:', clientProfile.contact_name);
      
      // Always use the profile data, but provide fallbacks for null values
      return {
        // Use 'Client' as fallback only if contact_name is null or empty string
        contact_name: clientProfile.contact_name && clientProfile.contact_name.trim() !== '' 
                   ? clientProfile.contact_name 
                   : 'Client',
        company_name: clientProfile.company_name,
        logo_url: clientProfile.logo_url,
        email: clientProfile.email
      };
    } 
    
    console.log('No client profile found, will try auth data');
    
    // If no profile data, try to get user data from auth using edge function
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-email',
      {
        body: { userId: clientId }
      }
    );
    
    if (userError) {
      console.error('Error fetching user data from edge function:', userError);
      return {
        contact_name: 'Client',
        company_name: null,
        logo_url: null,
        email: null
      };
    }
    
    console.log('User data received from edge function:', userData);
    
    if (!userData) {
      console.error('No user data returned from edge function');
      return {
        contact_name: 'Client',
        company_name: null,
        logo_url: null,
        email: null
      };
    }
    
    // Extract full name from metadata
    const fullName = userData.full_name || 
                   (userData.user_metadata?.full_name) || 
                   (userData.user_metadata?.name) ||
                   (userData.email ? userData.email.split('@')[0] : 'Client');
                   
    console.log('Extracted full name from auth data:', fullName);
    
    // Return the user data
    return {
      contact_name: fullName,
      company_name: userData.user_metadata?.company_name || null,
      logo_url: null,
      email: userData.email
    };
  } catch (error) {
    console.error('Error in getClientInfo:', error);
    
    // No data available
    return {
      contact_name: 'Client',
      company_name: null,
      logo_url: null,
      email: null
    };
  }
};
