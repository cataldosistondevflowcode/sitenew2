# Migrações para Leads e Agendamentos

## Novas Funcionalidades Implementadas

### 1. Gestão de Leads
- Página de administração de leads (`/admin/leads`)
- Visualização de todos os leads capturados
- Seleção múltipla de leads
- Criação de agendamentos a partir de leads selecionados

### 2. Agendamentos Unificados
- Página de agendamentos (`/admin/schedules`)
- Criação de agendamentos unificados (`/admin/schedules/create`)
- Suporte a email, WhatsApp ou ambos
- Configuração de frequência e horários

## Estrutura do Banco de Dados

### Tabelas Criadas/Modificadas

#### 1. `contact_leads` (Modificada)
- Adicionado campo `group_id` para associar leads a grupos

#### 2. `lead_groups` (Nova)
- Armazena grupos de leads
- Campos: id, name, description, created_at, updated_at, created_by, is_active

#### 3. `unified_schedules` (Nova)
- Agendamentos unificados para email e WhatsApp
- Campos: id, name, group_id, method, frequency, send_time, send_date, is_recurring, whatsapp_message, email_message, email_subject, status, next_send, last_sent, created_at, updated_at, created_by

#### 4. `schedule_properties` (Nova)
- Relacionamento entre agendamentos e imóveis
- Campos: id, schedule_id, property_id, created_at

#### 5. `schedule_leads` (Nova)
- Relacionamento entre agendamentos e leads específicos
- Campos: id, schedule_id, lead_id, created_at

## Como Aplicar as Migrações

### 1. Aplicar a Migração SQL
```bash
# No Supabase Dashboard ou via CLI
# Execute o arquivo: supabase/migrations/20241220000000_add_lead_groups_and_unified_schedules.sql
```

### 2. Atualizar os Tipos do TypeScript
Após aplicar a migração, gere os novos tipos:

```bash
# Se você tiver o Supabase CLI instalado
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts

# Ou copie manualmente os tipos das novas tabelas para o arquivo types.ts
```

### 3. Grupos Padrão Criados
A migração cria automaticamente os seguintes grupos:
- Compradores Premium
- Jovens Profissionais
- São Paulo
- Rio de Janeiro
- Investidores

## Funcionalidades Implementadas

### Página de Leads (`/admin/leads`)
- ✅ Lista todos os leads da tabela `contact_leads`
- ✅ Busca por nome, email ou telefone
- ✅ Seleção múltipla com checkbox
- ✅ Botão para criar agendamento com leads selecionados
- ✅ Navegação integrada com o sistema admin

### Página de Agendamentos (`/admin/schedules`)
- ✅ Lista agendamentos ativos
- ✅ Estado vazio com call-to-action
- ✅ Botão para criar novo agendamento
- ✅ Navegação integrada

### Página de Criação de Agendamento (`/admin/schedules/create`)
- ✅ Formulário completo para configuração
- ✅ Seleção de método (Email, WhatsApp, Ambos)
- ✅ Seleção de grupo
- ✅ Seleção de imóveis
- ✅ Configuração de frequência e horário
- ✅ Campo de conteúdo da mensagem
- ✅ Recebe leads selecionados da página de leads

## Próximos Passos

### 1. Implementar Persistência
- Conectar formulário de criação com a tabela `unified_schedules`
- Implementar busca real de agendamentos
- Adicionar funcionalidades de edição e exclusão

### 2. Sistema de Processamento
- Criar função para processar agendamentos
- Implementar envio real de emails e WhatsApp
- Sistema de logs de envio

### 3. Melhorias na Interface
- Adicionar filtros avançados na página de leads
- Implementar paginação
- Adicionar funcionalidades de edição de leads
- Sistema de tags e categorização

### 4. Integração com Sistema Existente
- Conectar com sistema de email existente
- Integrar com WhatsApp Business API
- Sistema de templates de mensagem

## Rotas Adicionadas

```typescript
// Novas rotas no App.tsx
<Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
<Route path="/admin/schedules" element={<AdminRoute><AdminSchedules /></AdminRoute>} />
<Route path="/admin/schedules/create" element={<AdminRoute><AdminCreateSchedule /></AdminRoute>} />
```

## Arquivos Criados/Modificados

### Criados:
- `src/pages/AdminLeads.tsx`
- `src/pages/AdminSchedules.tsx`
- `src/pages/AdminCreateSchedule.tsx`
- `supabase/migrations/20241220000000_add_lead_groups_and_unified_schedules.sql`

### Modificados:
- `src/pages/AdminMarketing.tsx` - Adicionadas novas seções
- `src/App.tsx` - Adicionadas novas rotas

## Observações Importantes

1. **Tabela `contact_leads`**: A estrutura atual é suficiente para as funcionalidades básicas. O campo `group_id` foi adicionado para futuras funcionalidades de agrupamento.

2. **Agendamentos Unificados**: O sistema permite criar agendamentos que podem enviar tanto email quanto WhatsApp, ou ambos, para o mesmo grupo de leads.

3. **Flexibilidade**: O sistema foi projetado para ser flexível, permitindo agendamentos baseados em grupos ou em leads específicos.

4. **Integração**: As novas funcionalidades se integram perfeitamente com o sistema existente, mantendo a consistência visual e de navegação.
