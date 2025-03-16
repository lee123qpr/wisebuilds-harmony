
// This file adds type definitions for the freelancer_profiles table
// that isn't automatically generated in the Supabase types

import { Database } from "@/integrations/supabase/types";

// Extend the Database type to include freelancer_profiles
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        freelancer_profiles: {
          Row: {
            id: string;
            display_name: string | null;
            first_name: string | null;
            last_name: string | null;
            job_title: string | null;
            location: string | null;
            bio: string | null;
            email: string | null;
            phone_number: string | null;
            website: string | null;
            profile_photo: string | null;
            hourly_rate: string | null;
            availability: string | null;
            skills: string[] | null;
            experience: string | null;
            qualifications: string[] | null;
            accreditations: string[] | null;
            indemnity_insurance: any | null;
            previous_work: any[] | null;
            previous_employers: any[] | null;
            id_verified: boolean | null;
            jobs_completed: number | null;
            rating: number | null;
            reviews_count: number | null;
            member_since: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id: string;
            display_name?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            job_title?: string | null;
            location?: string | null;
            bio?: string | null;
            email?: string | null;
            phone_number?: string | null;
            website?: string | null;
            profile_photo?: string | null;
            hourly_rate?: string | null;
            availability?: string | null;
            skills?: string[] | null;
            experience?: string | null;
            qualifications?: string[] | null;
            accreditations?: string[] | null;
            indemnity_insurance?: any | null;
            previous_work?: any[] | null;
            previous_employers?: any[] | null;
            id_verified?: boolean | null;
            jobs_completed?: number | null;
            rating?: number | null;
            reviews_count?: number | null;
            member_since?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            display_name?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            job_title?: string | null;
            location?: string | null;
            bio?: string | null;
            email?: string | null;
            phone_number?: string | null;
            website?: string | null;
            profile_photo?: string | null;
            hourly_rate?: string | null;
            availability?: string | null;
            skills?: string[] | null;
            experience?: string | null;
            qualifications?: string[] | null;
            accreditations?: string[] | null;
            indemnity_insurance?: any | null;
            previous_work?: any[] | null;
            previous_employers?: any[] | null;
            id_verified?: boolean | null;
            jobs_completed?: number | null;
            rating?: number | null;
            reviews_count?: number | null;
            member_since?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Relationships: [
            {
              foreignKeyName: "freelancer_profiles_id_fkey";
              columns: ["id"];
              referencedRelation: "users";
              referencedColumns: ["id"];
            }
          ];
        };
      } & Database['public']['Tables'];
      Views: Database['public']['Views'];
      Functions: Database['public']['Functions'];
      Enums: Database['public']['Enums'];
      CompositeTypes: Database['public']['CompositeTypes'];
    };
  }
}
