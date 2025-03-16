
import { supabase } from '@/integrations/supabase/client';
import { ClientInfo } from '@/types/messaging';

export const getClientInfo = async (clientId: string): Promise<ClientInfo | null> => {
  try {
    // Get client profile data
    const { data: clientData, error: clientError } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (clientError && clientError.code !== 'PGRST116') {
      console.error('Error fetching client profile:', clientError);
      return null;
    }
    
    // Get user data including email from edge function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/get-user-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
      },
      body: JSON.stringify({ userId: clientId })
    });
    
    let userData = { email: null, email_confirmed: false };
    
    if (response.ok) {
      userData = await response.json();
    } else {
      console.error('Error fetching user email:', await response.text());
    }
    
    // Extract required data
    if (clientData) {
      return {
        id: clientId,
        company_name: clientData.company_name,
        contact_name: clientData.contact_name,
        logo_url: clientData.logo_url,
        email: clientData.email || userData.email,
        phone_number: clientData.phone_number,
        location: clientData.company_address
      };
    }
    
    // If no client data but we have user email, return basic info
    if (userData.email) {
      return {
        id: clientId,
        contact_name: 'Client',
        company_name: null,
        logo_url: null,
        email: userData.email,
        phone_number: null,
        location: null
      };
    }
    
    // No client data and no user email
    return {
      id: clientId,
      contact_name: 'Unknown Client',
      company_name: null,
      logo_url: null,
      email: null,
      phone_number: null,
      location: null
    };
  } catch (error) {
    console.error('Error getting client info:', error);
    return {
      id: clientId,
      contact_name: 'Unknown Client',
      company_name: null,
      logo_url: null,
      email: null,
      phone_number: null,
      location: null
    };
  }
};
