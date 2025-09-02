-- Habilitar RLS nas novas tabelas
ALTER TABLE public.lead_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_leads ENABLE ROW LEVEL SECURITY;

-- Políticas para lead_groups (permitir todas as operações para usuários autenticados)
CREATE POLICY "Enable all operations for authenticated users on lead_groups" ON public.lead_groups
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para unified_schedules (permitir todas as operações para usuários autenticados)
CREATE POLICY "Enable all operations for authenticated users on unified_schedules" ON public.unified_schedules
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para schedule_properties (permitir todas as operações para usuários autenticados)
CREATE POLICY "Enable all operations for authenticated users on schedule_properties" ON public.schedule_properties
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para schedule_leads (permitir todas as operações para usuários autenticados)
CREATE POLICY "Enable all operations for authenticated users on schedule_leads" ON public.schedule_leads
    FOR ALL USING (auth.role() = 'authenticated');

-- Política adicional para contact_leads (caso não exista)
CREATE POLICY "Enable all operations for authenticated users on contact_leads" ON public.contact_leads
    FOR ALL USING (auth.role() = 'authenticated');
