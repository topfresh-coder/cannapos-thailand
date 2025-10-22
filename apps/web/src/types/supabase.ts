export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      inventory_adjustments: {
        Row: {
          adjustment_quantity: number
          batch_id: string
          created_at: string | null
          id: string
          notes: string | null
          product_id: string
          reason: Database["public"]["Enums"]["adjustment_reason"]
          stock_count_id: string | null
          user_id: string
        }
        Insert: {
          adjustment_quantity: number
          batch_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id: string
          reason: Database["public"]["Enums"]["adjustment_reason"]
          stock_count_id?: string | null
          user_id: string
        }
        Update: {
          adjustment_quantity?: number
          batch_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          reason?: Database["public"]["Enums"]["adjustment_reason"]
          stock_count_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_adjustments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "product_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustments_stock_count_id_fkey"
            columns: ["stock_count_id"]
            isOneToOne: false
            referencedRelation: "stock_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_adjustments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          created_at: string | null
          id: string
          location_id: string | null
          max_weight_grams: number | null
          min_weight_grams: number
          price_per_gram: number
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          max_weight_grams?: number | null
          min_weight_grams: number
          price_per_gram: number
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          max_weight_grams?: number | null
          min_weight_grams?: number
          price_per_gram?: number
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_tiers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_batches: {
        Row: {
          batch_number: string
          cost_per_unit: number
          created_at: string | null
          depleted_at: string | null
          expiration_date: string | null
          id: string
          product_id: string
          quantity_received: number
          quantity_remaining: number
          received_date: string
          status: Database["public"]["Enums"]["batch_status"]
          updated_at: string | null
        }
        Insert: {
          batch_number: string
          cost_per_unit: number
          created_at?: string | null
          depleted_at?: string | null
          expiration_date?: string | null
          id?: string
          product_id: string
          quantity_received: number
          quantity_remaining: number
          received_date: string
          status?: Database["public"]["Enums"]["batch_status"]
          updated_at?: string | null
        }
        Update: {
          batch_number?: string
          cost_per_unit?: number
          created_at?: string | null
          depleted_at?: string | null
          expiration_date?: string | null
          id?: string
          product_id?: string
          quantity_received?: number
          quantity_remaining?: number
          received_date?: string
          status?: Database["public"]["Enums"]["batch_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category: Database["public"]["Enums"]["product_category"]
          created_at: string | null
          id: string
          is_active: boolean
          location_id: string | null
          name: string
          reorder_threshold: number
          requires_tare_weight: boolean
          sku: string
          unit: Database["public"]["Enums"]["product_unit"]
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          id?: string
          is_active?: boolean
          location_id?: string | null
          name: string
          reorder_threshold?: number
          requires_tare_weight?: boolean
          sku: string
          unit: Database["public"]["Enums"]["product_unit"]
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          id?: string
          is_active?: boolean
          location_id?: string | null
          name?: string
          reorder_threshold?: number
          requires_tare_weight?: boolean
          sku?: string
          unit?: Database["public"]["Enums"]["product_unit"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_definitions: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          location_id: string
          shift_name: Database["public"]["Enums"]["shift_name"]
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          location_id: string
          shift_name: Database["public"]["Enums"]["shift_name"]
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          location_id?: string
          shift_name?: Database["public"]["Enums"]["shift_name"]
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_definitions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          actual_cash_count: number | null
          approved_at: string | null
          approved_by_user_id: string | null
          closed_at: string | null
          closed_by_user_id: string | null
          created_at: string | null
          force_closed: boolean
          handoff_notes: string | null
          id: string
          location_id: string
          opened_at: string
          opened_by_user_id: string
          rejection_reason: string | null
          shift_definition_id: string
          starting_cash_float: number
          status: Database["public"]["Enums"]["shift_status"]
          updated_at: string | null
          variance: number | null
          variance_reason: string | null
        }
        Insert: {
          actual_cash_count?: number | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          closed_at?: string | null
          closed_by_user_id?: string | null
          created_at?: string | null
          force_closed?: boolean
          handoff_notes?: string | null
          id?: string
          location_id: string
          opened_at?: string
          opened_by_user_id: string
          rejection_reason?: string | null
          shift_definition_id: string
          starting_cash_float: number
          status?: Database["public"]["Enums"]["shift_status"]
          updated_at?: string | null
          variance?: number | null
          variance_reason?: string | null
        }
        Update: {
          actual_cash_count?: number | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          closed_at?: string | null
          closed_by_user_id?: string | null
          created_at?: string | null
          force_closed?: boolean
          handoff_notes?: string | null
          id?: string
          location_id?: string
          opened_at?: string
          opened_by_user_id?: string
          rejection_reason?: string | null
          shift_definition_id?: string
          starting_cash_float?: number
          status?: Database["public"]["Enums"]["shift_status"]
          updated_at?: string | null
          variance?: number | null
          variance_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_closed_by_user_id_fkey"
            columns: ["closed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_opened_by_user_id_fkey"
            columns: ["opened_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_shift_definition_id_fkey"
            columns: ["shift_definition_id"]
            isOneToOne: false
            referencedRelation: "shift_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_count_items: {
        Row: {
          actual_quantity: number | null
          counted: boolean
          created_at: string | null
          expected_quantity: number
          id: string
          product_id: string
          stock_count_id: string
          updated_at: string | null
          variance: number | null
          variance_notes: string | null
        }
        Insert: {
          actual_quantity?: number | null
          counted?: boolean
          created_at?: string | null
          expected_quantity: number
          id?: string
          product_id: string
          stock_count_id: string
          updated_at?: string | null
          variance?: number | null
          variance_notes?: string | null
        }
        Update: {
          actual_quantity?: number | null
          counted?: boolean
          created_at?: string | null
          expected_quantity?: number
          id?: string
          product_id?: string
          stock_count_id?: string
          updated_at?: string | null
          variance?: number | null
          variance_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_count_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_count_items_stock_count_id_fkey"
            columns: ["stock_count_id"]
            isOneToOne: false
            referencedRelation: "stock_counts"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_counts: {
        Row: {
          category_filter:
            | Database["public"]["Enums"]["product_category"]
            | null
          count_date: string
          count_type: Database["public"]["Enums"]["stock_count_type"]
          created_at: string | null
          finalized_at: string | null
          finalized_by_user_id: string | null
          id: string
          initiated_at: string
          initiated_by_user_id: string
          location_id: string
          status: Database["public"]["Enums"]["stock_count_status"]
          updated_at: string | null
        }
        Insert: {
          category_filter?:
            | Database["public"]["Enums"]["product_category"]
            | null
          count_date: string
          count_type?: Database["public"]["Enums"]["stock_count_type"]
          created_at?: string | null
          finalized_at?: string | null
          finalized_by_user_id?: string | null
          id?: string
          initiated_at?: string
          initiated_by_user_id: string
          location_id: string
          status?: Database["public"]["Enums"]["stock_count_status"]
          updated_at?: string | null
        }
        Update: {
          category_filter?:
            | Database["public"]["Enums"]["product_category"]
            | null
          count_date?: string
          count_type?: Database["public"]["Enums"]["stock_count_type"]
          created_at?: string | null
          finalized_at?: string | null
          finalized_by_user_id?: string | null
          id?: string
          initiated_at?: string
          initiated_by_user_id?: string
          location_id?: string
          status?: Database["public"]["Enums"]["stock_count_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_counts_finalized_by_user_id_fkey"
            columns: ["finalized_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_counts_initiated_by_user_id_fkey"
            columns: ["initiated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_counts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_items: {
        Row: {
          batch_allocations: Json
          created_at: string | null
          gross_weight: number | null
          id: string
          line_total: number
          override_price: number | null
          override_reason: string | null
          product_id: string
          quantity: number
          tare_weight: number | null
          tier_id: string | null
          transaction_id: string
          unit_price: number
        }
        Insert: {
          batch_allocations?: Json
          created_at?: string | null
          gross_weight?: number | null
          id?: string
          line_total: number
          override_price?: number | null
          override_reason?: string | null
          product_id: string
          quantity: number
          tare_weight?: number | null
          tier_id?: string | null
          transaction_id: string
          unit_price: number
        }
        Update: {
          batch_allocations?: Json
          created_at?: string | null
          gross_weight?: number | null
          id?: string
          line_total?: number
          override_price?: number | null
          override_reason?: string | null
          product_id?: string
          quantity?: number
          tare_weight?: number | null
          tier_id?: string | null
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          shift_id: string
          total_amount: number
          transaction_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          shift_id: string
          total_amount: number
          transaction_date?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          shift_id?: string
          total_amount?: number
          transaction_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          location_id: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          location_id?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          location_id?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_location: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      adjustment_reason: "Damage" | "Theft" | "Count Correction" | "Other"
      batch_status: "Active" | "Depleted"
      payment_method: "Cash" | "Card" | "QR Code"
      product_category:
        | "Flower"
        | "Pre-Roll"
        | "Edible"
        | "Concentrate"
        | "Other"
      product_unit: "gram" | "piece" | "bottle" | "package"
      shift_name: "AM" | "PM"
      shift_status:
        | "Open"
        | "Pending Approval"
        | "Approved"
        | "Rejected"
        | "Force Closed"
      stock_count_status: "In Progress" | "Finalized" | "Cancelled"
      stock_count_type: "Full" | "Cycle"
      user_role: "cashier" | "manager" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      adjustment_reason: ["Damage", "Theft", "Count Correction", "Other"],
      batch_status: ["Active", "Depleted"],
      payment_method: ["Cash", "Card", "QR Code"],
      product_category: [
        "Flower",
        "Pre-Roll",
        "Edible",
        "Concentrate",
        "Other",
      ],
      product_unit: ["gram", "piece", "bottle", "package"],
      shift_name: ["AM", "PM"],
      shift_status: [
        "Open",
        "Pending Approval",
        "Approved",
        "Rejected",
        "Force Closed",
      ],
      stock_count_status: ["In Progress", "Finalized", "Cancelled"],
      stock_count_type: ["Full", "Cycle"],
      user_role: ["cashier", "manager", "owner"],
    },
  },
} as const

