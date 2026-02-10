# PLAN — Sprint CMS v23: Correções de Segurança e Bugs do Editor

**Data:** 2026-02-10

---

## Ordem de Execução

### Fase 1: Segurança (banco de dados)
1. Habilitar RLS nas 5 tabelas CMS via migration
2. Verificar que policies existentes continuam funcionando
3. Testar acesso anon vs authenticated

### Fase 2: Bug fixes críticos (frontend)
4. Corrigir Undo/Redo em `AdminCmsPageEdit.tsx`
5. Implementar validação de blocos e popular `validationErrors`
6. Corrigir error handling no `deleteBlock`

### Fase 3: Melhorias de robustez
7. Adicionar try/catch no clipboard (SharePreviewButton, AssetLibrary)
8. Adicionar try/catch no localStorage (useSyncedBlockEditor)

### Fase 4: Verificação
9. Verificar checksum de conteúdo publicado (sem regressão)
10. `npm run build` sem erros

---

## Arquivos a Modificar

| Arquivo | Fase | Tipo de Mudança |
|---------|------|-----------------|
| Migration SQL (nova) | 1 | Habilitar RLS em 5 tabelas |
| `src/pages/AdminCmsPageEdit.tsx` | 2 | Fix undo/redo + validação + delete |
| `src/components/admin/SharePreviewButton.tsx` | 3 | try/catch clipboard |
| `src/components/admin/AssetLibrary.tsx` | 3 | try/catch clipboard |
| `src/hooks/useSyncedBlockEditor.ts` | 3 | try/catch localStorage |

---

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Habilitar RLS pode bloquear queries existentes | Policies já existem e estão corretas |
| Fix de undo/redo pode causar state inconsistente | Testar com múltiplos undo/redo sequenciais |
| Validação pode bloquear salvamento desnecessariamente | Validação é apenas indicativa na status bar |
