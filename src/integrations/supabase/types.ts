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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kyc_submissions: {
        Row: {
          created_at: string | null
          documents: Json | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: string | null
          status: Database["public"]["Enums"]["kyc_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          documents?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          documents?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_confirmations: {
        Row: {
          confirmed_by_user_at: string | null
          created_at: string
          id: string
          payment_hash: string
          transaction_id: string
          verified_by_admin_at: string | null
          wallet_address: string
        }
        Insert: {
          confirmed_by_user_at?: string | null
          created_at?: string
          id?: string
          payment_hash: string
          transaction_id: string
          verified_by_admin_at?: string | null
          wallet_address: string
        }
        Update: {
          confirmed_by_user_at?: string | null
          created_at?: string
          id?: string
          payment_hash?: string
          transaction_id?: string
          verified_by_admin_at?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_confirmations_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_funds: {
        Row: {
          amount: number
          claimed: boolean | null
          claimed_at: string | null
          created_at: string | null
          currency: string
          expires_at: string
          id: string
          network_fee: number
          user_id: string
        }
        Insert: {
          amount: number
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          currency: string
          expires_at: string
          id?: string
          network_fee: number
          user_id: string
        }
        Update: {
          amount?: number
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          currency?: string
          expires_at?: string
          id?: string
          network_fee?: number
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string | null
          crypto_addresses: Json | null
          id: number
          network_fee: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crypto_addresses?: Json | null
          id?: number
          network_fee?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crypto_addresses?: Json | null
          id?: number
          network_fee?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          flagged: boolean | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          last_activity: string | null
          name: string
          phone: string | null
          risk_level: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_uid: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          flagged?: boolean | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_activity?: string | null
          name: string
          phone?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_uid?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          flagged?: boolean | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_activity?: string | null
          name?: string
          phone?: string | null
          risk_level?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_uid?: string | null
        }
        Relationships: []
      }
      transaction_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_type: string
          read: boolean | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_type: string
          read?: boolean | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string
          read?: boolean | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_notifications_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          destination: string | null
          from_address: string | null
          id: string
          network_fee: number | null
          risk_score: number | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          to_address: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          destination?: string | null
          from_address?: string | null
          id?: string
          network_fee?: number | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_address?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          destination?: string | null
          from_address?: string | null
          id?: string
          network_fee?: number | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_address?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transfer_requests: {
        Row: {
          amount: number
          created_at: string
          currency: string
          from_user_id: string
          id: string
          message: string | null
          status: string | null
          to_user_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          from_user_id: string
          id?: string
          message?: string | null
          status?: string | null
          to_user_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          from_user_id?: string
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_addresses: {
        Row: {
          address: string
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          currency: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string
          id: string
          status: Database["public"]["Enums"]["wallet_status"] | null
          symbol: string
          type: Database["public"]["Enums"]["wallet_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency: string
          id?: string
          status?: Database["public"]["Enums"]["wallet_status"] | null
          symbol: string
          type: Database["public"]["Enums"]["wallet_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["wallet_status"] | null
          symbol?: string
          type?: Database["public"]["Enums"]["wallet_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      kyc_status: "pending" | "approved" | "rejected"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type:
        | "withdrawal"
        | "transfer"
        | "crypto_withdrawal"
        | "send"
        | "receive"
        | "convert"
      user_status: "active" | "locked" | "suspended"
      wallet_status: "active" | "frozen" | "suspended"
      wallet_type: "fiat" | "crypto"
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
      app_role: ["admin", "user"],
      kyc_status: ["pending", "approved", "rejected"],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: [
        "withdrawal",
        "transfer",
        "crypto_withdrawal",
        "send",
        "receive",
        "convert",
      ],
      user_status: ["active", "locked", "suspended"],
      wallet_status: ["active", "frozen", "suspended"],
      wallet_type: ["fiat", "crypto"],
    },
  },
} as const
