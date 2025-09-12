-- Script para testar se a tabela schedule_logs foi criada corretamente

-- 1. Verificar se a tabela existe
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'schedule_logs'
ORDER BY ordinal_position;

-- 2. Verificar se há agendamentos para testar
SELECT id, name, method, status 
FROM unified_schedules 
LIMIT 5;

-- 3. Inserir um log de teste (substitua o schedule_id por um ID real)
INSERT INTO schedule_logs (
    schedule_id,
    status,
    total_recipients,
    successful_sends,
    failed_sends,
    method,
    error_message,
    execution_details,
    execution_date
) VALUES (
    1, -- Substitua por um ID real de agendamento
    'success',
    10,
    10,
    0,
    'whatsapp',
    NULL,
    '{"test": true, "execution_time_ms": 1000}',
    NOW()
);

-- 4. Verificar se o log foi inserido
SELECT * FROM schedule_logs ORDER BY created_at DESC LIMIT 5;

-- 5. Verificar constraints e índices
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'schedule_logs';

-- 6. Verificar índices
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'schedule_logs';
