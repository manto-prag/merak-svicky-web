export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      colors: {
        Row: {
          active: boolean
          created_at: string
          description_cs: string
          description_en: string
          hex: string
          id: string
          name_cs: string
          name_en: string
          price_delta: number
          slug: string
          sort_order: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description_cs?: string
          description_en?: string
          hex?: string
          id?: string
          name_cs: string
          name_en: string
          price_delta?: number
          slug: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description_cs?: string
          description_en?: string
          hex?: string
          id?: string
          name_cs?: string
          name_en?: string
          price_delta?: number
          slug?: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color_hex: string
          color_id: string | null
          color_name_cs: string
          color_name_en: string
          created_at: string
          id: string
          line_total: number
          message: string
          order_id: string
          packaging_id: string | null
          packaging_name_cs: string
          packaging_name_en: string
          quantity: number
          scent_id: string | null
          scent_name_cs: string
          scent_name_en: string
          unit_price: number
        }
        Insert: {
          color_hex?: string
          color_id?: string | null
          color_name_cs: string
          color_name_en: string
          created_at?: string
          id?: string
          line_total?: number
          message?: string
          order_id: string
          packaging_id?: string | null
          packaging_name_cs: string
          packaging_name_en: string
          quantity?: number
          scent_id?: string | null
          scent_name_cs: string
          scent_name_en: string
          unit_price?: number
        }
        Update: {
          color_hex?: string
          color_id?: string | null
          color_name_cs?: string
          color_name_en?: string
          created_at?: string
          id?: string
          line_total?: number
          message?: string
          order_id?: string
          packaging_id?: string | null
          packaging_name_cs?: string
          packaging_name_en?: string
          quantity?: number
          scent_id?: string | null
          scent_name_cs?: string
          scent_name_en?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_packaging_id_fkey"
            columns: ["packaging_id"]
            isOneToOne: false
            referencedRelation: "packagings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_scent_id_fkey"
            columns: ["scent_id"]
            isOneToOne: false
            referencedRelation: "scents"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          email: string
          id: string
          items_total: number
          locale: string
          note: string
          order_number: string
          paid_at: string | null
          phone: string
          pickup_point: string
          shipped_at: string | null
          shipping_total: number
          status: string
          total: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email: string
          id?: string
          items_total?: number
          locale?: string
          note?: string
          order_number: string
          paid_at?: string | null
          phone: string
          pickup_point: string
          shipped_at?: string | null
          shipping_total?: number
          status?: string
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string
          id?: string
          items_total?: number
          locale?: string
          note?: string
          order_number?: string
          paid_at?: string | null
          phone?: string
          pickup_point?: string
          shipped_at?: string | null
          shipping_total?: number
          status?: string
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packagings: {
        Row: {
          active: boolean
          created_at: string
          description_cs: string
          description_en: string
          id: string
          image_url: string | null
          name_cs: string
          name_en: string
          price_delta: number
          slug: string
          sort_order: number
          stock: number
          updated_at: string
          vessel_style: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description_cs?: string
          description_en?: string
          id?: string
          image_url?: string | null
          name_cs: string
          name_en: string
          price_delta?: number
          slug: string
          sort_order?: number
          stock?: number
          updated_at?: string
          vessel_style?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description_cs?: string
          description_en?: string
          id?: string
          image_url?: string | null
          name_cs?: string
          name_en?: string
          price_delta?: number
          slug?: string
          sort_order?: number
          stock?: number
          updated_at?: string
          vessel_style?: string
        }
        Relationships: []
      }
      pickup_points: {
        Row: {
          active: boolean
          city: string
          created_at: string
          id: string
          name: string
          street: string
          zip: string
        }
        Insert: {
          active?: boolean
          city?: string
          created_at?: string
          id?: string
          name: string
          street?: string
          zip?: string
        }
        Update: {
          active?: boolean
          city?: string
          created_at?: string
          id?: string
          name?: string
          street?: string
          zip?: string
        }
        Relationships: []
      }
      scents: {
        Row: {
          active: boolean
          created_at: string
          description_cs: string
          description_en: string
          id: string
          image_url: string | null
          name_cs: string
          name_en: string
          notes_cs: string
          notes_en: string
          price_delta: number
          recommended_color_slug: string
          slug: string
          sort_order: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description_cs?: string
          description_en?: string
          id?: string
          image_url?: string | null
          name_cs: string
          name_en: string
          notes_cs?: string
          notes_en?: string
          price_delta?: number
          recommended_color_slug?: string
          slug: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description_cs?: string
          description_en?: string
          id?: string
          image_url?: string | null
          name_cs?: string
          name_en?: string
          notes_cs?: string
          notes_en?: string
          price_delta?: number
          recommended_color_slug?: string
          slug?: string
          sort_order?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      shop_settings: {
        Row: {
          bank_account: string
          bank_holder: string
          bank_iban: string
          base_price: number
          contact_email: string
          contact_phone: string
          free_shipping_from: number
          id: number
          instagram: string
          personalization_fee: number
          shipping_price: number
          updated_at: string
        }
        Insert: {
          bank_account?: string
          bank_holder?: string
          bank_iban?: string
          base_price?: number
          contact_email?: string
          contact_phone?: string
          free_shipping_from?: number
          id?: number
          instagram?: string
          personalization_fee?: number
          shipping_price?: number
          updated_at?: string
        }
        Update: {
          bank_account?: string
          bank_holder?: string
          bank_iban?: string
          base_price?: number
          contact_email?: string
          contact_phone?: string
          free_shipping_from?: number
          id?: number
          instagram?: string
          personalization_fee?: number
          shipping_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
