export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_profiles: {
        Row: {
          company_address: string | null
          company_description: string | null
          company_name: string | null
          company_specialism: string | null
          company_turnover: string | null
          company_type: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          employee_size: string | null
          id: string
          jobs_completed: number | null
          logo_url: string | null
          member_since: string | null
          phone_number: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_address?: string | null
          company_description?: string | null
          company_name?: string | null
          company_specialism?: string | null
          company_turnover?: string | null
          company_type?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          employee_size?: string | null
          id: string
          jobs_completed?: number | null
          logo_url?: string | null
          member_since?: string | null
          phone_number?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_address?: string | null
          company_description?: string | null
          company_name?: string | null
          company_specialism?: string | null
          company_turnover?: string | null
          company_type?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          employee_size?: string | null
          id?: string
          jobs_completed?: number | null
          logo_url?: string | null
          member_since?: string | null
          phone_number?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      client_reviews: {
        Row: {
          client_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          reviewer_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          reviewer_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          freelancer_id: string
          id: string
          last_message_time: string
          project_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          freelancer_id: string
          id?: string
          last_message_time?: string
          project_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          freelancer_id?: string
          id?: string
          last_message_time?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_plans: {
        Row: {
          created_at: string
          credits: number
          discount_percentage: number
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits: number
          discount_percentage?: number
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          discount_percentage?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          credits_purchased: number
          id: string
          status: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          credits_purchased: number
          id?: string
          status?: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credits_purchased?: number
          id?: string
          status?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      freelancer_credits: {
        Row: {
          created_at: string
          credit_balance: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_balance?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credit_balance?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      freelancer_profiles: {
        Row: {
          accreditations: Json | null
          availability: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          experience: string | null
          first_name: string | null
          hourly_rate: string | null
          id: string
          id_verified: boolean | null
          indemnity_insurance: Json | null
          job_title: string | null
          jobs_completed: number | null
          last_name: string | null
          location: string | null
          member_since: string | null
          phone_number: string | null
          previous_employers: Json | null
          previous_work: Json | null
          profile_photo: string | null
          qualifications: Json | null
          rating: number | null
          reviews_count: number | null
          skills: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          accreditations?: Json | null
          availability?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          experience?: string | null
          first_name?: string | null
          hourly_rate?: string | null
          id: string
          id_verified?: boolean | null
          indemnity_insurance?: Json | null
          job_title?: string | null
          jobs_completed?: number | null
          last_name?: string | null
          location?: string | null
          member_since?: string | null
          phone_number?: string | null
          previous_employers?: Json | null
          previous_work?: Json | null
          profile_photo?: string | null
          qualifications?: Json | null
          rating?: number | null
          reviews_count?: number | null
          skills?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          accreditations?: Json | null
          availability?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          experience?: string | null
          first_name?: string | null
          hourly_rate?: string | null
          id?: string
          id_verified?: boolean | null
          indemnity_insurance?: Json | null
          job_title?: string | null
          jobs_completed?: number | null
          last_name?: string | null
          location?: string | null
          member_since?: string | null
          phone_number?: string | null
          previous_employers?: Json | null
          previous_work?: Json | null
          profile_photo?: string | null
          qualifications?: Json | null
          rating?: number | null
          reviews_count?: number | null
          skills?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      freelancer_verification: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          document_name: string | null
          document_path: string | null
          document_size: number | null
          document_type: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          document_name?: string | null
          document_path?: string | null
          document_size?: number | null
          document_type?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          document_name?: string | null
          document_path?: string | null
          document_size?: number | null
          document_type?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lead_settings: {
        Row: {
          budget: string | null
          created_at: string | null
          duration: string | null
          email_alerts: boolean
          hiring_status: string | null
          id: string
          keywords: string[] | null
          location: string
          max_budget: string | null
          notifications_enabled: boolean
          project_type: string[] | null
          requires_insurance: boolean | null
          requires_site_visits: boolean | null
          role: string
          updated_at: string | null
          user_id: string
          work_type: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string | null
          duration?: string | null
          email_alerts?: boolean
          hiring_status?: string | null
          id?: string
          keywords?: string[] | null
          location: string
          max_budget?: string | null
          notifications_enabled?: boolean
          project_type?: string[] | null
          requires_insurance?: boolean | null
          requires_site_visits?: boolean | null
          role: string
          updated_at?: string | null
          user_id: string
          work_type?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string | null
          duration?: string | null
          email_alerts?: boolean
          hiring_status?: string | null
          id?: string
          keywords?: string[] | null
          location?: string
          max_budget?: string | null
          notifications_enabled?: boolean
          project_type?: string[] | null
          requires_insurance?: boolean | null
          requires_site_visits?: boolean | null
          role?: string
          updated_at?: string | null
          user_id?: string
          work_type?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: Json | null
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_applications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          project_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          project_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          project_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          applications: number
          budget: string
          created_at: string
          description: string
          documents: Json | null
          duration: string
          hiring_status: string
          id: string
          location: string
          purchases_count: number
          requires_equipment: boolean
          requires_insurance: boolean
          requires_site_visits: boolean
          role: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          work_type: string
        }
        Insert: {
          applications?: number
          budget: string
          created_at?: string
          description: string
          documents?: Json | null
          duration: string
          hiring_status?: string
          id?: string
          location: string
          purchases_count?: number
          requires_equipment?: boolean
          requires_insurance?: boolean
          requires_site_visits?: boolean
          role: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          work_type: string
        }
        Update: {
          applications?: number
          budget?: string
          created_at?: string
          description?: string
          documents?: Json | null
          duration?: string
          hiring_status?: string
          id?: string
          location?: string
          purchases_count?: number
          requires_equipment?: boolean
          requires_insurance?: boolean
          requires_site_visits?: boolean
          role?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          work_type?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          available_start_date: string | null
          client_completed: boolean
          client_id: string
          completed_at: string | null
          created_at: string
          day_rate: string | null
          description: string | null
          duration_unit: string | null
          estimated_duration: string | null
          estimated_price: string | null
          fixed_price: string | null
          freelancer_completed: boolean
          freelancer_id: string
          id: string
          payment_terms: string | null
          preferred_payment_method: string | null
          project_id: string
          quote_files: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          available_start_date?: string | null
          client_completed?: boolean
          client_id: string
          completed_at?: string | null
          created_at?: string
          day_rate?: string | null
          description?: string | null
          duration_unit?: string | null
          estimated_duration?: string | null
          estimated_price?: string | null
          fixed_price?: string | null
          freelancer_completed?: boolean
          freelancer_id: string
          id?: string
          payment_terms?: string | null
          preferred_payment_method?: string | null
          project_id: string
          quote_files?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          available_start_date?: string | null
          client_completed?: boolean
          client_id?: string
          completed_at?: string | null
          created_at?: string
          day_rate?: string | null
          description?: string | null
          duration_unit?: string | null
          estimated_duration?: string | null
          estimated_price?: string | null
          fixed_price?: string | null
          freelancer_completed?: boolean
          freelancer_id?: string
          id?: string
          payment_terms?: string | null
          preferred_payment_method?: string | null
          project_id?: string
          quote_files?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_freelancer_review: boolean
          project_id: string
          quote_id: string
          rating: number
          review_text: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_freelancer_review: boolean
          project_id: string
          quote_id: string
          rating: number
          review_text?: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_freelancer_review?: boolean
          project_id?: string
          quote_id?: string
          rating?: number
          review_text?: string | null
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_to_project: {
        Args: {
          project_id: string
          message?: string
          credits_to_use?: number
        }
        Returns: Json
      }
      check_application_exists: {
        Args: {
          p_project_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_quote_exists: {
        Args: {
          p_project_id: string
          p_freelancer_id: string
        }
        Returns: boolean
      }
      get_user_applications: {
        Args: {
          user_id: string
        }
        Returns: Json[]
      }
      get_user_email: {
        Args: {
          user_id: string
        }
        Returns: {
          email: string
        }[]
      }
      is_user_verified: {
        Args: {
          check_user_id: string
        }
        Returns: boolean
      }
      update_quote_status: {
        Args: {
          quote_id: string
          new_status: string
        }
        Returns: Json
      }
    }
    Enums: {
      verification_status: "not_submitted" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
