# PLAN — CMS v12: Paginas institucionais publicas

## Abordagem

- Criar `CmsPublicPage` (componente/pagina) que:
  - usa `useCmsPublishedBlocks(slug)`
  - renderiza os blocos em ordem com `CmsBlockRenderer`
  - inclui Header/Footer e SEO basico
  - faz fallback amigavel quando `loading/error` ou `0 blocos`

- Criar pages finas (1 por rota) que apenas chamam `CmsPublicPage` com:
  - `slug`
  - `title/description/canonicalUrl`

- Publicar slugs no Supabase e inserir blocos iniciais (hero + texto + CTA) via MCP.

