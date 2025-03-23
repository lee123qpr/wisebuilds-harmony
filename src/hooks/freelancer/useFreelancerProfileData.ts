
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Json } from "@/integrations/supabase/types";
import { FreelancerProfile } from "@/types/applications";

// Define a comprehensive interface for the database profile data
interface ProfileDBData {
  id: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
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

// This alias is used for test cases
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
          return transformProfileData(profileData as ProfileDBData, targetUserId, "");
        }

        // Return combined data
        return transformProfileData(profileData as ProfileDBData, targetUserId, userData?.email || "");
      } catch (error) {
        console.error("Error in useFreelancerProfileData:", error);
        return null;
      }
    },
    enabled: !!targetUserId,
  });
};

// Helper function to transform database data to FreelancerProfile
function transformProfileData(
  profileData: ProfileDBData, 
  userId: string, 
  email: string
): FreelancerProfile {
  // Helper function to handle Json arrays
  const transformJsonToStringArray = (jsonArray: Json | undefined): string[] => {
    if (!jsonArray) return [];
    if (Array.isArray(jsonArray)) {
      return jsonArray.map(item => String(item));
    }
    return [];
  };

  // Helper function to handle indemnity insurance
  const transformIndemnityInsurance = (insurance: Json | undefined): boolean | { hasInsurance: boolean; coverLevel?: string } => {
    if (!insurance) return false;
    if (typeof insurance === 'boolean') return insurance;
    if (typeof insurance === 'object') {
      return insurance as { hasInsurance: boolean; coverLevel?: string };
    }
    return Boolean(insurance);
  };

  // Create the profile with consistent types
  return {
    id: profileData.id,
    user_id: userId,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    display_name: profileData.display_name,
    profile_photo: profileData.profile_photo,
    job_title: profileData.job_title,
    email: email,
    contact_phone: profileData.phone_number || "",
    phone_number: profileData.phone_number || "",
    bio: profileData.bio || "",
    role: profileData.job_title || "",
    avatar_url: profileData.profile_photo || "",
    rate: profileData.hourly_rate || "",
    hourly_rate: profileData.hourly_rate,
    day_rate: profileData.day_rate,
    location: profileData.location || "",
    verified: profileData.id_verified || false,
    email_verified: profileData.email_verified,
    member_since: profileData.member_since,
    jobs_completed: profileData.jobs_completed,
    rating: profileData.rating,
    reviews_count: profileData.reviews_count,
    work_type: profileData.work_type || "",
    travel_distance: profileData.travel_distance || "",
    experience: profileData.experience,
    availability: profileData.availability,
    website: profileData.website,
    created_at: profileData.created_at,
    // Convert Json to appropriate types for complex fields
    indemnity_insurance: transformIndemnityInsurance(profileData.indemnity_insurance),
    skills: transformJsonToStringArray(profileData.skills),
    qualifications: transformJsonToStringArray(profileData.qualifications),
    accreditations: transformJsonToStringArray(profileData.accreditations),
    previous_employers: transformJsonToStringArray(profileData.previous_employers),
    previous_work: transformJsonToStringArray(profileData.previous_work)
  };
}

export default useFreelancerProfileData;
