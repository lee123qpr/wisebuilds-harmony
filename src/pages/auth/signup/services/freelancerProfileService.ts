
import { supabase } from '@/integrations/supabase/client';
import { FreelancerFormValues } from '../components/FreelancerSignupForm';

export const createFreelancerProfile = async (userId: string, data: FreelancerFormValues) => {
  try {
    // Create a freelancer profile record
    const { error: profileError } = await supabase
      .from('freelancer_profiles')
      .insert({
        id: userId,
        display_name: data.fullName,
        job_title: data.profession,
        location: data.location,
        email: data.email,
        member_since: new Date().toISOString(),
      });
    
    if (profileError) {
      // If the error is because the record already exists, update instead
      if (profileError.message.includes('duplicate key value')) {
        const { error: updateError } = await supabase
          .from('freelancer_profiles')
          .update({
            display_name: data.fullName,
            job_title: data.profession,
            location: data.location,
            email: data.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating freelancer profile:', updateError);
          return { success: false, error: updateError };
        }
      } else {
        console.error('Error creating freelancer profile:', profileError);
        return { success: false, error: profileError };
      }
    }
    
    // Create entry in freelancer_credits for the user
    const { error: creditsError } = await supabase
      .from('freelancer_credits')
      .insert({
        user_id: userId,
        credit_balance: 5, // Give them 5 free credits to start
      });
    
    if (creditsError) {
      // If the error is because the record already exists, that's okay
      if (!creditsError.message.includes('duplicate key value')) {
        console.error('Error creating freelancer credits:', creditsError);
        return { success: false, error: creditsError };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating freelancer profile:', error);
    return { success: false, error };
  }
};
