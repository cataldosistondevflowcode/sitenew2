# TASKS: CMS v17 — Fechamento de Gaps Finais

## Metadata
- **Feature ID**: CMS-V17
- **SPEC**: [SPEC.md](./SPEC.md)
- **PLAN**: [PLAN.md](./PLAN.md)
- **Data**: 2026-02-05

## Legenda de Status
- ⬜ Pendente
- 🔄 Em progresso
- ✅ Concluída
- ⏸️ Bloqueada
- ❌ Cancelada

---

## Tasks

### Fase 1: Setup

#### TASK-001: Verificar dependências
- **Status**: ✅
- **Prioridade**: P0
- **Descrição**: Verificar se `react-helmet-async` está instalado
- **Critério de Done**: Pacote disponível ou instalado
- **Resultado**: Não instalado; usou-se `useEffect` direto no DOM como alternativa

---

### Fase 2: Implementação Simples

#### TASK-002: Adicionar meta noindex no preview
- **Status**: ✅
- **Prioridade**: P0
- **FR**: FR-V17-003
- **Arquivo**: `src/pages/CmsPreview.tsx`
- **Descrição**: Adicionar `<meta name="robots" content="noindex, nofollow">`
- **Critério de Done**: Meta tag visível no View Source do preview
- **Resultado**: Hook `useNoIndexMeta` implementado com cleanup automático

#### TASK-003: Implementar filtro por status
- **Status**: ✅
- **Prioridade**: P0
- **FR**: FR-V17-002
- **Arquivo**: `src/pages/AdminCmsPages.tsx`
- **Descrição**: Adicionar tabs/dropdown para filtrar páginas por status
- **Critério de Done**: Filtro funciona para all/draft/published
- **Resultado**: Tabs (Todas/Rascunhos/Publicadas) com contadores

---

### Fase 3: Busca e Modal

#### TASK-004: Criar ConfirmationModal
- **Status**: ✅
- **Prioridade**: P1
- **FR**: FR-V17-004
- **Arquivo**: `src/components/ConfirmationModal.tsx` (novo)
- **Descrição**: Componente reutilizável de modal de confirmação
- **Critério de Done**: Modal exibe título, descrição e botões
- **Resultado**: Componente criado com variant `destructive` opcional

#### TASK-005: Adicionar confirmação no rollback
- **Status**: ✅
- **Prioridade**: P1
- **FR**: FR-V17-004
- **Arquivo**: `src/components/admin/BlockVersionHistory.tsx`
- **Descrição**: Usar ConfirmationModal antes de reverter versão
- **Critério de Done**: Modal aparece ao clicar Reverter
- **Resultado**: Integrado com `ConfirmationModal` via state `confirmRevertId`

#### TASK-006: Implementar busca na biblioteca de mídia
- **Status**: ✅
- **Prioridade**: P1
- **FR**: FR-V17-005
- **Arquivo**: `src/components/admin/AssetLibrary.tsx`
- **Descrição**: Campo de busca com debounce para filtrar assets
- **Critério de Done**: Busca filtra em tempo real
- **Resultado**: Input com debounce 300ms, busca por filename/alt_text/title

---

### Fase 4: Sessão

#### TASK-007: Implementar expiração de sessão
- **Status**: ✅
- **Prioridade**: P1
- **FR**: FR-V17-001
- **Arquivo**: `src/hooks/useAuth.tsx`
- **Descrição**: Adicionar lógica de expiração após 24h de inatividade
- **Critério de Done**: Sessão expira e redireciona para login
- **Resultado**: 
  - Timestamp em localStorage (`admin_auth_timestamp`)
  - Atualização em eventos de atividade (debounced)
  - Verificação periódica (5 min)
  - Toast de notificação ao expirar

---

### Fase 5: Documentação e Testes

#### TASK-008: Atualizar CMS_ADMIN_GAPS_SPEC_VS_IMPL.md
- **Status**: ✅
- **Prioridade**: P2
- **Descrição**: Marcar todos os gaps como resolvidos
- **Critério de Done**: Documento reflete 100% de cobertura
- **Resultado**: Documento atualizado com 10/10 FRs e 4/4 NFRs

#### TASK-009: Atualizar ROADMAP_SPRINTS.md
- **Status**: ✅
- **Prioridade**: P2
- **Descrição**: Marcar Sprint v17 como concluída
- **Critério de Done**: Status atualizado
- **Resultado**: Sprint v17 documentada como CONCLUÍDA

#### TASK-010: Executar testes de regressão
- **Status**: ⬜
- **Prioridade**: P0
- **Descrição**: Verificar que funcionalidades existentes não quebraram
- **Critério de Done**: Fluxo de edição/preview/publicar funciona

---

## Resumo

| Fase | Total | Pendente | Em Progresso | Concluída |
|------|-------|----------|--------------|-----------|
| Setup | 1 | 0 | 0 | 1 |
| Implementação Simples | 2 | 0 | 0 | 2 |
| Busca e Modal | 3 | 0 | 0 | 3 |
| Sessão | 1 | 0 | 0 | 1 |
| Documentação | 3 | 1 | 0 | 2 |
| **Total** | **10** | **1** | **0** | **9** |

---

## Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-05 | 1.0 | Criação do documento |
| 2026-02-05 | 1.1 | Tasks 001-009 concluídas; Task 010 pendente (testes manuais) |
