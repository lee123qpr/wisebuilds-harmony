
import { supabase } from '@/integrations/supabase/client';

export interface ClientInfo {
  id: string;
  contact_name: string | null;
  company_name: string | null;
  logo_url: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
}

export const getClientInfo = async (clientId: string): Promise<ClientInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('id, contact_name, company_name, logo_url, email, phone_number, company_address')
      .eq('id', clientId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching client info:', error);
      return null;
    }
    
    return {
      id: data.id,
      contact_name: data.contact_name,
      company_name: data.company_name,
      logo_url: data.logo_url,
      email: data.email,
      phone_number: data.phone_number,
      location: data.company_address
    };
  } catch (e) {
    console.error('Exception in getClientInfo:', e);
    return null;
  }
};
