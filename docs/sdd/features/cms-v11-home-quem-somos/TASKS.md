# TASKS — CMS v11: Home pública + Quem Somos

## Tarefas

### 1) Home pública CMS-driven
- [ ] Atualizar `HeroSection` para aceitar overrides (titulo/subtitulo/imagem/ctas).
- [ ] Atualizar `HeroSectionWithCms` para carregar blocos do CMS e repassar para `HeroSection`.
- [ ] Atualizar `Index.tsx` para usar `HeroSectionWithCms`.
- [ ] Inserir seções CMS (cards/como funciona/sobre/CTA) na `Index.tsx` com fallback seguro.

### 2) Página pública Quem Somos
- [ ] Criar `src/pages/QuemSomos.tsx` (layout simples + CMS).
- [ ] Adicionar rota `/quem-somos` no `App.tsx`.
- [ ] (Banco) Publicar `cms_pages.slug='quem-somos'` e criar blocos iniciais (via MCP).

### 3) Qualidade
- [ ] Lints sem erros nos arquivos alterados.
- [ ] `npm run build` passando.

