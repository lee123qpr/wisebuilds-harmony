
import { supabase } from '@/integrations/supabase/client';
import { FreelancerFormValues } from '../components/FreelancerSignupForm';

export const createFreelancerProfile = async (userId: string, data: FreelancerFormValues) => {
  try {
    // Create or update the freelancer profile in the database
    const { error: profileError } = await supabase
      .from('freelancer_profiles')
      .upsert({
        id: userId,
        first_name: data.fullName.split(' ')[0] || '',
        last_name: data.fullName.split(' ').slice(1).join(' ') || '',
        display_name: data.fullName,
        job_title: data.profession,
        location: data.location,
        email: data.email,
        member_since: new Date().toISOString(),
      });
    
    if (profileError) {
      console.error('Error creating freelancer profile:', profileError);
      // Continue execution to ensure credits are created even if profile insertion fails
    }
    
    // Create an entry in freelancer_credits to ensure the user has credits
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
