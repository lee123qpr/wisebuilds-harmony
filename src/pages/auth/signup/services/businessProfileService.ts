
import { supabase } from '@/integrations/supabase/client';
import { BusinessFormValues } from '../types';

export const createBusinessProfile = async (userId: string, data: BusinessFormValues) => {
  try {
    const { error: profileError } = await supabase
      .from('client_profiles')
      .insert({
        id: userId,
        company_name: data.companyName,
        contact_name: data.contactName,
        phone_number: data.phone,
        company_address: data.companyAddress,
        company_description: data.companyDescription,
        member_since: new Date().toISOString(),
      });
    
    if (profileError) {
      console.error('Error creating client profile:', profileError);
      return { success: false, error: profileError };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating business profile:', error);
    return { success: false, error };
  }
};
