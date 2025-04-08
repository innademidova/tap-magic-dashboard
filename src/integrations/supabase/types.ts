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
      chat_rooms: {
        Row: {
          created_at: string
          id: number
          is_public: boolean
          location_id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_public?: boolean
          location_id: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          is_public?: boolean
          location_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      gamers: {
        Row: {
          age: number | null
          created_at: string
          gamer_tag: string | null
          id: number
          name: string
          parent_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          gamer_tag?: string | null
          id?: number
          name: string
          parent_id: string
        }
        Update: {
          age?: number | null
          created_at?: string
          gamer_tag?: string | null
          id?: number
          name?: string
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamers_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ghl_contacts: {
        Row: {
          address1: string | null
          assigned_to: string | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          country: string | null
          date_added: string | null
          date_of_birth: string | null
          date_updated: string | null
          dnd: boolean | null
          email: string | null
          event_date_time: string | null
          event_location: string | null
          first_name: string | null
          id: string
          last_activity: number | null
          last_name: string | null
          location_id: string
          number_of_gamers: number | null
          phone: string | null
          postal_code: string | null
          source: string | null
          state: string | null
          tags: Json | null
          timezone: string | null
          type: string | null
          website: string | null
        }
        Insert: {
          address1?: string | null
          assigned_to?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          date_added?: string | null
          date_of_birth?: string | null
          date_updated?: string | null
          dnd?: boolean | null
          email?: string | null
          event_date_time?: string | null
          event_location?: string | null
          first_name?: string | null
          id: string
          last_activity?: number | null
          last_name?: string | null
          location_id: string
          number_of_gamers?: number | null
          phone?: string | null
          postal_code?: string | null
          source?: string | null
          state?: string | null
          tags?: Json | null
          timezone?: string | null
          type?: string | null
          website?: string | null
        }
        Update: {
          address1?: string | null
          assigned_to?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          date_added?: string | null
          date_of_birth?: string | null
          date_updated?: string | null
          dnd?: boolean | null
          email?: string | null
          event_date_time?: string | null
          event_location?: string | null
          first_name?: string | null
          id?: string
          last_activity?: number | null
          last_name?: string | null
          location_id?: string
          number_of_gamers?: number | null
          phone?: string | null
          postal_code?: string | null
          source?: string | null
          state?: string | null
          tags?: Json | null
          timezone?: string | null
          type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          role: string
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: string
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_room_id: number | null
          content: string
          created_at: string
          dm_recipient_id: string | null
          id: number
          is_at_all: boolean
          user_id: string
        }
        Insert: {
          chat_room_id?: number | null
          content: string
          created_at?: string
          dm_recipient_id?: string | null
          id?: number
          is_at_all?: boolean
          user_id: string
        }
        Update: {
          chat_room_id?: number | null
          content?: string
          created_at?: string
          dm_recipient_id?: string | null
          id?: number
          is_at_all?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      pr_articles: {
        Row: {
          author: string
          confidence_score: number | null
          content: string
          created_at: string | null
          id: string
          session_id: string
          status: string
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          author: string
          confidence_score?: number | null
          content: string
          created_at?: string | null
          id?: string
          session_id: string
          status?: string
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          author?: string
          confidence_score?: number | null
          content?: string
          created_at?: string | null
          id?: string
          session_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pr_articles_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pr_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pr_articles_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "session_articles_blogs_view"
            referencedColumns: ["session_id"]
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
            foreignKeyName: "pr_blogs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "pr_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pr_blogs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "session_articles_blogs_view"
            referencedColumns: ["article_id"]
          },
        ]
      }
      pr_sessions: {
        Row: {
          audience: string | null
          bio: string | null
          created_at: string | null
          datetime: string | null
          id: string
          industry: string | null
          keywords: string[] | null
          session_id: string
          subject_matter: string | null
          summary_content: string | null
          updated_at: string | null
          user_id: string
          usp: string | null
          writing_style: string | null
        }
        Insert: {
          audience?: string | null
          bio?: string | null
          created_at?: string | null
          datetime?: string | null
          id?: string
          industry?: string | null
          keywords?: string[] | null
          session_id: string
          subject_matter?: string | null
          summary_content?: string | null
          updated_at?: string | null
          user_id: string
          usp?: string | null
          writing_style?: string | null
        }
        Update: {
          audience?: string | null
          bio?: string | null
          created_at?: string | null
          datetime?: string | null
          id?: string
          industry?: string | null
          keywords?: string[] | null
          session_id?: string
          subject_matter?: string | null
          summary_content?: string | null
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
          updated_at: string | null
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pr_talking_points_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "pr_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pr_talking_points_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "session_articles_blogs_view"
            referencedColumns: ["article_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          location_id: number | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          location_id?: number | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          location_id?: number | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      read_receipts: {
        Row: {
          chat_room_id: number | null
          dm_partner_id: string | null
          id: number
          last_read_at: string
          user_id: string
        }
        Insert: {
          chat_room_id?: number | null
          dm_partner_id?: string | null
          id?: number
          last_read_at: string
          user_id: string
        }
        Update: {
          chat_room_id?: number | null
          dm_partner_id?: string | null
          id?: number
          last_read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "read_receipts_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          audience: string | null
          auth_id: string | null
          bio: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          industry: string | null
          keywords: string[] | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          subject_matter: string | null
          updated_at: string | null
          usp: string | null
          writing_style: string | null
        }
        Insert: {
          audience?: string | null
          auth_id?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          industry?: string | null
          keywords?: string[] | null
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subject_matter?: string | null
          updated_at?: string | null
          usp?: string | null
          writing_style?: string | null
        }
        Update: {
          audience?: string | null
          auth_id?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          industry?: string | null
          keywords?: string[] | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subject_matter?: string | null
          updated_at?: string | null
          usp?: string | null
          writing_style?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      blog_content_view: {
        Row: {
          blog_content: string | null
          session_id: string | null
        }
        Relationships: []
      }
      session_articles_blogs_view: {
        Row: {
          article_id: string | null
          article_title: string | null
          blog_body: string | null
          blog_id: string | null
          blog_title: string | null
          session_id: string | null
          session_identifier: string | null
          talking_point_content: string | null
          talking_point_id: string | null
          user_id: string | null
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
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin_or_superadmin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_superadmin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "customer" | "admin" | "superadmin"
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
    Enums: {
      user_role: ["customer", "admin", "superadmin"],
    },
  },
} as const
