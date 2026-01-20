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
      blog_posts: {
        Row: {
          author_name: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: number
          is_active: boolean | null
          is_featured: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: number
          is_active?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: number
          is_active?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          contact_method: string | null
          created_at: string | null
          email: string | null
          filter_config: string | null
          group_id: number | null
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
          filter_config?: string | null
          group_id?: number | null
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
          filter_config?: string | null
          group_id?: number | null
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
            foreignKeyName: "contact_leads_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "lead_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis_com_zona"
            referencedColumns: ["id"]
          },
        ]
      }
      email_lists: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          emails: string[]
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          emails?: string[]
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          emails?: string[]
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
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
          delivery_method: string | null
          description: string | null
          email_list_id: string | null
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
          selected_neighborhoods: string[] | null
          send_day_of_month: number | null
          send_time: string
          send_timezone: string | null
          send_weekdays: number[] | null
          subject_template: string
          total_emails_sent: number | null
          updated_at: string | null
          updated_by: string | null
          whatsapp_list_id: string | null
          whatsapp_numbers: string[] | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          delivery_method?: string | null
          description?: string | null
          email_list_id?: string | null
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
          selected_neighborhoods?: string[] | null
          send_day_of_month?: number | null
          send_time: string
          send_timezone?: string | null
          send_weekdays?: number[] | null
          subject_template: string
          total_emails_sent?: number | null
          updated_at?: string | null
          updated_by?: string | null
          whatsapp_list_id?: string | null
          whatsapp_numbers?: string[] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          delivery_method?: string | null
          description?: string | null
          email_list_id?: string | null
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
          selected_neighborhoods?: string[] | null
          send_day_of_month?: number | null
          send_time?: string
          send_timezone?: string | null
          send_weekdays?: number[] | null
          subject_template?: string
          total_emails_sent?: number | null
          updated_at?: string | null
          updated_by?: string | null
          whatsapp_list_id?: string | null
          whatsapp_numbers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_schedules_email_list_id_fkey"
            columns: ["email_list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_schedules_whatsapp_list_id_fkey"
            columns: ["whatsapp_list_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      filter_cities: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          region_id: number | null
          state: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          region_id?: number | null
          state?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          region_id?: number | null
          state?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filter_cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "filter_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      filter_neighborhoods: {
        Row: {
          city_id: number
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
          zone_id: number | null
        }
        Insert: {
          city_id: number
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
          zone_id?: number | null
        }
        Update: {
          city_id?: number
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "filter_neighborhoods_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "filter_cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filter_neighborhoods_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "filter_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      filter_regions: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          state: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          state?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          state?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      filter_zones: {
        Row: {
          city_id: number
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
          zone_type: string | null
        }
        Insert: {
          city_id: number
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
          zone_type?: string | null
        }
        Update: {
          city_id?: number
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          zone_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filter_zones_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "filter_cities"
            referencedColumns: ["id"]
          },
        ]
      }
      imoveis: {
        Row: {
          area_privativa: number | null
          area_total: number | null
          bairro: string | null
          cidade: string | null
          consorcio: boolean | null
          data_leilao_1: string | null
          data_leilao_2: string | null
          desconto: number | null
          descricao: string | null
          endereco: string | null
          estado: string | null
          fgts: boolean | null
          financiamento: boolean | null
          id: number
          imagem: string | null
          leilao_1: number | null
          leilao_2: number | null
          leiloeiro_nome: string | null
          numero_garagens: number | null
          numero_processo: string | null
          numero_quartos: number | null
          parcelamento: boolean | null
          tipo_leilao: string | null
          tipo_propriedade: string | null
          titulo_propriedade: string | null
          url: string | null
          url_edital: string | null
          url_matricula: string | null
          valor_avaliacao: number | null
        }
        Insert: {
          area_privativa?: number | null
          area_total?: number | null
          bairro?: string | null
          cidade?: string | null
          consorcio?: boolean | null
          data_leilao_1?: string | null
          data_leilao_2?: string | null
          desconto?: number | null
          descricao?: string | null
          endereco?: string | null
          estado?: string | null
          fgts?: boolean | null
          financiamento?: boolean | null
          id: number
          imagem?: string | null
          leilao_1?: number | null
          leilao_2?: number | null
          leiloeiro_nome?: string | null
          numero_garagens?: number | null
          numero_processo?: string | null
          numero_quartos?: number | null
          parcelamento?: boolean | null
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
          url_edital?: string | null
          url_matricula?: string | null
          valor_avaliacao?: number | null
        }
        Update: {
          area_privativa?: number | null
          area_total?: number | null
          bairro?: string | null
          cidade?: string | null
          consorcio?: boolean | null
          data_leilao_1?: string | null
          data_leilao_2?: string | null
          desconto?: number | null
          descricao?: string | null
          endereco?: string | null
          estado?: string | null
          fgts?: boolean | null
          financiamento?: boolean | null
          id?: number
          imagem?: string | null
          leilao_1?: number | null
          leilao_2?: number | null
          leiloeiro_nome?: string | null
          numero_garagens?: number | null
          numero_processo?: string | null
          numero_quartos?: number | null
          parcelamento?: boolean | null
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
          url_edital?: string | null
          url_matricula?: string | null
          valor_avaliacao?: number | null
        }
        Relationships: []
      }
      latitude_longitude_armazenamento: {
        Row: {
          bairro: string | null
          cidade: string | null
          endereco: string | null
          estado: string | null
          id: number
          latitude: string | null
          longitude: string | null
          maps_url: string | null
          streetview_url: string | null
          updated_at: string | null
        }
        Insert: {
          bairro?: string | null
          cidade?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
          latitude?: string | null
          longitude?: string | null
          maps_url?: string | null
          streetview_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bairro?: string | null
          cidade?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
          latitude?: string | null
          longitude?: string | null
          maps_url?: string | null
          streetview_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
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
          numeroGaragens: string | null
          numeroQuartos: string | null
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
          numeroGaragens?: string | null
          numeroQuartos?: string | null
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
          numeroGaragens?: string | null
          numeroQuartos?: string | null
          parcelamento?: boolean | null
          tipo_leilao?: string | null
          tipo_propriedade?: string | null
          titulo_propriedade?: string | null
          url?: string | null
        }
        Relationships: []
      }
      schedule_leads: {
        Row: {
          created_at: string | null
          id: number
          lead_id: number
          schedule_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          lead_id: number
          schedule_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          lead_id?: number
          schedule_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "contact_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_leads_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "unified_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_logs: {
        Row: {
          created_at: string
          error_message: string | null
          execution_date: string
          execution_details: Json | null
          failed_sends: number
          id: number
          method: string
          schedule_id: number
          status: string
          successful_sends: number
          total_recipients: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_date?: string
          execution_details?: Json | null
          failed_sends?: number
          id?: number
          method: string
          schedule_id: number
          status: string
          successful_sends?: number
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_date?: string
          execution_details?: Json | null
          failed_sends?: number
          id?: number
          method?: string
          schedule_id?: number
          status?: string
          successful_sends?: number
          total_recipients?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "unified_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_properties: {
        Row: {
          created_at: string | null
          id: number
          property_id: number
          schedule_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          property_id: number
          schedule_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          property_id?: number
          schedule_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "leiloes_imoveis_com_zona"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_properties_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "unified_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_pages: {
        Row: {
          created_at: string | null
          estado: string
          filter_type: string | null
          filter_value: string
          h1_title: string | null
          id: number
          intro_text: string | null
          is_active: boolean | null
          keyword: string
          last_viewed_at: string | null
          meta_description: string
          meta_keywords: string | null
          meta_title: string
          page_id: string
          regiao: string
          region_content: Json | null
          region_description: string | null
          updated_at: string | null
          url_slug: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          estado: string
          filter_type?: string | null
          filter_value: string
          h1_title?: string | null
          id?: number
          intro_text?: string | null
          is_active?: boolean | null
          keyword: string
          last_viewed_at?: string | null
          meta_description: string
          meta_keywords?: string | null
          meta_title: string
          page_id: string
          regiao: string
          region_content?: Json | null
          region_description?: string | null
          updated_at?: string | null
          url_slug: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          filter_type?: string | null
          filter_value?: string
          h1_title?: string | null
          id?: number
          intro_text?: string | null
          is_active?: boolean | null
          keyword?: string
          last_viewed_at?: string | null
          meta_description?: string
          meta_keywords?: string | null
          meta_title?: string
          page_id?: string
          regiao?: string
          region_content?: Json | null
          region_description?: string | null
          updated_at?: string | null
          url_slug?: string
          view_count?: number | null
        }
        Relationships: []
      }
      success_cases: {
        Row: {
          client_image_url: string | null
          client_name: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          is_featured: boolean | null
          property_type: string | null
          region: string | null
          testimonial: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_image_url?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          is_featured?: boolean | null
          property_type?: string | null
          region?: string | null
          testimonial?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_image_url?: string | null
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          is_featured?: boolean | null
          property_type?: string | null
          region?: string | null
          testimonial?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      unified_schedules: {
        Row: {
          created_at: string | null
          created_by: string | null
          email_message: string | null
          email_subject: string | null
          end_date: string | null
          frequency: string
          group_id: number | null
          id: number
          is_recurring: boolean | null
          last_sent: string | null
          method: string
          name: string
          next_send: string | null
          send_date: string | null
          send_time: string
          status: string | null
          updated_at: string | null
          whatsapp_file_type: string | null
          whatsapp_image_url: string | null
          whatsapp_message: string | null
          whatsapp_pdf_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email_message?: string | null
          email_subject?: string | null
          end_date?: string | null
          frequency: string
          group_id?: number | null
          id?: number
          is_recurring?: boolean | null
          last_sent?: string | null
          method: string
          name: string
          next_send?: string | null
          send_date?: string | null
          send_time: string
          status?: string | null
          updated_at?: string | null
          whatsapp_file_type?: string | null
          whatsapp_image_url?: string | null
          whatsapp_message?: string | null
          whatsapp_pdf_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email_message?: string | null
          email_subject?: string | null
          end_date?: string | null
          frequency?: string
          group_id?: number | null
          id?: number
          is_recurring?: boolean | null
          last_sent?: string | null
          method?: string
          name?: string
          next_send?: string | null
          send_date?: string | null
          send_time?: string
          status?: string | null
          updated_at?: string | null
          whatsapp_file_type?: string | null
          whatsapp_image_url?: string | null
          whatsapp_message?: string | null
          whatsapp_pdf_url?: string | null
        }
        Relationships: []
      }
      whatsapp_lists: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          phone_numbers: string[]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone_numbers?: string[]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone_numbers?: string[]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      whatsapp_phone_lists: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          phones: string[] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phones?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phones?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      whatsapp_schedule_logs: {
        Row: {
          created_at: string | null
          error_details: Json | null
          error_message: string | null
          executed_at: string
          execution_time_ms: number | null
          id: string
          message_details: Json | null
          messages_sent: number | null
          properties_found: number | null
          properties_sent: number | null
          schedule_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error_details?: Json | null
          error_message?: string | null
          executed_at: string
          execution_time_ms?: number | null
          id?: string
          message_details?: Json | null
          messages_sent?: number | null
          properties_found?: number | null
          properties_sent?: number | null
          schedule_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          error_details?: Json | null
          error_message?: string | null
          executed_at?: string
          execution_time_ms?: number | null
          id?: string
          message_details?: Json | null
          messages_sent?: number | null
          properties_found?: number | null
          properties_sent?: number | null
          schedule_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_schedule_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_schedules: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          filter_config: Json | null
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          max_properties: number | null
          message_template: string
          name: string
          next_send_at: string | null
          page_type: string
          phone_list_id: string | null
          recipient_phones: string[] | null
          recurrence_interval: number | null
          recurrence_type: string
          send_day_of_month: number | null
          send_time: string
          send_timezone: string | null
          send_weekdays: number[] | null
          total_messages_sent: number | null
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
          message_template?: string
          name: string
          next_send_at?: string | null
          page_type: string
          phone_list_id?: string | null
          recipient_phones?: string[] | null
          recurrence_interval?: number | null
          recurrence_type: string
          send_day_of_month?: number | null
          send_time?: string
          send_timezone?: string | null
          send_weekdays?: number[] | null
          total_messages_sent?: number | null
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
          message_template?: string
          name?: string
          next_send_at?: string | null
          page_type?: string
          phone_list_id?: string | null
          recipient_phones?: string[] | null
          recurrence_interval?: number | null
          recurrence_type?: string
          send_day_of_month?: number | null
          send_time?: string
          send_timezone?: string | null
          send_weekdays?: number[] | null
          total_messages_sent?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_whatsapp_schedules_phone_list"
            columns: ["phone_list_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_phone_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_sent_messages: {
        Row: {
          created_at: string | null
          id: string
          message_hash: string
          page_url: string
          phone_number: string
          schedule_id: string | null
          sent_at: string | null
          webhook_response: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_hash: string
          page_url: string
          phone_number: string
          schedule_id?: string | null
          sent_at?: string | null
          webhook_response?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_hash?: string
          page_url?: string
          phone_number?: string
          schedule_id?: string | null
          sent_at?: string | null
          webhook_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_sent_messages_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      zonasrio: {
        Row: {
          created_at: string | null
          id: number
          meta_area: string | null
          meta_area_slug: string | null
          name: string
          slug: string
          updated_at: string | null
          zone: string
          zone_slug: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          meta_area?: string | null
          meta_area_slug?: string | null
          name: string
          slug: string
          updated_at?: string | null
          zone: string
          zone_slug: string
        }
        Update: {
          created_at?: string | null
          id?: number
          meta_area?: string | null
          meta_area_slug?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          zone?: string
          zone_slug?: string
        }
        Relationships: []
      }
      zonassaopaulo: {
        Row: {
          created_at: string | null
          id: number
          meta_area: string | null
          meta_area_slug: string | null
          name: string
          slug: string
          updated_at: string | null
          zone: string
          zone_slug: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          meta_area?: string | null
          meta_area_slug?: string | null
          name: string
          slug: string
          updated_at?: string | null
          zone: string
          zone_slug: string
        }
        Update: {
          created_at?: string | null
          id?: number
          meta_area?: string | null
          meta_area_slug?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          zone?: string
          zone_slug?: string
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
      imoveis_zonas_2: {
        Row: {
          area_privativa: number | null
          area_total: number | null
          bairro: string | null
          cidade: string | null
          consorcio: boolean | null
          data_leilao_1: string | null
          data_leilao_2: string | null
          desconto: number | null
          descricao: string | null
          endereco: string | null
          estado: string | null
          fgts: boolean | null
          financiamento: boolean | null
          id: number | null
          imagem: string | null
          leilao_1: number | null
          leilao_2: number | null
          leiloeiro_nome: string | null
          meta_area: string | null
          meta_area_slug: string | null
          numero_garagens: number | null
          numero_processo: string | null
          numero_quartos: number | null
          parcelamento: boolean | null
          tipo_leilao: string | null
          tipo_propriedade: string | null
          titulo_propriedade: string | null
          url: string | null
          url_edital: string | null
          url_matricula: string | null
          valor_avaliacao: number | null
          zone: string | null
          zone_slug: string | null
        }
        Relationships: []
      }
      leiloes_imoveis_com_zona: {
        Row: {
          bairro: string | null
          cidade: string | null
          consorcio: boolean | null
          data_leilao_1: string | null
          data_leilao_2: string | null
          descricao: string | null
          endereco: string | null
          estado: string | null
          fgts: boolean | null
          financiamento: boolean | null
          id: number | null
          imagem: string | null
          leilao_1: number | null
          leilao_2: number | null
          leiloeiro_nome: string | null
          meta_area: string | null
          meta_area_slug: string | null
          numero_processo: string | null
          numeroGaragens: string | null
          numeroQuartos: string | null
          parcelamento: boolean | null
          tipo_leilao: string | null
          tipo_propriedade: string | null
          titulo_propriedade: string | null
          url: string | null
          zone: string | null
          zone_slug: string | null
        }
        Relationships: []
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
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
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
