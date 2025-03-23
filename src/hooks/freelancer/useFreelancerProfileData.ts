
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Json } from "@/integrations/supabase/types";

// Define a comprehensive interface for the database profile data
interface ProfileDBData {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  phone_number?: string;
  bio?: string;
  job_title?: string;
  profile_photo?: string;
  hourly_rate?: string;
  location?: string;
  indemnity_insurance?: Json;
  previous_employers?: Json;
  skills?: Json;
  qualifications?: Json;
  previous_work?: Json;
  created_at: string;
  work_type?: string;
  availability?: string;
  travel_distance?: string;
  id_verified?: boolean;
  website?: string;
  day_rate?: string;
  experience?: string;
  accreditations?: Json;
  email?: string;
  member_since?: string;
  email_verified?: boolean;
  jobs_completed?: number;
  rating?: number;
  reviews_count?: number;
}

// Export the FreelancerProfile interface for use throughout the app
export type FreelancerProfile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  bio: string;
  role: string;
  avatar_url: string;
  rate: string;
  location: string;
  indemnity_insurance: boolean;
  previous_employers: string[];
  skills: string[];
  qualifications: string[];
  previous_work: string[];
  created_at: string;
  work_type: string;
  availability: string;
  travel_distance: string;
  verified: boolean;
  display_name?: string;
  job_title?: string;
  profile_photo?: string;
  website?: string;
  day_rate?: string;
  experience?: string;
  accreditations?: string[];
  member_since?: string;
  email_verified?: boolean;
  jobs_completed?: number;
  rating?: number;
  reviews_count?: number;
};

// Export ProfileData for test cases
export type ProfileData = FreelancerProfile;

export const useFreelancerProfileData = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ["freelancer-profile", targetUserId],
    queryFn: async (): Promise<FreelancerProfile | null> => {
      if (!targetUserId) return null;

      try {
        // First attempt to get the freelancer profile data
        const { data: profileData, error: profileError } = await supabase
          .from("freelancer_profiles")
          .select("*")
          .eq("user_id", targetUserId)
          .single();

        if (profileError) {
          console.error("Error fetching freelancer profile:", profileError);
          return null;
        }

        if (!profileData) {
          console.log("No freelancer profile found for user:", targetUserId);
          return null;
        }

        // If we have profile data, let's also get the user's email
        const { data: userData, error: userError } = await supabase
          .functions.invoke('get-user-email', {
            body: { userId: targetUserId }
          });

        if (userError) {
          console.error("Error fetching user email:", userError);
          // We can still return the profile data without the email
          return {
            ...profileData,
            user_id: targetUserId,
            contact_phone: profileData.phone_number || "",
            role: profileData.job_title || "",
            avatar_url: profileData.profile_photo || "",
            rate: profileData.hourly_rate || "",
            verified: profileData.id_verified || false,
            work_type: profileData.work_type || "",
            travel_distance: profileData.travel_distance || "",
            email: "",
            indemnity_insurance: !!profileData.indemnity_insurance,
            previous_employers: Array.isArray(profileData.previous_employers) 
              ? profileData.previous_employers.map(item => String(item)) 
              : [],
            skills: Array.isArray(profileData.skills) 
              ? profileData.skills.map(item => String(item)) 
              : [],
            qualifications: Array.isArray(profileData.qualifications) 
              ? profileData.qualifications.map(item => String(item)) 
              : [],
            previous_work: Array.isArray(profileData.previous_work) 
              ? profileData.previous_work.map(item => String(item)) 
              : []
          };
        }

        // Return combined data
        return {
          ...profileData,
          user_id: targetUserId,
          contact_phone: profileData.phone_number || "",
          role: profileData.job_title || "",
          avatar_url: profileData.profile_photo || "",
          rate: profileData.hourly_rate || "",
          verified: profileData.id_verified || false,
          work_type: profileData.work_type || "",
          travel_distance: profileData.travel_distance || "",
          email: userData?.email || "",
          indemnity_insurance: !!profileData.indemnity_insurance,
          previous_employers: Array.isArray(profileData.previous_employers) 
            ? profileData.previous_employers.map(item => String(item)) 
            : [],
          skills: Array.isArray(profileData.skills) 
            ? profileData.skills.map(item => String(item)) 
            : [],
          qualifications: Array.isArray(profileData.qualifications) 
            ? profileData.qualifications.map(item => String(item)) 
            : [],
          previous_work: Array.isArray(profileData.previous_work) 
            ? profileData.previous_work.map(item => String(item)) 
            : []
        };
      } catch (error) {
        console.error("Error in useFreelancerProfileData:", error);
        return null;
      }
    },
    enabled: !!targetUserId,
  });
};

export default useFreelancerProfileData;
