# DECISIONS.md
_Data: 2026-01-15_  
_Atualizado: 2026-01-15 (Sprint 0)_

## Decisões iniciais (Sprint 0)

### ✅ Estratégia para páginas regionais
- [x] **Rota dinâmica `/catalogo/:pageId`** — JÁ EXISTE (StaticCatalog.tsx)
- [ ] HTML estático gerado (opcional, conforme SPEC)
- **Decisão**: Implementar ambos — rota dinâmica como principal, HTML estático como alternativa para SEO

### ✅ Como "substituir filtros"
- [x] Navegação para slug quando região mapeada (via `/catalogo/:pageId`)
- [ ] Canônica apontando para slug + links internos (Sprint 2)
- **Decisão**: Usar rota `/catalogo/:pageId` para páginas regionais fixas

### ✅ Admin
- [x] Reutilizar auth existente (`useAuth`) — JÁ EXISTE
- [x] Rotas admin já existem (`/admin/*`)
- [ ] Criar módulo de gerenciamento de filtros no admin (Sprint 3)

### ✅ Banco de Dados
- [x] **Tabela `imoveis` confirmada** — 19.216 linhas (NÃO ALTERAR)
- [x] **Tabelas de filtros já existem**:
  - `filter_regions` (9 linhas)
  - `filter_cities` (453 linhas)
  - `filter_zones` (24 linhas)
  - `filter_neighborhoods` (3.716 linhas)
- [ ] Criar tabela `seo_pages` ou `static_pages` (Sprint 2)

### ✅ Sistema de Filtros
- [x] Hook `useFilterParams` já existe e funciona
- [x] Tabelas de filtros já existem no Supabase
- [ ] Refatorar para ler filtros do Supabase (Sprint 3)

### ⚠️ Arquivos Faltando
- [ ] `config/seo-pages.json` — criar no Sprint 2
- [ ] `scripts/manage-seo-pages.js` — criar no Sprint 2
- [ ] Scripts npm `seo:list` e `seo:generate` — criar no Sprint 2

### 📋 Próximas Decisões (Sprint 1+)
- [ ] Estratégia de `noindex, follow` durante migração
- [ ] Formato de canônicas (autorreferenciadas vs padrão)
- [ ] Estrutura da tabela `seo_pages`/`static_pages`
