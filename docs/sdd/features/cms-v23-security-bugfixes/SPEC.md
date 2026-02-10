# SPEC — Sprint CMS v23: Correções de Segurança e Bugs do Editor

**Data:** 2026-02-10  
**Prioridade:** Crítica (segurança) + Alta (bugs de funcionalidade)  
**Origem:** Auditoria completa do CMS Admin (testes via Supabase MCP + análise de código)  
**Dependências:** Sprint CMS v22 (concluída)

---

## Contexto

Em auditoria realizada em 2026-02-10, foram identificados problemas críticos de segurança e bugs funcionais no editor CMS. A auditoria cobriu:
- Verificação de RLS em todas as tabelas CMS via Supabase MCP
- Análise estática de código de todos os componentes do editor
- Verificação de integridade de dados (124 blocos, 15 páginas)
- Consulta ao Supabase Security Advisor

---

## Requisitos Funcionais

### FR-V23-001 — Habilitar RLS em tabelas CMS (CRÍTICO)

**Problema:** 5 de 6 tabelas CMS têm policies definidas mas RLS **não está habilitado**. As policies existem mas não são aplicadas.

| Tabela | RLS Habilitado? | Policies | Status |
|--------|----------------|----------|--------|
| `cms_pages` | **NÃO** | 3 | VULNERÁVEL |
| `cms_blocks` | **NÃO** | 3 | VULNERÁVEL |
| `cms_assets` | **NÃO** | 2 | VULNERÁVEL |
| `cms_audit_log` | **NÃO** | 2 | VULNERÁVEL |
| `cms_versions` | **NÃO** | 2 | VULNERÁVEL |
| `cms_preview_tokens` | Sim | 3 | OK |

**Ação:** Executar `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` nas 5 tabelas.

**Critério de aceite:**
- [ ] Todas as 6 tabelas CMS com `rls_enabled = true`
- [ ] Supabase Security Advisor sem erros de `policy_exists_rls_disabled` nas tabelas CMS
- [ ] Anon consegue ler apenas conteúdo published
- [ ] Authenticated com is_cms_admin() consegue ler/escrever

---

### FR-V23-002 — Corrigir Undo/Redo (CRÍTICO)

**Problema:** As funções `handleUndo` e `handleRedo` em `AdminCmsPageEdit.tsx` chamam `reloadPage()` (recarrega do banco) em vez de aplicar o estado retornado pelo stack de undo. O resultado é que Ctrl+Z não desfaz nada.

**Localização:** `src/pages/AdminCmsPageEdit.tsx`, linhas ~144-169

**Código atual (quebrado):**
```typescript
const handleUndo = useCallback(() => {
  const previousBlocks = undo();
  if (previousBlocks) {
    reloadPage(); // ❌ Recarrega do banco, ignora previousBlocks
  }
}, [undo, toast, reloadPage]);
```

**Ação:** Aplicar `previousBlocks` ao estado local (`setBlocks` ou equivalente) em vez de recarregar.

**Critério de aceite:**
- [ ] Ctrl+Z desfaz a última alteração no editor
- [ ] Ctrl+Shift+Z refaz a alteração desfeita
- [ ] Undo após save restaura o estado anterior ao save

---

### FR-V23-003 — Implementar validação de blocos no editor (ALTO)

**Problema:** A variável `validationErrors` em `AdminCmsPageEdit.tsx` é inicializada como `[]` e **nunca é populada**. A barra de status sempre mostra "0 erros".

**Localização:** `src/pages/AdminCmsPageEdit.tsx`, linha ~40 e ~528

**Ação:** Coletar erros de validação dos blocos (usando `validateBlockContent` existente) e popular `validationErrors` via `setValidationErrors`.

**Critério de aceite:**
- [ ] Status bar mostra número real de erros de validação
- [ ] Blocos com campos obrigatórios vazios mostram erro
- [ ] Erros atualizam em tempo real ao editar

---

### FR-V23-004 — Error handling no deleteBlock (ALTO)

**Problema:** `handleDeleteBlock` não verifica o retorno de `deleteBlock()`. Se falhar, o bloco desaparece da UI mas persiste no banco.

**Localização:** `src/pages/AdminCmsPageEdit.tsx`, linhas ~231-239

**Ação:** Verificar `result.success` e mostrar toast de erro se falhar.

**Critério de aceite:**
- [ ] Erro de delete mostra toast com mensagem
- [ ] Bloco permanece na lista se delete falhar
- [ ] Sucesso mostra toast de confirmação

---

### FR-V23-005 — Clipboard e localStorage error handling (MÉDIO)

**Problema:** `navigator.clipboard.writeText()` e `localStorage` são usados sem try/catch. Podem causar crash em navegação privada ou modo restrito.

**Localizações:**
- `src/components/admin/SharePreviewButton.tsx`
- `src/components/admin/AssetLibrary.tsx`
- `src/hooks/useSyncedBlockEditor.ts`

**Critério de aceite:**
- [ ] Clipboard operations wrapped em try/catch com fallback
- [ ] localStorage operations wrapped em try/catch
- [ ] Sem crash em modo de navegação privada

---

## Requisitos Não-Funcionais

### NFR-V23-001 — Sem regressão
- Nenhuma alteração em conteúdo publicado existente
- Checksum de published_content deve permanecer: `6d40e606811b3161e3e0a4ff134511cc`
- Build deve passar sem erros

### NFR-V23-002 — Segurança
- Após habilitar RLS, verificar que anon não consegue inserir/atualizar/deletar em tabelas CMS
- Verificar que admin autenticado mantém acesso total

---

## Baseline de Dados (pré-correção)

| Métrica | Valor |
|---------|-------|
| Total de páginas | 15 (14 published + 1 draft) |
| Total de blocos | 124 (108 published, 124 draft) |
| Checksum published | `6d40e606811b3161e3e0a4ff134511cc` |
| Audit log entries | 10 |
| Versões salvas | 1 |
