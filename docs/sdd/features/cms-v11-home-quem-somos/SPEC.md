# SPEC — CMS v11: Home pública CMS-driven + início "Quem Somos"

**Data:** 2026-02-04  
**Status:** Em execução  
**Base canônica:** `cataldo_sdd_pack/CMS_ADMIN_SPEC.md`, `cataldo_sdd_pack/CMS_RASTREAMENTO_COMPLETO.md`, `cataldo_sdd_pack/ROADMAP_SPRINTS.md`

## Objetivo

1) Tornar a **Home pública** (rota `/`) realmente dirigida por conteúdo do CMS onde aplicável (hero + seções institucionais opcionais).  
2) Iniciar a página pública **Quem Somos** (`/quem-somos`) com conteúdo vindo do CMS.

## Escopo

### Incluído

- **Home (pública)**:
  - Consumir blocos do CMS para `home` (published).
  - Renderizar seções institucionais com base nos blocos existentes:
    - `hero_*`
    - `highlight_section_title`, `highlight_cards`
    - `how_it_works_*`
    - `about_section_*`
    - `final_cta_*`
  - Fallback seguro: se CMS falhar, manter conteúdo hardcoded atual (não quebrar página).

- **Quem Somos (pública)**:
  - Criar página React + rota pública `/quem-somos`.
  - Consumir blocos CMS (published) para slug `quem-somos` (inicialmente parcial).
  - Fallback seguro: se CMS falhar, mostrar conteúdo mínimo estático.

### Excluído

- Alterar layout/design global do site além do necessário para inserir as seções.
- Alterar qualquer coisa do domínio de imóveis/tabela `imoveis`.
- CRUD/fluxos admin (já existe).

## Requisitos (derivados do canônico)

- **NFR-ADM-002/010 (resiliência/fallback)**: falha do CMS não pode quebrar páginas públicas.
- **NFR-ADM-001 (segurança)**: público só lê `published` via RLS.

## Critérios de Aceite

### Home pública
- [ ] Se o CMS estiver OK, o hero usa `hero_title`, `hero_subtitle`, `hero_image`, `hero_cta_primary`, `hero_cta_secondary`.
- [ ] Se o CMS falhar, hero e página continuam funcionando com fallback.
- [ ] As seções `highlight_cards` e `how_it_works_steps` renderizam corretamente (cards/steps compostos).

### Quem Somos
- [ ] Rota `/quem-somos` existe e renderiza sem erros.
- [ ] Conteúdo é carregado do CMS quando `cms_pages.slug='quem-somos'` estiver published.
- [ ] Fallback seguro quando CMS indisponível.

