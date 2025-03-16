
import { supabase } from '@/integrations/supabase/client';

export interface FreelancerInfo {
  id: string;
  display_name: string | null;
  profile_image: string | null;
  job_title: string | null;
  location: string | null;
  email: string | null;
}

export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('id, display_name, profile_photo, job_title, location, email')
      .eq('id', freelancerId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching freelancer info:', error);
      return null;
    }
    
    return {
      id: data.id,
      display_name: data.display_name,
      profile_image: data.profile_photo,
      job_title: data.job_title,
      location: data.location,
      email: data.email
    };
  } catch (e) {
    console.error('Exception in getFreelancerInfo:', e);
    return null;
  }
};
