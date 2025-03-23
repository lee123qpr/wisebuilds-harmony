import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Define a type for previous employers
type PreviousEmployer = {
  company: string;
  role: string;
  duration: string;
};

// Define a type for indemnity insurance
type IndemnityInsurance =
  | boolean
  | {
      hasInsurance: boolean;
      coverLevel?: string;
    };

// Define a type for the freelancer profile data
// type FreelancerProfileData = {
//   id: string;
//   first_name?: string;
//   last_name?: string;
//   display_name?: string;
//   email?: string;
//   profile_photo?: string;
//   bio?: string;
//   location?: string;
//   phone_number?: string;
//   website?: string;
//   job_title?: string;
//   hourly_rate?: string;
//   availability?: string;
//   experience?: string;
//   skills?: string[];
//   qualifications?: string[];
//   accreditations?: string[];
//   previous_employers?: PreviousEmployer[];
//   indemnity_insurance?: IndemnityInsurance;
//   previous_work?: string[];
//   id_verified?: boolean;
//   verified?: boolean;
//   rating?: number;
//   completed_jobs?: number;
//   member_since?: string;
// };

type FreelancerProfileData = {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email?: string;
  profile_photo?: string;
  bio?: string;
  location?: string;
  phone_number?: string;
  website?: string;
  job_title?: string;
  hourly_rate?: string;
  availability?: string;
  experience?: string;
  skills?: string[];
  qualifications?: string[];
  accreditations?: string[];
  previous_employers?: Array<{
    company: string;
    role: string;
    duration: string;
  }>;
  indemnity_insurance?: boolean | {
    hasInsurance: boolean;
    coverLevel?: string;
  };
  previous_work?: string[];
  id_verified?: boolean;
  verified?: boolean;
  rating?: number;
  completed_jobs?: number;
  member_since?: string;
};

// Define a custom hook to fetch freelancer profile data
export const useFreelancerProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<FreelancerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        console.log('No user found, cannot fetch profile data.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          setError(fetchError);
          console.error('Error fetching freelancer profile:', fetchError);
        } else {
          setProfileData(data || null);
        }
      } catch (err: any) {
        setError(err);
        console.error('Error fetching freelancer profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  return { profileData, isLoading, error };
};
