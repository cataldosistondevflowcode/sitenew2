# SPEC — CMS v13: Home 100% (campos) + qualidade de listas compostas

**Data:** 2026-02-04  
**Status:** Em execucao  
**Base canônica:** `cataldo_sdd_pack/CMS_RASTREAMENTO_COMPLETO.md`, `cataldo_sdd_pack/CMS_ADMIN_SPEC.md`

## Objetivo

1) Fechar **100% dos 34 campos da Home** usando blocos compostos (cards/steps/ctas), mantendo UX do Admin simples.  
2) Melhorar qualidade/seguranca: validação de listas compostas (cards/steps) no Admin antes de salvar/publicar.

## Escopo

### Incluido
- `CardListEditor`:
  - Suportar imagem por card (URL manual + seleção via `AssetSelector`)
  - Campos: `image_url`, `image_alt`
- `CmsBlockRenderer`:
  - Renderizar imagem do card quando existir
- Validação:
  - Cards: `title`/`description` obrigatórios; `image_url`/`link` validos quando presentes
  - Steps: `number`, `title`, `description` obrigatórios
- Atualizar documento canônico de rastreamento para refletir cobertura real.

### Excluido
- Mudanças de schema (DDL) no Supabase.
- Refatoração de layout do site publico alem do necessario.

## Critérios de Aceite
- [ ] Admin consegue escolher imagem da biblioteca por card (cards de destaque / valores).
- [ ] Cards com imagem aparecem no preview e no site publico.
- [ ] Publish bloqueado se cards/steps estiverem invalidos.
- [ ] `npm run build` passa.

