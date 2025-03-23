
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// This interface represents the data structure from the database
export interface ProfileData {
  id: string;
  user_id?: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  profile_photo: string | null;
  job_title: string | null;
  bio: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  skills: string[] | null;
  previous_employers: Array<{
    employerName: string;
    position: string;
    startDate: string;
    endDate?: string | null;
    current: boolean;
  }> | null;
  previous_work: Array<{
    title: string;
    description: string;
  }> | null;
  qualifications: string[] | null;
  indemnity_insurance: {
    hasInsurance: boolean;
    coverLevel?: string;
  } | null;
  created_at: string;
  updated_at: string;
  member_since?: string;
  email_verified?: boolean;
  verified?: boolean;
  jobs_completed?: number;
  rating?: number;
  reviews_count?: number;
  website?: string;
  hourly_rate?: string;
  day_rate?: string;
  availability?: string;
  experience?: string;
  accreditations?: string[];
}

// Define a standalone response type for the fetch function
interface ProfileResponse {
  data: ProfileData | null;
  error: Error | null;
}

// Format freelancer profile data safely
export const formatFreelancerProfileData = (data: any): ProfileData | null => {
  if (!data) return null;
  
  // Handle previous_employers safely - ensure required properties are present
  const previousEmployers = data.previous_employers ? 
    (Array.isArray(data.previous_employers) ? data.previous_employers.map((emp: any) => ({
      employerName: emp.employerName || '',
      position: emp.position || '',
      startDate: emp.startDate || '',
      endDate: emp.endDate || null,
      current: emp.current || false
    })) : []) : 
    [];
    
  // Handle previous_work safely
  const previousWork = data.previous_work ? 
    (Array.isArray(data.previous_work) ? data.previous_work.map((work: any) => ({
      title: work.title || '',
      description: work.description || ''
    })) : []) : 
    [];
  
  // Return formatted data with explicit type
  return {
    id: data.id || '',
    user_id: data.user_id || '',
    display_name: data.display_name || '',
    first_name: data.first_name,
    last_name: data.last_name,
    profile_photo: data.profile_photo,
    job_title: data.job_title,
    bio: data.bio,
    email: data.email,
    phone_number: data.phone_number,
    location: data.location,
    skills: data.skills || [],
    previous_employers: previousEmployers,
    previous_work: previousWork,
    qualifications: data.qualifications || [],
    indemnity_insurance: data.indemnity_insurance || { hasInsurance: false },
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    member_since: data.member_since,
    email_verified: data.email_verified,
    verified: data.verified,
    jobs_completed: data.jobs_completed,
    rating: data.rating,
    reviews_count: data.reviews_count,
    website: data.website,
    hourly_rate: data.hourly_rate,
    day_rate: data.day_rate,
    availability: data.availability,
    experience: data.experience,
    accreditations: data.accreditations || []
  };
};

// Define explicit return type to prevent excessive type instantiation
interface FreelancerProfileQueryResult {
  profile: ProfileData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
  status: string;
}

export const useFreelancerProfileData = (userId?: string): FreelancerProfileQueryResult => {
  const { user } = useAuth();
  const profileId = userId || user?.id;

  // Define a fetch function with explicit return type
  const fetchProfileData = async (): Promise<ProfileResponse> => {
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

      // Format the data
      const formattedData = formatFreelancerProfileData(data);
      return { data: formattedData, error: null };
    } catch (error) {
      console.error('Error in useFreelancerProfileData:', error);
      toast.error('Failed to load freelancer profile data');
      return { data: null, error: error as Error };
    }
  };

  // Use the fetch function in the query
  const query = useQuery({
    queryKey: ['freelancerProfile', profileId],
    queryFn: fetchProfileData,
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Return a new object instead of spreading to avoid deep type recursion
  return {
    profile: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error || query.data?.error || null,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    status: query.status
  };
};
