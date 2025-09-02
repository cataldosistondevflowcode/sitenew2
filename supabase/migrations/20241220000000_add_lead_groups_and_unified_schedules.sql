-- Adicionar campo group_id à tabela contact_leads
ALTER TABLE public.contact_leads 
ADD COLUMN group_id bigint NULL;

-- Criar tabela de grupos de leads
CREATE TABLE public.lead_groups (
  id bigserial NOT NULL,
  name character varying(255) NOT NULL,
  description text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_by character varying(255) NULL,
  is_active boolean NULL DEFAULT true,
  CONSTRAINT lead_groups_pkey PRIMARY KEY (id)
);

-- Criar tabela de agendamentos unificados
CREATE TABLE public.unified_schedules (
  id bigserial NOT NULL,
  name character varying(255) NOT NULL,
  group_id bigint NULL,
  method character varying(50) NOT NULL CHECK (method IN ('email', 'whatsapp', 'both')),
  frequency character varying(50) NOT NULL,
  send_time time NOT NULL,
  send_date date NULL,
  is_recurring boolean NULL DEFAULT true,
  whatsapp_message text NULL,
  email_message text NULL,
  email_subject character varying(255) NULL,
  status character varying(50) NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  next_send timestamp with time zone NULL,
  last_sent timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  created_by character varying(255) NULL,
  CONSTRAINT unified_schedules_pkey PRIMARY KEY (id)
);

-- Criar tabela de relacionamento entre agendamentos e imóveis
CREATE TABLE public.schedule_properties (
  id bigserial NOT NULL,
  schedule_id bigint NOT NULL,
  property_id bigint NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT schedule_properties_pkey PRIMARY KEY (id),
  CONSTRAINT schedule_properties_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES unified_schedules (id) ON DELETE CASCADE,
  CONSTRAINT schedule_properties_property_id_fkey FOREIGN KEY (property_id) REFERENCES leiloes_imoveis (id) ON DELETE CASCADE
);

-- Criar tabela de relacionamento entre agendamentos e leads específicos
CREATE TABLE public.schedule_leads (
  id bigserial NOT NULL,
  schedule_id bigint NOT NULL,
  lead_id bigint NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT schedule_leads_pkey PRIMARY KEY (id),
  CONSTRAINT schedule_leads_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES unified_schedules (id) ON DELETE CASCADE,
  CONSTRAINT schedule_leads_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES contact_leads (id) ON DELETE CASCADE
);

-- Adicionar foreign key para group_id na tabela contact_leads
ALTER TABLE public.contact_leads 
ADD CONSTRAINT contact_leads_group_id_fkey 
FOREIGN KEY (group_id) REFERENCES lead_groups (id) ON DELETE SET NULL;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contact_leads_group_id ON public.contact_leads USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_unified_schedules_group_id ON public.unified_schedules USING btree (group_id);
CREATE INDEX IF NOT EXISTS idx_unified_schedules_status ON public.unified_schedules USING btree (status);
CREATE INDEX IF NOT EXISTS idx_unified_schedules_next_send ON public.unified_schedules USING btree (next_send);
CREATE INDEX IF NOT EXISTS idx_schedule_properties_schedule_id ON public.schedule_properties USING btree (schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_properties_property_id ON public.schedule_properties USING btree (property_id);
CREATE INDEX IF NOT EXISTS idx_schedule_leads_schedule_id ON public.schedule_leads USING btree (schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_leads_lead_id ON public.schedule_leads USING btree (lead_id);

-- Inserir alguns grupos padrão
INSERT INTO public.lead_groups (name, description, created_by) VALUES
('Compradores Premium', 'Leads com alto potencial de compra', 'system'),
('Jovens Profissionais', 'Profissionais jovens interessados em imóveis', 'system'),
('São Paulo', 'Leads da região de São Paulo', 'system'),
('Rio de Janeiro', 'Leads da região do Rio de Janeiro', 'system'),
('Investidores', 'Leads interessados em investimento imobiliário', 'system');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_lead_groups_updated_at BEFORE UPDATE ON public.lead_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_unified_schedules_updated_at BEFORE UPDATE ON public.unified_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
