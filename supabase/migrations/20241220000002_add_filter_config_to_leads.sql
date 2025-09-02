-- Adicionar campo para armazenar configuração de filtros na tabela contact_leads
ALTER TABLE public.contact_leads 
ADD COLUMN filter_config jsonb NULL;

-- Criar índice para melhor performance em consultas por filtros
CREATE INDEX IF NOT EXISTS idx_contact_leads_filter_config ON public.contact_leads USING gin (filter_config);

-- Comentário explicativo
COMMENT ON COLUMN public.contact_leads.filter_config IS 'Configuração de filtros aplicados quando o lead foi capturado (cidade, bairros, preços, etc.)';
