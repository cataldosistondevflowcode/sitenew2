# SPEC — CMS v12: Paginas institucionais publicas (renderer generico)

**Data:** 2026-02-04  
**Status:** Em execucao  
**Base canônica:** `cataldo_sdd_pack/CMS_ADMIN_SPEC.md`, `cataldo_sdd_pack/ROADMAP_SPRINTS.md`

## Objetivo

Disponibilizar paginas institucionais publicas consumindo blocos publicados do CMS:
- `/assessoria`
- `/direito-imobiliario`
- `/casos-reais`
- `/blog`
- `/contato`

## Escopo

### Incluido
- Criar um renderer generico de pagina publica por `slug` (CMS).
- Criar rotas publicas para os slugs acima.
- Publicar as paginas correspondentes em `cms_pages` e criar blocos iniciais (via MCP).
- Fallback seguro: pagina nao quebra se CMS falhar ou estiver vazia.

### Excluido
- CRUD de posts de blog (fora do CMS de blocos por enquanto).
- Alteracoes na tabela `imoveis`.

## Critérios de Aceite
- [ ] Todas as rotas publicas acima existem e renderizam sem erro.
- [ ] Quando `cms_pages.slug` estiver `published`, os blocos aparecem na pagina.
- [ ] Sem CMS / sem blocos: exibe fallback minimo sem quebrar.

