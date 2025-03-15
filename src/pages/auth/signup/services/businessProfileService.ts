
import { supabase } from '@/integrations/supabase/client';
import { BusinessFormValues } from '../types';

export const createBusinessProfile = async (userId: string, data: BusinessFormValues) => {
  try {
    // Check if profile already exists to avoid duplicates
    const { data: existingProfile } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (existingProfile) {
      // Update existing profile instead of creating a new one
      const { error: updateError } = await supabase
        .from('client_profiles')
        .update({
          company_name: data.companyName || null,
          contact_name: data.contactName,
          phone_number: data.phone,
          company_address: data.companyAddress || null,
          company_description: data.companyDescription || null,
          member_since: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating client profile:', updateError);
        return { success: false, error: updateError };
      }
    } else {
      // Create new profile
      const { error: profileError } = await supabase
        .from('client_profiles')
        .insert({
          id: userId,
          company_name: data.companyName || null,
          contact_name: data.contactName,
          phone_number: data.phone,
          company_address: data.companyAddress || null,
          company_description: data.companyDescription || null,
          member_since: new Date().toISOString(),
        });
      
      if (profileError) {
        console.error('Error creating client profile:', profileError);
        return { success: false, error: profileError };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating business profile:', error);
    return { success: false, error };
  }
};
