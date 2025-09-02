# Instruções para Aplicar as Migrações

## Problemas Identificados e Soluções

### 1. **Problema dos Agendamentos não Aparecerem na Listagem**
**Causa**: Erro na relação entre tabelas `unified_schedules` e `lead_groups`
**Solução**: Corrigido o código para buscar grupos de forma separada

### 2. **Nova Funcionalidade: Atribuir Filtros à Lista de Leads**
**Objetivo**: Permitir que leads tenham filtros associados para agendamentos personalizados

## Migrações Necessárias

### Migração 1: Correção das Permissões RLS
Execute no Supabase SQL Editor:

```sql
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
```

### Migração 2: Adicionar Campo de Filtros aos Leads
Execute no Supabase SQL Editor:

```sql
-- Adicionar campo para armazenar configuração de filtros na tabela contact_leads
ALTER TABLE public.contact_leads 
ADD COLUMN filter_config jsonb NULL;

-- Criar índice para melhor performance em consultas por filtros
CREATE INDEX IF NOT EXISTS idx_contact_leads_filter_config ON public.contact_leads USING gin (filter_config);

-- Comentário explicativo
COMMENT ON COLUMN public.contact_leads.filter_config IS 'Configuração de filtros aplicados quando o lead foi capturado (cidade, bairros, preços, etc.)';
```

## Como Aplicar

1. **Acesse o Supabase Dashboard**
2. **Vá para SQL Editor**
3. **Execute a Migração 1 primeiro** (correção das permissões)
4. **Execute a Migração 2** (adicionar campo de filtros)
5. **Teste as funcionalidades**

## Novas Funcionalidades Implementadas

### 1. **Botão "Atribuir Filtro à Lista de Leads"**
- Localização: Página `/admin/marketing` no componente MarketingPDF
- Funcionalidade: Captura filtros ativos do iframe e atribui a todos os leads de um grupo
- Uso: Útil para agendamentos que enviam emails baseados em filtros específicos

### 2. **Coluna de Filtros na Lista de Leads**
- Localização: Página `/admin/leads`
- Funcionalidade: Mostra os filtros associados a cada lead
- Visualização: Badges com os primeiros 3 filtros + contador se houver mais

### 3. **Correção da Listagem de Agendamentos**
- Problema: Agendamentos não apareciam na listagem
- Solução: Corrigida a busca de grupos de forma separada
- Resultado: Agendamentos agora aparecem corretamente

## Teste das Funcionalidades

### Teste 1: Agendamentos
1. Vá para `/admin/schedules`
2. Clique em "Novo Agendamento"
3. Crie um agendamento
4. Verifique se aparece na listagem

### Teste 2: Atribuir Filtros
1. Vá para `/admin/marketing`
2. Aplique filtros no iframe (cidade, bairros, etc.)
3. Clique em "Atribuir Filtro à Lista de Leads"
4. Selecione um grupo
5. Verifique se os filtros foram atribuídos

### Teste 3: Visualizar Filtros
1. Vá para `/admin/leads`
2. Verifique se a coluna "Filtros" mostra os dados corretamente

## Logs de Debug

Adicionei logs no console para ajudar no debug:
- `AdminCreateSchedule.tsx`: Logs do payload e resultado da inserção
- `AdminSchedules.tsx`: Logs da busca de agendamentos
- `MarketingPDF.tsx`: Logs da captura de filtros

Verifique o console do navegador para ver esses logs.
