-- Adicionar campo end_date à tabela unified_schedules
ALTER TABLE public.unified_schedules 
ADD COLUMN end_date date NULL;

-- Adicionar campo whatsapp_pdf_url à tabela unified_schedules
ALTER TABLE public.unified_schedules 
ADD COLUMN whatsapp_pdf_url text NULL;

-- Adicionar comentários explicativos
COMMENT ON COLUMN public.unified_schedules.end_date IS 'Data limite para desativação automática do agendamento recorrente';
COMMENT ON COLUMN public.unified_schedules.whatsapp_pdf_url IS 'URL do PDF opcional para mensagens WhatsApp';

-- Criar índice para end_date para melhor performance em consultas de agendamentos expirados
CREATE INDEX IF NOT EXISTS idx_unified_schedules_end_date ON public.unified_schedules USING btree (end_date);
