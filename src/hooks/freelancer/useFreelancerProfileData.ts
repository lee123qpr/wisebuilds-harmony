
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Json } from '@/integrations/supabase/types';

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
  previous_employers?: PreviousEmployer[];
  indemnity_insurance?: IndemnityInsurance;
  previous_work?: string[];
  id_verified?: boolean;
  verified?: boolean;
  rating?: number;
  completed_jobs?: number;
  member_since?: string;
};

// Define a custom hook to fetch freelancer profile data
export const useFreelancerProfileData = (freelancerId?: string) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<FreelancerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      // Use provided freelancerId or fall back to current user
      const targetUserId = freelancerId || (user ? user.id : null);
      
      if (!targetUserId) {
        console.log('No user ID found, cannot fetch profile data.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', targetUserId)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError);
          console.error('Error fetching freelancer profile:', fetchError);
        } else if (data) {
          // Transform the data to ensure array types are properly handled
          const transformedData: FreelancerProfileData = {
            ...data,
            skills: Array.isArray(data.skills) 
              ? (data.skills as Json[]).map(item => String(item))
              : [],
            qualifications: Array.isArray(data.qualifications) 
              ? (data.qualifications as Json[]).map(item => String(item))
              : [],
            accreditations: Array.isArray(data.accreditations) 
              ? (data.accreditations as Json[]).map(item => String(item))
              : [],
            previous_employers: Array.isArray(data.previous_employers) 
              ? (data.previous_employers as Json[]).map(item => item as unknown as PreviousEmployer)
              : [],
            previous_work: Array.isArray(data.previous_work) 
              ? (data.previous_work as Json[]).map(item => String(item))
              : []
          };
          
          setProfileData(transformedData);
        } else {
          setProfileData(null);
        }
      } catch (err: any) {
        setError(err);
        console.error('Error fetching freelancer profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, freelancerId]);

  return { profileData, isLoading, error };
};
