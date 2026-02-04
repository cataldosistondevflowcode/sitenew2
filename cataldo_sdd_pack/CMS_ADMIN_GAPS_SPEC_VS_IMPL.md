# CMS Admin — Lacunas entre Spec/SDD e Implementação

_Data: 2026-02-04_  
_Objetivo: Listar o que foi feito fora dos docs ou que diverge dos documentos canônicos (CMS_ADMIN_SPEC, ROADMAP, SDD_README, 55-admin-cms.mdc)._

---

## 1. Implementado mas NÃO documentado (ou em doc diferente)

| Item | Onde está no código | Onde deveria estar nos docs |
|------|---------------------|-----------------------------|
| **Tabela `cms_preview_tokens`** | `usePreviewToken.ts` (insert/select/delete); usada por `SharePreviewButton` | CMS_ADMIN_SPEC §4 (Modelo de Dados) não lista; SDD_README e 55-admin-cms listam só 5 tabelas; não há migration no repo |
| **Token de preview com expiração** | Hook `usePreviewToken`, componente `SharePreviewButton`, `CmsPreview.tsx` aceita `?token=` | FR-ADM-006 menciona "rota segura /preview/[slug]?token=xxx"; não há schema da tabela no spec |
| **Componentes Sprint v8** | `LivePreview`, `BlockStatusIndicator`, `ValidationFeedback`, `useKeyboardShortcuts` | CMS_ADMIN_SPEC §5.3 (Componentes de UI) só lista editores + AssetLibrary/Uploader/Picker; não cita esses 4 |
| **Histórico/Rollback (Sprint v4)** | `BlockVersionHistory`, `useCmsVersions`, RPCs `publish_block_atomic` e `revert_block_to_version` | RPCs não estão no spec §4; componente/hook não estão em §5.3 |
| **Rota real vs spec** | Rotas usadas: `/admin/cms`, `/admin/cms/pages/:slug/edit`, `/admin/cms/assets`, `/admin/cms/audit-log` | CMS_ADMIN_SPEC §5.1 diz `/admin/pages`, `/admin/pages/[slug]/edit`, `/admin/assets`, `/admin/audit-log` (sem prefixo `cms`) |
| **Nome do componente de seleção** | `AssetSelector` (uso em ImageBlockEditor) | CMS_ADMIN_SPEC §5.3 diz `AssetPicker` |
| **Migration RPCs** | `supabase/migrations/20260203100000_cms_publish_atomic_and_revert.sql` | Spec não descreve funções RPC; 55-admin-cms não lista RPCs |

---

## 2. Nos docs mas NÃO implementado (ou parcial)

| Item | Onde está nos docs | Estado no código |
|------|--------------------|-------------------|
| **Tipo de bloco `banner`** | CMS_ADMIN_SPEC §4.2 (CHECK inclui 'banner'); escopo §1.1 menciona "banners" | `BlockEditorFactory` não tem case `banner` → cai no default "Tipo de bloco não suportado"; BlockStatusIndicator/BlockEditorHeader têm label "Banner" |
| **Filtrar por status na lista de páginas** | FR-ADM-003: "Permitir filtrar por status" | AdminCmsPages não tem filtro por status (draft/published) |
| **Critérios de aceite (FR/AC)** | Todos os FR-ADM-001 a FR-ADM-010 e AC-ADM-001 a AC-ADM-018 com [ ] | Nunca atualizados para [x] quando implementado |

---

## 3. Resumo de ações recomendadas para alinhar docs ↔ implementação

1. **CMS_ADMIN_SPEC.md**  
   - Atualizar §5.1 (Rotas) para as rotas reais: `/admin/cms`, `/admin/cms/pages/[slug]/edit`, `/admin/cms/assets`, `/admin/cms/audit-log`.  
   - Em §5.3: acrescentar `LivePreview`, `BlockStatusIndicator`, `ValidationFeedback`, `SharePreviewButton`, `BlockVersionHistory`; trocar `AssetPicker` por `AssetSelector` (ou registrar ambos).  
   - Adicionar §4 (ou subseção) para tabela `cms_preview_tokens` (schema + propósito) e menção às RPCs `publish_block_atomic` e `revert_block_to_version`.  
   - Marcar [x] nos FR e AC que já estão atendidos; deixar [ ] onde ainda não (ex.: filtrar por status, editor `banner`).

2. **SDD_README.md / 55-admin-cms.mdc**  
   - Incluir `cms_preview_tokens` na lista de tabelas CMS (e breve descrição: tokens de preview temporários).

3. **Banner**  
   - Ou (a) adicionar no spec que o tipo `banner` está reservado/sem editor por enquanto, ou (b) implementar `BannerBlockEditor` e registrar no spec.

4. **Migration `cms_preview_tokens`**  
   - Se a tabela foi criada fora do repo, criar migration no repo (idempotente) e documentar no spec; senão, apenas documentar no spec que existe e qual o propósito.

---

_Este arquivo pode ser removido ou incorporado ao CMS_ADMIN_SPEC/CHANGELOG após os ajustes._
