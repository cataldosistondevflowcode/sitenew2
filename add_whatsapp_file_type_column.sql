-- Adicionar coluna whatsapp_file_type na tabela unified_schedules
ALTER TABLE unified_schedules 
ADD COLUMN whatsapp_file_type VARCHAR(10) DEFAULT 'pdf' CHECK (whatsapp_file_type IN ('pdf', 'image'));

-- Comentário para documentar a coluna
COMMENT ON COLUMN unified_schedules.whatsapp_file_type IS 'Tipo do arquivo anexado: pdf ou image';
