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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
