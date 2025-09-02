-- Migração para criar cron job no Supabase
-- Data: 2024-12-20

-- 1. Criar função para chamar a Edge Function
CREATE OR REPLACE FUNCTION call_unified_schedules()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Chamar a Edge Function via HTTP
  PERFORM net.http_post(
    url := 'https://jmcurflvrvuvzoddjkcg.supabase.co/functions/v1/process-unified-schedules',
    headers := '{"apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptY3VyZmx2cnZ1dnpvZGRqa2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY5NzI5NywiZXhwIjoyMDUwMjc0ODk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptY3VyZmx2cnZ1dnpvZGRqa2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY5NzI5NywiZXhwIjoyMDUwMjc0ODk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"}'::jsonb
  );
  
  -- Log da execução
  INSERT INTO public.cron_logs (job_name, executed_at, status)
  VALUES ('process-unified-schedules', NOW(), 'executed');
  
EXCEPTION WHEN OTHERS THEN
  -- Log de erro
  INSERT INTO public.cron_logs (job_name, executed_at, status, error_message)
  VALUES ('process-unified-schedules', NOW(), 'error', SQLERRM);
  RAISE;
END;
$$;

-- 2. Criar tabela para logs do cron (opcional, mas útil para debug)
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id BIGSERIAL PRIMARY KEY,
  job_name TEXT NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_cron_logs_job_name ON public.cron_logs(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_executed_at ON public.cron_logs(executed_at);

-- 4. Configurar RLS para a tabela de logs
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pela função
CREATE POLICY "Allow function to insert logs" ON public.cron_logs
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura por usuários autenticados
CREATE POLICY "Allow authenticated users to read logs" ON public.cron_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- 5. Agendar o cron job (executar a cada 5 minutos)
-- NOTA: Você precisa executar isso manualmente no SQL Editor do Supabase
-- SELECT cron.schedule(
--   'process-unified-schedules',
--   '*/5 * * * *',
--   'SELECT call_unified_schedules();'
-- );

-- 6. Comando para verificar cron jobs ativos:
-- SELECT * FROM cron.job;

-- 7. Comando para remover cron job (se necessário):
-- SELECT cron.unschedule('process-unified-schedules');
