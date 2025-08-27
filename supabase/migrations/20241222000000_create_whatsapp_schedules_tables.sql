-- Criar tabela para agendamentos de WhatsApp
CREATE TABLE whatsapp_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    page_type TEXT NOT NULL CHECK (page_type IN ('RJ', 'SP')),
    filter_config JSONB DEFAULT '{}',
    max_properties INTEGER DEFAULT 10,
    message_template TEXT NOT NULL DEFAULT 'Confira nossa seleção de {count} imóveis em leilão: {url}',
    recipient_phones TEXT[] DEFAULT '{}',
    phone_list_id UUID,
    recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'once')),
    recurrence_interval INTEGER DEFAULT 1,
    send_time TIME NOT NULL DEFAULT '09:00',
    send_weekdays INTEGER[] DEFAULT NULL,
    send_day_of_month INTEGER DEFAULT NULL,
    send_timezone TEXT DEFAULT 'America/Sao_Paulo',
    next_send_at TIMESTAMP WITH TIME ZONE,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    total_messages_sent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Criar tabela para listas de telefones WhatsApp
CREATE TABLE whatsapp_phone_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    phones TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Criar tabela para logs de envio de WhatsApp
CREATE TABLE whatsapp_schedule_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID REFERENCES whatsapp_schedules(id) ON DELETE CASCADE,
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
    properties_found INTEGER,
    properties_sent INTEGER,
    messages_sent INTEGER,
    error_message TEXT,
    error_details JSONB,
    message_details JSONB,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_whatsapp_schedules_is_active ON whatsapp_schedules(is_active);
CREATE INDEX idx_whatsapp_schedules_next_send ON whatsapp_schedules(next_send_at) WHERE is_active = true;
CREATE INDEX idx_whatsapp_schedules_page_type ON whatsapp_schedules(page_type);
CREATE INDEX idx_whatsapp_phone_lists_is_active ON whatsapp_phone_lists(is_active);
CREATE INDEX idx_whatsapp_schedule_logs_schedule_id ON whatsapp_schedule_logs(schedule_id);
CREATE INDEX idx_whatsapp_schedule_logs_executed_at ON whatsapp_schedule_logs(executed_at);

-- Adicionar FK para lista de telefones
ALTER TABLE whatsapp_schedules ADD CONSTRAINT fk_whatsapp_schedules_phone_list 
    FOREIGN KEY (phone_list_id) REFERENCES whatsapp_phone_lists(id) ON DELETE SET NULL;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_schedules_updated_at 
    BEFORE UPDATE ON whatsapp_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_phone_lists_updated_at 
    BEFORE UPDATE ON whatsapp_phone_lists 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular próximo envio (similar à do email, mas para WhatsApp)
CREATE OR REPLACE FUNCTION calculate_next_whatsapp_send_time(
    p_recurrence_type TEXT,
    p_recurrence_interval INTEGER,
    p_send_time TIME,
    p_send_weekdays INTEGER[] DEFAULT NULL,
    p_send_day_of_month INTEGER DEFAULT NULL,
    p_timezone TEXT DEFAULT 'America/Sao_Paulo',
    p_from_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
DECLARE
    next_send TIMESTAMP WITH TIME ZONE;
    current_date_in_tz DATE;
    current_time_in_tz TIME;
    target_datetime TIMESTAMP WITH TIME ZONE;
    target_weekday INTEGER;
    days_to_add INTEGER;
    i INTEGER;
BEGIN
    -- Converter para o timezone especificado
    current_date_in_tz := (p_from_date AT TIME ZONE p_timezone)::DATE;
    current_time_in_tz := (p_from_date AT TIME ZONE p_timezone)::TIME;
    
    CASE p_recurrence_type
        WHEN 'once' THEN
            -- Para envio único, calcular para hoje se ainda não passou do horário, senão amanhã
            IF current_time_in_tz < p_send_time THEN
                target_datetime := (current_date_in_tz + p_send_time) AT TIME ZONE p_timezone;
            ELSE
                target_datetime := ((current_date_in_tz + INTERVAL '1 day') + p_send_time) AT TIME ZONE p_timezone;
            END IF;
            
        WHEN 'daily' THEN
            -- Para diário, verificar se já passou do horário hoje
            IF current_time_in_tz < p_send_time THEN
                target_datetime := (current_date_in_tz + p_send_time) AT TIME ZONE p_timezone;
            ELSE
                target_datetime := ((current_date_in_tz + (p_recurrence_interval || ' days')::INTERVAL) + p_send_time) AT TIME ZONE p_timezone;
            END IF;
            
        WHEN 'weekly' THEN
            -- Para semanal, encontrar o próximo dia válido
            target_datetime := NULL;
            
            -- Tentar hoje primeiro se ainda não passou do horário
            target_weekday := EXTRACT(DOW FROM current_date_in_tz)::INTEGER;
            IF current_time_in_tz < p_send_time AND p_send_weekdays @> ARRAY[target_weekday] THEN
                target_datetime := (current_date_in_tz + p_send_time) AT TIME ZONE p_timezone;
            ELSE
                -- Procurar próximo dia válido nos próximos 7 dias
                FOR i IN 1..7 LOOP
                    target_weekday := EXTRACT(DOW FROM (current_date_in_tz + (i || ' days')::INTERVAL))::INTEGER;
                    IF p_send_weekdays @> ARRAY[target_weekday] THEN
                        target_datetime := ((current_date_in_tz + (i || ' days')::INTERVAL) + p_send_time) AT TIME ZONE p_timezone;
                        EXIT;
                    END IF;
                END LOOP;
            END IF;
            
            -- Se não encontrou, algo está errado com os dias da semana
            IF target_datetime IS NULL THEN
                RAISE EXCEPTION 'Nenhum dia da semana válido encontrado';
            END IF;
            
        WHEN 'monthly' THEN
            -- Para mensal, calcular próximo mês
            IF EXTRACT(DAY FROM current_date_in_tz)::INTEGER < p_send_day_of_month 
               OR (EXTRACT(DAY FROM current_date_in_tz)::INTEGER = p_send_day_of_month AND current_time_in_tz < p_send_time) THEN
                -- Ainda dá tempo este mês
                target_datetime := (DATE_TRUNC('month', current_date_in_tz) + ((p_send_day_of_month - 1) || ' days')::INTERVAL + p_send_time) AT TIME ZONE p_timezone;
            ELSE
                -- Próximo mês
                target_datetime := (DATE_TRUNC('month', current_date_in_tz) + (p_recurrence_interval || ' months')::INTERVAL + ((p_send_day_of_month - 1) || ' days')::INTERVAL + p_send_time) AT TIME ZONE p_timezone;
            END IF;
            
        ELSE
            RAISE EXCEPTION 'Tipo de recorrência inválido: %', p_recurrence_type;
    END CASE;
    
    RETURN target_datetime;
END;
$$;
