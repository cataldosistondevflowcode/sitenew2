-- Adicionar campo whatsapp_image_url à tabela unified_schedules
ALTER TABLE public.unified_schedules 
ADD COLUMN whatsapp_image_url text NULL;

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.unified_schedules.whatsapp_image_url IS 'URL da imagem opcional para mensagens WhatsApp';
