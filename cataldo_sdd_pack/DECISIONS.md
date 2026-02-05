# DECISIONS.md
_Data: 2026-01-15_  
_Atualizado: 2026-02-05 (DEC-ADM-003)_

---

## DEC-ADM-003 — Slugs CMS Alinhados com URLs Públicas

**Data:** 2026-02-05  
**Status:** ✅ Implementada

### Contexto
Os slugs do CMS usavam nomes internos (`home`, `regional-copacabana`) que não correspondiam às URLs públicas (`/leilao-rj`, `/catalogo/copacabana`), causando confusão.

### Decisão
**Renomear slugs CMS para corresponder exatamente aos caminhos das URLs públicas.**

### Mapeamento Implementado
| ID | Slug Anterior | Slug Novo | URL Pública |
|----|---------------|-----------|-------------|
| 1 | `home` | `leilao-rj` | `/leilao-rj` |
| 10 | `regional-copacabana` | `catalogo-copacabana` | `/catalogo/copacabana` |
| - | (demais) | (sem mudança) | (já alinhados) |

### Arquivos Atualizados
1. `src/components/HeroSectionWithCms.tsx` — `useCmsPublishedBlocks('leilao-rj', ...)`
2. `src/components/HomeCmsMarketingSections.tsx` — `useCmsPublishedBlocks('leilao-rj', ...)`
3. `src/hooks/useRegionalCmsContent.ts` — prefixo `catalogo-` (antes: `regional-`)
4. `src/components/regional/RegionCmsContent.tsx` — comentário atualizado
5. `src/components/regional/RegionContentWithFallback.tsx` — comentário atualizado

### Rollback (se necessário)
Arquivo de rollback: `supabase/migrations/20260205_backup_cms_slugs_ROLLBACK.sql`

```sql
-- Reverter para estado anterior:
UPDATE cms_pages SET slug = 'home' WHERE id = 1;
UPDATE cms_pages SET slug = 'regional-copacabana' WHERE id = 10;
```

### Participantes
- Eduardo Sousa (dev)

---

## DEC-ADM-002 — CMS em Produção: Não Alterar Sem Confirmação ⭐ DECISÃO FIXA

**Data:** 2026-02-05  
**Status:** ✅ Aceita (regra do cliente)

### Contexto
O Admin CMS está **pronto para produção**. As páginas CMS já cadastradas (leilao-rj, quem-somos, assessoria, direito-imobiliario, casos-reais, blog, contato, catalogo-copacabana) possuem conteúdo validado e não devem ser alteradas sem autorização explícita.

### Decisão
**NENHUMA alteração definitiva no conteúdo CMS das páginas existentes pode ser feita sem perguntar ao cliente ANTES.**

### Mandatos Técnicos (obrigatórios)

1. **PROIBIDO** alterar `content_published` de blocos existentes sem confirmação
2. **PROIBIDO** deletar ou modificar páginas CMS existentes
3. **PERMITIDO** criar NOVAS páginas CMS (ex: regionais adicionais)
4. **PERMITIDO** criar NOVOS blocos em páginas existentes (com content_draft vazio)
5. **PERMITIDO** popular blocos que estejam com `content_published = {}` (vazios)
6. **OBRIGATÓRIO** perguntar antes de:
   - Alterar qualquer conteúdo já publicado
   - Reabilitar código que consome CMS (ex: HeroSectionWithCms)
   - Modificar estrutura de blocos existentes

### Páginas Protegidas (em produção)
| Slug | Status | Blocos | URL Pública |
|------|--------|--------|-------------|
| `leilao-rj` | published | 16 | `/leilao-rj` |
| `quem-somos` | published | 15 | `/quem-somos` |
| `assessoria` | published | 5 | `/assessoria` |
| `direito-imobiliario` | published | 4 | `/direito-imobiliario` |
| `casos-reais` | published | 4 | `/casos-reais` |
| `blog` | published | 4 | `/blog` |
| `contato` | published | 5 | `/contato` |
| `catalogo-copacabana` | published | 10 | `/catalogo/copacabana` |

### Consequências
- Evita regressões em produção
- Garante que cliente valide alterações
- Permite evolução incremental segura

### Participantes
- Cliente (decisor)
- Eduardo Sousa (dev)

---

## DEC-ADM-001 — Admin CMS próprio via Supabase ⭐ DECISÃO FIXA

**Data:** 2026-02-03  
**Status:** ✅ Aceita (decisão do cliente)

### Contexto
O cliente precisa de uma forma de editar conteúdo do site (textos, imagens, blocos, CTAs, FAQs, banners) sem depender de desenvolvedores. A necessidade é similar a um "WordPress" para gerenciar conteúdo do site institucional.

### Opções Consideradas

1. **Webflow CMS** — Já existe integração parcial no projeto
   - Prós: Já tem estrutura, cliente conhece
   - Contras: Token de API, dependência externa, limitações de customização, não é a preferência do cliente

2. **CMS Headless externo** (Strapi, Contentful, Sanity)
   - Prós: Ferramentas maduras, muitos recursos
   - Contras: Custo adicional, mais uma dependência, curva de aprendizado

3. **Admin próprio via Supabase** ✅ ESCOLHIDO
   - Prós: Já usa Supabase, centralização, controle total, sem custo adicional, independência do Webflow
   - Contras: Mais trabalho de desenvolvimento inicial, manutenção interna

### Decisão
**Implementar Admin próprio usando Supabase como backend do CMS.**

O portal admin será:
- Rotas `/admin/*` protegidas por autenticação
- Tabelas CMS separadas no Supabase (prefixo `cms_`)
- Sistema de draft/preview/publish
- Versionamento simples com rollback
- Audit log básico

### Justificativa
- **Preferência explícita do cliente** — não quer usar Webflow CMS
- **Centralização** — tudo no Supabase, sem fragmentar dados
- **Independência** — não depende de serviços externos para conteúdo
- **Controle** — pode evoluir conforme necessidade do projeto
- **Segurança** — RLS e policies controlados internamente

### Consequências

**Positivas:**
- Autonomia total sobre o CMS
- Sem custos de terceiros
- Integração nativa com estrutura existente
- Preview e publish controlados

**Negativas:**
- Mais código para manter
- Precisa implementar UI de admin do zero
- Responsabilidade de backup/recovery

### Mandatos Técnicos (obrigatórios)

1. **NÃO usar Webflow CMS** como fonte de verdade para conteúdo editável do site
2. **Criar tabelas CMS** no Supabase com prefixo `cms_`:
   - `cms_pages` — páginas editáveis
   - `cms_blocks` — blocos de conteúdo por página
   - `cms_assets` — biblioteca de mídia
   - `cms_versions` — histórico de versões
   - `cms_audit_log` — log de alterações
3. **Segurança obrigatória:**
   - Rotas `/admin/*` protegidas por auth
   - RLS: público lê apenas `status = 'published'`
   - RLS: admin lê draft e published
   - Somente admin pode criar/editar/publicar
4. **Proibição:** Não alterar schema/lógica da tabela `imoveis` — CMS é completamente separado

### Participantes
- Cliente (decisor)
- Eduardo Sousa (dev)

---

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
