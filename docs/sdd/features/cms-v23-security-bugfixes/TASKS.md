# TASKS — Sprint CMS v23: Correções de Segurança e Bugs do Editor

**Data:** 2026-02-10  
**Status:** ✅ TODAS CONCLUÍDAS

---

## TASK-001: Habilitar RLS em tabelas CMS [CRÍTICO]
- **Tipo:** Migration SQL (Supabase)
- **FR:** FR-V23-001
- **Ação:** `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` em:
  - `cms_pages`
  - `cms_blocks`
  - `cms_assets`
  - `cms_audit_log`
  - `cms_versions`
- **Verificação:** 6/6 tabelas com `rls_enabled = true`, Security Advisor sem erros CMS
- **Status:** [x] Concluída

## TASK-002: Corrigir Undo/Redo [CRÍTICO]
- **Tipo:** Frontend (TypeScript)
- **FR:** FR-V23-002
- **Arquivo:** `src/pages/AdminCmsPageEdit.tsx`
- **Ação:** Substituir `reloadPage()` por `setBlocksLocal(previousBlocks/nextBlocks)`
- **Verificação:** Build passa, linter limpo
- **Status:** [x] Concluída

## TASK-003: Popular validationErrors [ALTO]
- **Tipo:** Frontend (TypeScript)
- **FR:** FR-V23-003
- **Arquivo:** `src/pages/AdminCmsPageEdit.tsx`
- **Ação:** `useEffect` que valida blocos e chama `setValidationErrors`
- **Verificação:** Build passa, linter limpo
- **Status:** [x] Concluída

## TASK-004: Error handling no deleteBlock [ALTO]
- **Tipo:** Frontend (TypeScript)
- **FR:** FR-V23-004
- **Arquivo:** `src/pages/AdminCmsPageEdit.tsx`
- **Ação:** Verificar `result.success` e toast de erro + reloadPage se falhar
- **Verificação:** Build passa, linter limpo
- **Status:** [x] Concluída

## TASK-005: Clipboard error handling [MÉDIO]
- **Tipo:** Frontend (TypeScript)
- **FR:** FR-V23-005
- **Arquivos:** `SharePreviewButton.tsx`, `AssetLibrary.tsx`
- **Ação:** try/catch com fallback para `document.execCommand('copy')`
- **Status:** [x] Concluída

## TASK-006: localStorage error handling [MÉDIO]
- **Tipo:** Frontend (TypeScript)
- **FR:** FR-V23-005
- **Arquivo:** `useSyncedBlockEditor.ts`
- **Ação:** try/catch no `getItem` e `setItem`
- **Status:** [x] Concluída

## TASK-007: Verificação pós-correção [OBRIGATÓRIO]
- **Tipo:** Verificação
- **Resultados:**
  - Checksum published: `6d40e606811b3161e3e0a4ff134511cc` ✅ inalterado
  - `npm run build`: ✅ sem erros
  - Lint: ✅ zero erros em todos os arquivos editados
  - Supabase Security Advisor: ✅ sem erros `policy_exists_rls_disabled` em tabelas CMS
- **Status:** [x] Concluída

---

## Sprint CMS v23.2 — Hotfix: Validação de Imagem com URLs Relativas

## TASK-008: Corrigir validação de URL de imagem para aceitar caminhos relativos [MÉDIO]
- **Tipo:** Frontend (TypeScript)
- **Decisão:** DEC-VAL-001
- **Arquivo:** `src/hooks/useCmsContent.ts`
- **Ação:** Na função `validateBlockContent`, case `image`, substituir `new URL(content.url)` por `isValidUrlOrPath(content.url)` que aceita caminhos relativos
- **Causa raiz:** Blocos `hero_image` e `about_section_image` populados com `/imagem.jpg` (relativo) — `new URL()` rejeitava como inválido
- **Identificado por:** Teste funcional via browser (Browser MCP) em 2026-02-10
- **Verificação:** Status bar do editor mostra 0 erros, build passa
- **Status:** [x] Concluída

## TASK-009: Documentação canônica da Sprint v23.2 [OBRIGATÓRIO]
- **Tipo:** Documentação
- **Ação:** Atualizar CHANGELOG.md, ROADMAP_SPRINTS.md, DECISIONS.md, TEST_PLAN.md
- **Status:** [x] Concluída
