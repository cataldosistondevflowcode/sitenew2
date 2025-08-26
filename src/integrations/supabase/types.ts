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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_leads: {
        Row: {
          contact_method: string | null
          created_at: string | null
          email: string | null
          id: number
          message: string | null
          name: string | null
          phone: string | null
          property_id: number | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          contact_method?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          phone?: string | null
          property_id?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          contact_method?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
          phone?: string | null
          property_id?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_visits: {
        Row: {
          created_at: string | null
          date: string
          id: number
          page_views: number | null
          unique_visitors: number | null
          updated_at: string | null
          visits_count: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: number
          page_views?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          visits_count?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          page_views?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          visits_count?: number | null
        }
        Relationships: []
      }
      email_schedule_logs: {
        Row: {
          created_at: string | null
          email_details: Json | null
          emails_sent: number | null
          error_details: Json | null
          error_message: string | null
          executed_at: string
          execution_time_ms: number | null
          id: string
          properties_found: number | null
          properties_sent: number | null
          schedule_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          email_details?: Json | null
          emails_sent?: number | null
          error_details?: Json | null
          error_message?: string | null
          executed_at: string
          execution_time_ms?: number | null
          id?: string
          properties_found?: number | null
          properties_sent?: number | null
          schedule_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          email_details?: Json | null
          emails_sent?: number | null
          error_details?: Json | null
          error_message?: string | null
          executed_at?: string
          execution_time_ms?: number | null
          id?: string
          properties_found?: number | null
          properties_sent?: number | null
          schedule_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_schedule_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "email_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      email_schedules: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          filter_config: Json | null
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          max_properties: number | null
          name: string
          next_send_at: string | null
          page_type: string
          recipient_emails: string[]
          recurrence_interval: number | null
          recurrence_type: string
          send_day_of_month: number | null
          send_time: string
          send_timezone: string | null
          send_weekdays: number[] | null
          subject_template: string
          total_emails_sent: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          filter_config?: Json | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          max_properties?: number | null
          name: string
          next_send_at?: string | null
          page_type: string
          recipient_emails: string[]
          recurrence_interval?: number | null
          recurrence_type: string
          send_day_of_month?: number | null
          send_time: string
          send_timezone?: string | null
          send_weekdays?: number[] | null
          subject_template: string
          total_emails_sent?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          filter_config?: Json | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          max_properties?: number | null
          name?: string
          next_send_at?: string | null
          page_type?: string
          recipient_emails?: string[]
          recurrence_interval?: number | null
          recurrence_type?: string
          send_day_of_month?: number | null
          send_time?: string
          send_timezone?: string | null
          send_weekdays?: number[] | null
          subject_template?: string
          total_emails_sent?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      leiloes_imoveis: {
        Row: {
          bairro: string | null
          cidade: string
          consorcio: boolean | null
          data_leilao_1: string | null
          data_leilao_2: string | null
          descricao: string | null
          endereco: string | null
          estado: string
          fgts: boolean | null
          financiamento: boolean | null
          id: number
          imagem: string | null
          leilao_1: number | null
          leilao_2: number | null
          leiloeiro_nome: string | null
          numero_processo: string | null
          parcelamento: boolean | null
          tipo_leilao: string | null
          tipo_propriedade: string | null
          titulo_propriedade: string | null
          url: string | null
        }
        Insert: {
          bairro?: string | null
          cidade: string
          consorcio?: boolean | null
          data_leilao_1?: string | null
          data_leilao_2?: string | null
          descricao?: string | null
          endereco?: string | null
          estado: string
          fgts?: boolean | null
          financiamento?: boolean | null
          id: number
          imagem?: string | null
          leilao_1?: number | null
          leilao_2?: number | null
          leiloeiro_nome?: string | null
          numero_processo?: string | null
          parcelamento?: boolean | null
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
        }
        Update: {
          bairro?: string | null
          cidade?: string
          consorcio?: boolean | null
          data_leilao_1?: string | null
          data_leilao_2?: string | null
          descricao?: string | null
          endereco?: string | null
          estado?: string
          fgts?: boolean | null
          financiamento?: boolean | null
          id?: number
          imagem?: string | null
          leilao_1?: number | null
          leilao_2?: number | null
          leiloeiro_nome?: string | null
          numero_processo?: string | null
          parcelamento?: boolean | null
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
        }
        Relationships: []
      }
      property_clicks: {
        Row: {
          click_type: string
          clicked_at: string | null
          id: number
          property_id: number | null
          session_id: string | null
          user_agent: string | null
          visitor_ip: string | null
        }
        Insert: {
          click_type: string
          clicked_at?: string | null
          id?: number
          property_id?: number | null
          session_id?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Update: {
          click_type?: string
          clicked_at?: string | null
          id?: number
          property_id?: number | null
          session_id?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_clicks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          id: number
          property_id: number | null
          referrer: string | null
          session_id: string | null
          time_spent_seconds: number | null
          user_agent: string | null
          viewed_at: string | null
          visitor_ip: string | null
        }
        Insert: {
          id?: number
          property_id?: number | null
          referrer?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
          user_agent?: string | null
          viewed_at?: string | null
          visitor_ip?: string | null
        }
        Update: {
          id?: number
          property_id?: number | null
          referrer?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
          user_agent?: string | null
          viewed_at?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          clicked_property_id: number | null
          filters_used: Json | null
          id: number
          results_count: number | null
          search_query: string | null
          searched_at: string | null
          session_id: string | null
          visitor_ip: string | null
        }
        Insert: {
          clicked_property_id?: number | null
          filters_used?: Json | null
          id?: number
          results_count?: number | null
          search_query?: string | null
          searched_at?: string | null
          session_id?: string | null
          visitor_ip?: string | null
        }
        Update: {
          clicked_property_id?: number | null
          filters_used?: Json | null
          id?: number
          results_count?: number | null
          search_query?: string | null
          searched_at?: string | null
          session_id?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_analytics_clicked_property_id_fkey"
            columns: ["clicked_property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      sp_bairros_cd2022: {
        Row: {
          cd_bairro: string | null
          cd_concurb: string | null
          cd_dist: string | null
          cd_mun: string | null
          cd_regiao: string | null
          cd_rgi: string | null
          cd_rgint: string | null
          cd_subdist: string | null
          cd_uf: string | null
          nm_bairro: string | null
          nm_concurb: string | null
          nm_dist: string | null
          nm_mun: string | null
          nm_regiao: string | null
          nm_rgi: string | null
          nm_rgint: string | null
          nm_subdist: string | null
          nm_uf: string | null
        }
        Insert: {
          cd_bairro?: string | null
          cd_concurb?: string | null
          cd_dist?: string | null
          cd_mun?: string | null
          cd_regiao?: string | null
          cd_rgi?: string | null
          cd_rgint?: string | null
          cd_subdist?: string | null
          cd_uf?: string | null
          nm_bairro?: string | null
          nm_concurb?: string | null
          nm_dist?: string | null
          nm_mun?: string | null
          nm_regiao?: string | null
          nm_rgi?: string | null
          nm_rgint?: string | null
          nm_subdist?: string | null
          nm_uf?: string | null
        }
        Update: {
          cd_bairro?: string | null
          cd_concurb?: string | null
          cd_dist?: string | null
          cd_mun?: string | null
          cd_regiao?: string | null
          cd_rgi?: string | null
          cd_rgint?: string | null
          cd_subdist?: string | null
          cd_uf?: string | null
          nm_bairro?: string | null
          nm_concurb?: string | null
          nm_dist?: string | null
          nm_mun?: string | null
          nm_regiao?: string | null
          nm_rgi?: string | null
          nm_rgint?: string | null
          nm_subdist?: string | null
          nm_uf?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_send_time: {
        Args: {
          p_from_date?: string
          p_recurrence_interval: number
          p_recurrence_type: string
          p_send_day_of_month: number
          p_send_time: string
          p_send_weekdays: number[]
          p_timezone: string
        }
        Returns: string
      }
      get_analytics_summary: {
        Args: { days_back?: number }
        Returns: {
          avg_time_on_properties: number
          total_daily_visits: number
          total_leads: number
          total_property_views: number
          total_searches: number
          total_unique_visitors: number
        }[]
      }
      get_most_clicked_properties_v2: {
        Args: { days_back?: number; limit_count?: number }
        Returns: {
          cidade: string
          click_count: number
          estado: string
          last_clicked: string
          property_id: number
          titulo_propriedade: string
        }[]
      }
      get_most_viewed_properties: {
        Args: { days_back?: number; limit_count?: number }
        Returns: {
          avg_time_spent: number
          cidade: string
          estado: string
          property_id: number
          titulo_propriedade: string
          unique_viewers: number
          view_count: number
        }[]
      }
      get_popular_filters: {
        Args: { limit_count?: number }
        Returns: {
          filter_count: number
          filter_name: string
        }[]
      }
      get_popular_searches: {
        Args: { limit_count?: number }
        Returns: {
          search_count: number
          search_query: string
        }[]
      }
      increment_daily_visit: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const