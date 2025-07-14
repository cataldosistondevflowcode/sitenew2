export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      leiloes_imoveis: {
        Row: {
          bairro: string | null
          cidade: string
          consorcio: boolean
          data_leilao_1: string | null
          data_leilao_2: string | null
          descricao: string | null
          endereco: string | null
          estado: string
          fgts: boolean
          financiamento: boolean
          id: number
          imagem: string | null
          leilao_1: number | null
          leilao_2: number | null
          leiloeiro_nome: string | null
          numero_processo: string | null
          parcelamento: boolean
          tipo_leilao: string | null
          tipo_propriedade: string | null
          titulo_propriedade: string | null
          url: string | null
        }
        Insert: {
          bairro?: string | null
          cidade: string
          consorcio?: boolean
          data_leilao_1?: string | null
          data_leilao_2?: string | null
          descricao?: string | null
          endereco?: string | null
          estado: string
          fgts?: boolean
          financiamento?: boolean
          id: number
          imagem?: string | null
          leilao_1?: number | null
          leilao_2?: number | null
          leiloeiro_nome?: string | null
          numero_processo?: string | null
          parcelamento?: boolean
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
        }
        Update: {
          bairro?: string | null
          cidade?: string
          consorcio?: boolean
          data_leilao_1?: string | null
          data_leilao_2?: string | null
          descricao?: string | null
          endereco?: string | null
          estado?: string
          fgts?: boolean
          financiamento?: boolean
          id?: number
          imagem?: string | null
          leilao_1?: number | null
          leilao_2?: number | null
          leiloeiro_nome?: string | null
          numero_processo?: string | null
          parcelamento?: boolean
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
        }
        Relationships: []
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
