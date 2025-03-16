
import { supabase } from '@/integrations/supabase/client';
import { FreelancerSignupValues } from '../types';

export const createFreelancerProfile = async (userId: string, freelancerData: FreelancerSignupValues) => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }
    
    if (existingProfile) {
      console.log('Profile already exists, updating instead');
      // Update existing profile
      const { error: updateError } = await supabase
        .from('freelancer_profiles')
        .update({
          first_name: freelancerData.firstName,
          last_name: freelancerData.lastName,
          display_name: `${freelancerData.firstName} ${freelancerData.lastName}`,
          email: freelancerData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating freelancer profile:', updateError);
        throw updateError;
      }
      
      return { success: true };
    }
    
    // Create new profile
    const { error: insertError } = await supabase
      .from('freelancer_profiles')
      .insert({
        id: userId,
        first_name: freelancerData.firstName,
        last_name: freelancerData.lastName,
        display_name: `${freelancerData.firstName} ${freelancerData.lastName}`,
        email: freelancerData.email,
        member_since: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('Error creating freelancer profile:', insertError);
      throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in createFreelancerProfile:', error);
    return { success: false, error };
  }
};
