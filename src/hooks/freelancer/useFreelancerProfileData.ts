
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface FreelancerProfileDataResponse {
  data: any | null;
  error: Error | null;
}

// Explicitly define the return type structure to avoid deep type instantiation
interface ProfileData {
  id: string;
  user_id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  job_title: string | null;
  bio: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  skills: string[] | null;
  previous_employers: any[] | null;
  previous_work: any[] | null;
  qualifications: any[] | null;
  indemnity_insurance: any | null;
  created_at: string;
  updated_at: string;
}

// Format freelancer profile data safely
export const formatFreelancerProfileData = (data: any) => {
  if (!data) return null;
  
  // Handle previous_employers safely
  const previousEmployers = data.previous_employers ? 
    (Array.isArray(data.previous_employers) ? data.previous_employers : []) : 
    [];
    
  // Handle previous_work safely
  const previousWork = data.previous_work ? 
    (Array.isArray(data.previous_work) ? data.previous_work : []) : 
    [];
  
  // Cast data to avoid deep type inference
  const formattedData = {
    ...data,
    skills: data.skills || [],
    previous_employers: previousEmployers,
    previous_work: previousWork,
    qualifications: data.qualifications || [],
    indemnity_insurance: data.indemnity_insurance || null
  };
  
  return formattedData as ProfileData;
};

export const useFreelancerProfileData = (userId?: string) => {
  const { user } = useAuth();
  const profileId = userId || user?.id;

  return useQuery({
    queryKey: ['freelancerProfile', profileId],
    queryFn: async (): Promise<FreelancerProfileDataResponse> => {
      try {
        if (!profileId) {
          return { data: null, error: new Error('No user ID provided') };
        }

        // Fetch freelancer profile data
        const { data, error } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('user_id', profileId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching freelancer profile:', error);
          throw error;
        }

        // Format the data with explicit typing
        const formattedData = formatFreelancerProfileData(data);
        return { data: formattedData, error: null };
      } catch (error) {
        console.error('Error in useFreelancerProfileData:', error);
        toast.error('Failed to load freelancer profile data');
        return { data: null, error: error as Error };
      }
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
