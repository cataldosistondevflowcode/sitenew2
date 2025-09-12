-- Criar tabela para logs de envios de agendamentos
CREATE TABLE IF NOT EXISTS schedule_logs (
    id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL REFERENCES unified_schedules(id) ON DELETE CASCADE,
    execution_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'partial')),
    total_recipients INTEGER NOT NULL DEFAULT 0,
    successful_sends INTEGER NOT NULL DEFAULT 0,
    failed_sends INTEGER NOT NULL DEFAULT 0,
    method VARCHAR(20) NOT NULL CHECK (method IN ('whatsapp', 'email', 'both')),
    error_message TEXT,
    execution_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_schedule_logs_schedule_id ON schedule_logs(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_logs_execution_date ON schedule_logs(execution_date);
CREATE INDEX IF NOT EXISTS idx_schedule_logs_status ON schedule_logs(status);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_schedule_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_schedule_logs_updated_at
    BEFORE UPDATE ON schedule_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_schedule_logs_updated_at();

-- Comentários para documentação
COMMENT ON TABLE schedule_logs IS 'Logs de execução dos agendamentos de envio';
COMMENT ON COLUMN schedule_logs.schedule_id IS 'ID do agendamento que foi executado';
COMMENT ON COLUMN schedule_logs.execution_date IS 'Data e hora da execução';
COMMENT ON COLUMN schedule_logs.status IS 'Status da execução: success, error, partial';
COMMENT ON COLUMN schedule_logs.total_recipients IS 'Total de destinatários';
COMMENT ON COLUMN schedule_logs.successful_sends IS 'Número de envios bem-sucedidos';
COMMENT ON COLUMN schedule_logs.failed_sends IS 'Número de envios que falharam';
COMMENT ON COLUMN schedule_logs.method IS 'Método de envio: whatsapp, email, both';
COMMENT ON COLUMN schedule_logs.error_message IS 'Mensagem de erro, se houver';
COMMENT ON COLUMN schedule_logs.execution_details IS 'Detalhes adicionais da execução em JSON';
