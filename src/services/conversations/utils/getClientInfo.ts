
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

/**
 * Gets client information from client_profiles
 */
export const getClientInfo = async (clientId: string): Promise<ClientInfo> => {
  console.log('getClientInfo called with clientId:', clientId);
  console.log('clientId type:', typeof clientId);
  console.log('clientId valid UUID?:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId));
  
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
      .select('contact_name, company_name, logo_url, email')
      .eq('id', clientId)
      .maybeSingle();
    
    if (clientError) {
      console.error('Error fetching client profile:', clientError);
      console.error('Error code:', clientError.code);
      console.error('Error message:', clientError.message);
    }
    
    console.log('Client profile data from database:', clientProfile);
    
    // If profile exists, return it
    if (clientProfile) {
      // Get email separately if not in profile
      let email = clientProfile.email;
      
      if (!email) {
        // Get user email via edge function
        const { data: userData, error: userError } = await supabase.functions.invoke(
          'get-user-email',
          {
            body: { userId: clientId }
          }
        );
        
        if (!userError) {
          email = userData?.email;
        }
      }
      
      console.log('Returning client info from profile:', {
        contact_name: clientProfile.contact_name || 'Client',
        company_name: clientProfile.company_name,
        logo_url: clientProfile.logo_url,
        email: email
      });
      
      return {
        contact_name: clientProfile.contact_name || 'Client',
        company_name: clientProfile.company_name,
        logo_url: clientProfile.logo_url,
        email: email
      };
    } else {
      console.log('No profile found, getting email only');
      
      // If no profile, just get email
      const { data: userData, error: userError } = await supabase.functions.invoke(
        'get-user-email',
        {
          body: { userId: clientId }
        }
      );
      
      if (userError) {
        console.error('Error fetching user email:', userError);
        return {
          contact_name: 'Client',
          company_name: null,
          logo_url: null,
          email: null
        };
      }
      
      // Return with just the email
      return {
        contact_name: 'Client',
        company_name: null,
        logo_url: null,
        email: userData?.email || null
      };
    }
  } catch (dbError) {
    console.error('Exception when querying client_profiles:', dbError);
    
    // No data available
    return {
      contact_name: 'Client',
      company_name: null,
      logo_url: null,
      email: null
    };
  }
};
