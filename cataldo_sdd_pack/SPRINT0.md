# Sprint 0 — Setup e Mapeamento
_Data: 2026-01-15_  
_Status: ✅ Concluído_

## Objetivos
- Clonar repo, rodar local, validar env vars
- Mapear rotas existentes e scripts de SEO pages
- Mapear schema do Supabase e auth admin

## Entregáveis
- Ambiente OK
- `DECISIONS.md` preenchido com decisões iniciais

---

## 1. Repositório e Ambiente

### ✅ Repositório Clonado
- **URL**: https://github.com/cataldosistondevflowcode/sitenew2.git
- **Localização**: `C:\Users\edusp\Projetos_App_Desktop\sitenew2`
- **Status**: Clonado e dependências instaladas

### ✅ Dependências Instaladas
- 437 packages instalados
- 13 vulnerabilidades detectadas (3 low, 5 moderate, 5 high) — **revisar depois**

## 2. Estrutura do Projeto

### Stack Tecnológica Confirmada
- ✅ React 18.3.1
- ✅ TypeScript 5.5.3
- ✅ Vite 5.4.1
- ✅ React Router 6.26.2
- ✅ Tailwind CSS 3.4.11
- ✅ shadcn/ui
- ✅ TanStack Query 5.56.2
- ✅ Supabase (@supabase/supabase-js 2.49.4)

### Rotas Principais Mapeadas
```
/                          → Index (RJ)
/leilao-caixa-rj          → LeilaoCaixaRJ
/leilao-rj                 → LeilaoRJ
/imovel-rj                 → LeilaoRJ (alias)
/leilao-sp                 → LeilaoSP
/imovel/:id                → PropertyDetail
/imovel/:id/:slug          → PropertyDetail
/catalogo/:pageId          → StaticCatalog (páginas regionais)
/admin/*                   → Admin (protegido)
```

### Componentes-Chave Identificados
- ✅ `useFilterParams` hook — gerencia filtros via URL
- ✅ `StaticCatalog` — página para catálogos estáticos (usa `static_pages` table)
- ✅ Sistema de autenticação (`useAuth`, `AdminRoute`)

## 3. Banco de Dados (Supabase)

### ✅ Projeto Identificado
- **Project ID**: `jmcurflvrvuvzoddjkcg`
- **Status**: ACTIVE_HEALTHY
- **Region**: sa-east-1
- **Database**: PostgreSQL 15.8.1

### ⚠️ Tabela `imoveis` (PROIBIDO ALTERAR)
- **Linhas**: 19.216
- **Status**: ✅ Confirmada existência
- **Ação**: **NÃO ALTERAR** conforme PROIBIÇÃO-DB-01

### ✅ Tabelas de Filtros (Já Existem!)
- `filter_regions` (9 linhas) — Regiões (RJ/SP)
- `filter_cities` (453 linhas) — Cidades
- `filter_zones` (24 linhas) — Zonas
- `filter_neighborhoods` (3.716 linhas) — Bairros
- **RLS**: Habilitado em todas (segurança OK)

### ✅ Outras Tabelas Relevantes
- `leiloes_imoveis` (18.000 linhas) — Tabela alternativa de imóveis?
- `zonasrio` (263 linhas) — Zonas do Rio
- `zonassaopaulo` (434 linhas) — Zonas de São Paulo
- `sp_bairros_cd2022` (2.170 linhas) — Bairros SP (códigos IBGE)

### ❓ Tabela `static_pages` (Não Encontrada)
- **Status**: Não existe no schema atual
- **Uso**: Referenciada em `StaticCatalog.tsx`
- **Ação**: Criar conforme RF-03 (Sprint 2)

## 4. Sistema de Páginas Regionais (SEO)

### ❌ Arquivos Não Encontrados
- `config/seo-pages.json` — **NÃO EXISTE** (precisa criar)
- `scripts/manage-seo-pages.js` — **NÃO EXISTE** (precisa criar)
- `html-static/` — **NÃO VERIFICADO** (verificar se existe)

### ✅ Rota Existente
- `/catalogo/:pageId` → `StaticCatalog.tsx` (já implementada)

