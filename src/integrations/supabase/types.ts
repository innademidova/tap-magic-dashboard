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
      pr_articles: {
        Row: {
          article_number: number | null
          confidence_score: number | null
          content: string
          created_at: string | null
          description: string | null
          id: string
          session_id: string
          status: string
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          article_number?: number | null
          confidence_score?: number | null
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          session_id: string
          status?: string
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          article_number?: number | null
          confidence_score?: number | null
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          session_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pr_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_blogs: {
        Row: {
          article_id: string
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_article"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "pr_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_sessions: {
        Row: {
          audience: string | null
          created_at: string | null
          datetime: string | null
          gmail_threadid: string | null
          id: string
          session_id: string
          step: number
          subject_matter: string | null
          updated_at: string | null
          user_id: string
          usp: string | null
          writing_style: string | null
        }
        Insert: {
          audience?: string | null
          created_at?: string | null
          datetime?: string | null
          gmail_threadid?: string | null
          id?: string
          session_id: string
          step?: number
          subject_matter?: string | null
          updated_at?: string | null
          user_id: string
          usp?: string | null
          writing_style?: string | null
        }
        Update: {
          audience?: string | null
          created_at?: string | null
          datetime?: string | null
          gmail_threadid?: string | null
          id?: string
          session_id?: string
          step?: number
          subject_matter?: string | null
          updated_at?: string | null
          user_id?: string
          usp?: string | null
          writing_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pr_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_talking_points: {
        Row: {
          article_id: string
          content: string
          created_at: string | null
          id: string
          talking_point_type_id: number
          updated_at: string | null
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string | null
          id?: string
          talking_point_type_id: number
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string | null
          id?: string
          talking_point_type_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_article"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "pr_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_talking_point_type"
            columns: ["talking_point_type_id"]
            isOneToOne: false
            referencedRelation: "talking_point_types"
            referencedColumns: ["id"]
          },
        ]
      }
      talking_point_types: {
        Row: {
          id: number
          label: string
        }
        Insert: {
          id?: number
          label: string
        }
        Update: {
          id?: number
          label?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          audience: string | null
          bio: string | null
          core_beliefs: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          industry: string | null
          keywords: string[] | null
          last_name: string
          phone: string | null
          subject_matter: string | null
          updated_at: string | null
          usp: string | null
          writing_style: string | null
        }
        Insert: {
          audience?: string | null
          bio?: string | null
          core_beliefs?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          industry?: string | null
          keywords?: string[] | null
          last_name: string
          phone?: string | null
          subject_matter?: string | null
          updated_at?: string | null
          usp?: string | null
          writing_style?: string | null
        }
        Update: {
          audience?: string | null
          bio?: string | null
          core_beliefs?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          industry?: string | null
          keywords?: string[] | null
          last_name?: string
          phone?: string | null
          subject_matter?: string | null
          updated_at?: string | null
          usp?: string | null
          writing_style?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      talking_points_with_titles: {
        Row: {
          article_id: string | null
          content: string | null
          label: string | null
          talking_point_type_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_article"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "pr_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_talking_point_type"
            columns: ["talking_point_type_id"]
            isOneToOne: false
            referencedRelation: "talking_point_types"
            referencedColumns: ["id"]
          },
        ]
      }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
