# PLAN — CMS v11: Home pública + Quem Somos

## Arquitetura (alto nível)

### Fonte de dados
- Leitura pública via `supabase` client (`src/integrations/supabase/client`).
- Consultas:
  - `cms_pages` por `slug` (RLS: anon só vê `published`).
  - `cms_blocks` por `page_id` (RLS: anon só vê blocos de páginas `published`).

### Estratégia de renderização

1) **Home (`/`)**
   - Trocar `HeroSection` por uma versão que aceite overrides (title/subtitle/background/ctas).
   - `HeroSectionWithCms` passa a carregar os blocos necessários e aplicar fallback.
   - Inserir seções institucionais (cards, passos, sobre, CTA) apenas se os blocos existirem e tiverem conteúdo.

2) **Quem Somos (`/quem-somos`)**
   - Criar `src/pages/QuemSomos.tsx`.
   - Reutilizar `CmsBlockRenderer` para renderizar blocos (text/richtext/image/list/cta/faq/banner).

### Decisões relevantes
- Para listas compostas na Home:
  - `highlight_cards` e `how_it_works_steps` são `block_type='list'`, mas o `content.items` é um **array de objetos**.
  - O `CmsBlockRenderer` detecta pelo `block_key` e renderiza como cards/steps.

## Riscos e mitigação
- **CMS indisponível / RLS bloqueando leitura**:
  - Mitigação: fallback estático (não quebra render).
- **Conteúdo incompleto**:
  - Mitigação: renderizar seções somente quando o bloco tiver conteúdo válido.

