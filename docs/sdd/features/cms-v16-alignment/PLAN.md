# PLAN: CMS v16 — Alinhamento Final

## Metadata
- **Feature ID**: CMS-V16
- **SPEC**: [SPEC.md](./SPEC.md)
- **Data**: 2026-02-05

---

## 1. Visão Geral

Esta sprint é focada em documentação e validação, sem alterações de código.

**Fluxo de trabalho:**
```
1. Analisar CMS_ADMIN_SPEC.md
         ↓
2. Verificar implementação (código + DB)
         ↓
3. Criar documento de gaps
         ↓
4. Atualizar critérios de aceite
         ↓
5. Executar TEST_PLAN.md
         ↓
6. Documentar resultados
```

---

## 2. Análise de FRs

### FRs a analisar:

| FR | Descrição | Verificar |
|----|-----------|-----------|
| FR-ADM-001 | Autenticação de Admin | Login, role check, sessão |
| FR-ADM-002 | Proteção de Rotas | Redirect, 403, cache headers |
| FR-ADM-003 | Listar Páginas | Lista, status, data, filtro |
| FR-ADM-004 | Editar Blocos | Tipos, editores, validação |
| FR-ADM-005 | Salvar Draft | Persistência, não público |
| FR-ADM-006 | Preview | Rota, token, indicador |
| FR-ADM-007 | Publicar | Atômico, versão, audit |
| FR-ADM-008 | Histórico/Rollback | Versões, reverter, publicar |
| FR-ADM-009 | Biblioteca Mídia | Upload, galeria, seletor |
| FR-ADM-010 | Audit Log | Registro, append-only, UI |

### NFRs a analisar:

| NFR | Descrição | Verificar |
|-----|-----------|-----------|
| NFR-ADM-001 | Segurança | RLS, tokens, headers |
| NFR-ADM-002 | Confiabilidade | Fallbacks, consistência |
| NFR-ADM-003 | Usabilidade | Feedback, confirmações |
| NFR-ADM-004 | Integridade | Validação, versionamento |

---

## 3. Arquivos a Analisar

### Código fonte:
- `src/pages/admin/` — Rotas admin
- `src/components/admin/cms/` — Componentes CMS
- `src/hooks/` — Hooks do CMS (useCmsContent, useCmsVersions, etc.)

### Banco de dados:
- Tabelas: `cms_pages`, `cms_blocks`, `cms_assets`, `cms_versions`, `cms_audit_log`, `cms_preview_tokens`, `admin_users`
- Policies RLS
- Funções RPC

### Documentação:
- `CMS_ADMIN_SPEC.md`
- `ROADMAP_SPRINTS.md`
- `TEST_PLAN.md`

---

## 4. Metodologia de Validação

Para cada FR:
1. Ler critérios de aceite na SPEC
2. Verificar implementação no código
3. Testar manualmente (se aplicável)
4. Documentar status: ✅ Implementado / ⚠️ Parcial / ❌ Não implementado

---

## 5. Entregáveis

1. **`CMS_ADMIN_GAPS_SPEC_VS_IMPL.md`**
   - Tabela de status de cada FR
   - Lista de gaps identificados
   - Recomendações (se houver)

2. **`CMS_ADMIN_SPEC.md` atualizada**
   - Critérios de aceite marcados [x]
   - Data de atualização

3. **`TEST_PLAN.md` executado**
   - Seção 9: Admin CMS
   - Seção 10: Regressão

---

## Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-05 | 1.0 | Criação do documento |