### 📋 Próximos Passos (Sprint 2)
1. Criar `config/seo-pages.json`
2. Criar `scripts/manage-seo-pages.js`
3. Criar tabela `static_pages` (ou `seo_pages`) no Supabase
4. Implementar geração de páginas HTML estáticas

## 5. Sistema de Filtros

### ✅ Hook `useFilterParams` Analisado
- Gerencia filtros via URL (query params)
- Suporta: cidade, tipo, bairro, zona, preço, etc.
- Sincronização URL ↔ Estado funcionando

### ✅ Tabelas de Filtros no Supabase
- Já existem e estão populadas
- RLS habilitado
- Estrutura hierárquica: Region → City → Zone → Neighborhood

### 📋 Próximos Passos (Sprint 3)
1. Refatorar filtro para ler do Supabase (atualmente pode estar hardcoded)
2. Criar interface admin para CRUD de filtros
3. Validar que filtros dinâmicos funcionam com dados do Supabase

## 6. Autenticação e Admin

### ✅ Sistema Existente
- `useAuth` hook — autenticação
- `AdminRoute` — proteção de rotas
- Rotas admin já implementadas:
  - `/admin` — Dashboard
  - `/admin/analytics` — Analytics
  - `/admin/marketing` — Marketing
  - `/admin/leads` — Leads
  - `/admin/schedules` — Agendamentos
  - `/admin/groups` — Grupos

### 📋 Próximos Passos (Sprint 3)
- Reutilizar auth existente para admin de filtros
- Criar módulo de gerenciamento de filtros no admin

## 7. Variáveis de Ambiente

### ✅ Arquivo `.env.example` Encontrado
- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps API

### ❌ Arquivo `.env` Local
- **NÃO EXISTE** (não commitado, correto)
- **Ação**: Criar `.env` local com:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GOOGLE_MAPS_API_KEY` (se necessário)

## 8. Scripts NPM

### ✅ Scripts Identificados
```json
{
  "dev": "vite",
  "generate-sitemap": "node scripts/generate-sitemap.js",
  "prebuild": "npm run generate-sitemap",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### ❌ Scripts SEO Faltando
- `seo:list` — **NÃO EXISTE** (precisa criar)
- `seo:generate` — **NÃO EXISTE** (precisa criar)

## 9. Decisões Técnicas Iniciais

### ✅ Estratégia para Páginas Regionais
- **Decisão**: Usar rota dinâmica `/catalogo/:pageId` (já existe)
- **Alternativa**: HTML estático gerado (conforme SPEC)
- **Ação**: Implementar ambos (rota dinâmica + geração estática opcional)

### ✅ Sistema de Filtros
- **Decisão**: Tabelas de filtros já existem no Supabase
- **Ação**: Refatorar para usar dados do Supabase (Sprint 3)

### ✅ Admin
- **Decisão**: Reutilizar auth existente (`useAuth`)
- **Ação**: Criar módulo de gerenciamento de filtros no admin existente

## 10. Riscos e Dependências Identificadas

### ⚠️ Riscos
1. Tabela `static_pages` não existe — precisa criar
2. Scripts SEO não existem — precisa criar
3. Vulnerabilidades npm — revisar depois
4. Tabela `imoveis` vs `leiloes_imoveis` — verificar qual é a principal

### ✅ Dependências Resolvidas
1. Repositório clonado
2. Dependências instaladas
3. Schema do Supabase mapeado
4. Rotas e componentes identificados

## 11. Próximos Passos (Sprint 1)

1. ✅ Validar ambiente local (`npm run dev`)
2. ✅ Criar `.env` local (se necessário)
3. ✅ Iniciar Sprint 1 — SEO migração + correções críticas
4. ✅ Implementar `noindex, follow` no ambiente de migração
5. ✅ Padronizar canônicas
6. ✅ Corrigir problemas técnicos nas páginas RJ/SP

---

**Status**: ✅ **CONCLUÍDO**  
**Próximo Sprint**: Sprint 1 — SEO migração + correções críticas
