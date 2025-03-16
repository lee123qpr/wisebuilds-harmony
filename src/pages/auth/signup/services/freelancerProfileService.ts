
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
    
    // Extract first and last name from fullName if available
    let firstName = freelancerData.firstName;
    let lastName = freelancerData.lastName;
    
    if (freelancerData.fullName && (!firstName || !lastName)) {
      const nameParts = freelancerData.fullName.split(' ');
      firstName = firstName || nameParts[0] || '';
      lastName = lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
    }
    
    if (existingProfile) {
      console.log('Profile already exists, updating instead');
      // Update existing profile
      const { error: updateError } = await supabase
        .from('freelancer_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          display_name: firstName && lastName ? `${firstName} ${lastName}` : freelancerData.fullName || '',
          email: freelancerData.email,
          location: freelancerData.location || null,
          job_title: freelancerData.profession || null,
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
        first_name: firstName,
        last_name: lastName,
        display_name: firstName && lastName ? `${firstName} ${lastName}` : freelancerData.fullName || '',
        email: freelancerData.email,
        location: freelancerData.location || null,
        job_title: freelancerData.profession || null,
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
