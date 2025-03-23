
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
};

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

        // If we have profile data, let's also get the user's email from the auth users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("email")
          .eq("id", targetUserId)
          .single();

        if (userError) {
          console.error("Error fetching user email:", userError);
          // We can still return the profile data without the email
          return {
            ...profileData,
            email: "",
          };
        }

        // Return combined data
        return {
          ...profileData,
          email: userData?.email || "",
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
