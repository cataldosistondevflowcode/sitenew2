# Diagnóstico SEO: Páginas Regionais sem JavaScript

**Data:** 29/01/2026  
**Solicitante:** LiveSEO (Augusto Xavier)  
**Referência:** [Tarefa LiveSEO #205270](https://app.liveseo.com.br/projeto/CB742/task/12336/205270/preview?key=RE2Go6ZXGj55Q79q)

---

## 1. Resumo Executivo

### Stack do Projeto
| Tecnologia | Versão | Observação |
|------------|--------|------------|
| **Framework** | Vite + React (SPA) | Não é Next.js/SSR nativo |
| **Roteamento** | React Router DOM 6.x | Client-side routing |
| **Deploy** | Vercel | Rewrites configurados |
| **Banco** | Supabase | Dados de imóveis e SEO pages |

### Problema Central
O site é uma **Single Page Application (SPA)** pura. Quando o JavaScript está desabilitado:
1. O `index.html` é servido para todas as rotas
2. O React não executa, então nenhum componente é renderizado
3. Apenas o conteúdo dentro de `<noscript>` é visível
4. **Resultado:** Todas as páginas regionais ficam idênticas para crawlers sem JS

---

## 2. Mapeamento da Arquitetura Atual

### 2.1 Rotas das Páginas Regionais

```
/catalogo/:pageId  →  src/pages/StaticCatalog.tsx
```

**Exemplos de URLs:**
- `/catalogo/copacabana-rj`
- `/catalogo/ipanema-rj`
- `/catalogo/jardins-sp`

### 2.2 Fluxo de Renderização (com JS)

```
1. Usuário acessa /catalogo/copacabana-rj
2. Vercel serve index.html (SPA)
3. React Router identifica a rota
4. StaticCatalog.tsx é montado
5. useEffect busca dados da seo_pages no Supabase
6. Componentes são renderizados com dados únicos da região
```

### 2.3 Fluxo de Renderização (sem JS)

```
1. Crawler acessa /catalogo/copacabana-rj
2. Vercel serve index.html (SPA)
3. JavaScript não executa
4. Apenas conteúdo de <noscript> é visível
5. Conteúdo é GENÉRICO (igual para todas as páginas)
```

---

## 3. Componentes que Dependem de JavaScript

### 3.1 Página Principal: `StaticCatalog.tsx`

| Linha | Dependência | Impacto |
|-------|-------------|---------|
| 280-284 | `useEffect` para buscar `seo_pages` | Dados da região não carregam |
| 287-291 | `useEffect` para aplicar filtros | Filtros não funcionam |
| 376-395 | `useEffect` para buscar imóveis | Lista de imóveis vazia |
| 1139-1157 | `<SEO>` e `<NoScriptFallback>` | NoScript funciona, mas está dentro do React |

**Arquivo:** `src/pages/StaticCatalog.tsx`

### 3.2 Componentes Críticos (100% JS-dependentes)

| Componente | Arquivo | O que some sem JS |
|------------|---------|-------------------|
| `Header` | `src/components/Header.tsx` | Navegação completa |
| `Footer` | `src/components/Footer.tsx` | Rodapé institucional |
| `SocialBar` | `src/components/SocialBar.tsx` | Barra de redes sociais |
| `PropertyCard` | `src/components/PropertyCard.tsx` | Cards de imóveis |
| `TestimonialsSection` | `src/components/testimonials/` | Depoimentos |
| `RegionContentSection` | `src/components/regional/RegionContentSection.tsx` | Conteúdo da região |
| `SuccessCasesSection` | `src/components/regional/SuccessCasesSection.tsx` | Casos de sucesso |
| `SupportCTA` | `src/components/regional/SupportCTA.tsx` | CTA de apoio |

### 3.3 Componente de Fallback Existente

**Arquivo:** `src/components/NoScriptFallback.tsx`

Este componente **já existe** e renderiza conteúdo único por região dentro de `<noscript>`. Porém:
- Está dentro do React (só renderiza se React executar)
- O `<noscript>` só é útil se o HTML for servido com o conteúdo já presente
- **Problema:** O React precisa executar para inserir o `<noscript>` no DOM

---

## 4. Solução Parcial Já Implementada

### 4.1 Páginas HTML Estáticas

O projeto **já possui** 25 arquivos HTML estáticos em `public/catalogo/`:

```
public/catalogo/
├── copacabana-rj.html
├── ipanema-rj.html
├── leblon-rj.html
├── barra-tijuca-rj.html
├── botafogo-rj.html
├── flamengo-rj.html
├── laranjeiras-rj.html
├── tijuca-rj.html
├── recreio-rj.html
├── zona-sul-rj.html
├── zona-norte-rj.html
├── zona-oeste-rj.html
├── niteroi-rj.html
├── centro-rj.html
├── meier-rj.html
├── jardins-sp.html
├── pinheiros-sp.html
├── moema-sp.html
├── itaim-bibi-sp.html
├── vila-mariana-sp.html
├── zona-sul-sp.html
├── zona-oeste-sp.html
├── zona-norte-sp.html
├── zona-leste-sp.html
└── centro-sp.html
```

**Script de geração:** `scripts/generate-static-pages.cjs`

### 4.2 Configuração do Vercel (vercel.json)

```json
{
  "rewrites": [
    {
      "source": "/((?!catalogo/.*\\.html$).*)",
      "destination": "/index.html"
    }
  ]
}
```

**Problema:** Esta configuração serve `index.html` para `/catalogo/copacabana-rj`, mas serve o HTML estático apenas para `/catalogo/copacabana-rj.html` (com extensão).

### 4.3 Gap Identificado

| URL | O que é servido | Esperado pela LiveSEO |
|-----|-----------------|----------------------|
| `/catalogo/copacabana-rj` | `index.html` (SPA) | HTML estático com conteúdo único |
| `/catalogo/copacabana-rj.html` | `copacabana-rj.html` | ✅ Funciona |

**O Google acessa `/catalogo/copacabana-rj` (sem .html) e recebe a SPA genérica.**

---

## 5. Causa Raiz

### Diagnóstico Final

1. **Arquitetura SPA:** O site é uma SPA React/Vite sem SSR/SSG nativo
2. **Rewrites incorretos:** O Vercel serve a SPA para URLs sem `.html`
3. **NoScript insuficiente:** O `<noscript>` no `index.html` é genérico
4. **Canonical inconsistente:** Links canônicos apontam para URLs sem `.html`

### O que o Google vê em `/catalogo/copacabana-rj`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <title>Imóveis em Leilão RJ | Cataldo Siston</title>
  <!-- Meta tags genéricas -->
</head>
<body>
  <div id="root"></div>
  <noscript>
    <!-- Conteúdo genérico, igual para todas as páginas -->
  </noscript>
</body>
</html>
```

---

## 6. O que Some ou Vira Genérico (JS Off)

### Elementos Críticos (conforme LiveSEO)

| Elemento | Status sem JS | Impacto SEO |
|----------|---------------|-------------|
| **Header/Nav** | ❌ Não renderiza | Links internos perdidos |
| **Banner/Hero com textos** | ❌ Genérico | H1 e descrição únicos perdidos |
| **Seção "Sobre a Região"** | ❌ Não renderiza | Conteúdo único perdido |
| **Seção de Infos Detalhadas** | ❌ Não renderiza | Bairros, atrações, infraestrutura perdidos |
| **Seção de Casos/Depoimentos** | ❌ Não renderiza | Prova social perdida |
| **Footer** | ❌ Não renderiza | Links institucionais perdidos |
| **Lista de Imóveis** | ❌ Não renderiza | Conteúdo principal perdido |

### Elementos que Funcionam (parcialmente)

| Elemento | Status | Observação |
|----------|--------|------------|
| `<noscript>` no index.html | ✅ Visível | Mas é genérico, não específico por região |
| Meta tags no `<head>` | ✅ Presentes | Mas são genéricas (da home) |

---

## 7. Gap de Páginas Regionais (Seed LiveSEO vs Implementação)

### 7.1 Fonte de Dados da LiveSEO

**Arquivo:** `cataldo_sdd_pack/docs-pré-projeto/SEO/regional_pages_seo_seed.json`

Este arquivo contém **39 regiões** com meta titles e descriptions otimizados para CTR pela LiveSEO.

### 7.2 Comparação: Rio de Janeiro (22 regiões no seed)

| Região | Slug LiveSEO | Status | Observação |
|--------|--------------|--------|------------|
| Copacabana | `copacabana-rj` | ✅ Implementado | OK |
| Barra da Tijuca | `barra-da-tijuca-rj` | ⚠️ Slug diferente | Implementado como `barra-tijuca-rj` |
| Tijuca | `tijuca-rj` | ✅ Implementado | OK |
| Botafogo | `botafogo-rj` | ✅ Implementado | OK |
| Flamengo | `flamengo-rj` | ✅ Implementado | OK |
| Recreio dos Bandeirantes | `recreio-dos-bandeirantes-rj` | ⚠️ Slug diferente | Implementado como `recreio-rj` |
| Ipanema | `ipanema-rj` | ✅ Implementado | OK |
| Leblon | `leblon-rj` | ✅ Implementado | OK |
| Laranjeiras | `laranjeiras-rj` | ✅ Implementado | OK |
| **Lagoa** | `lagoa-rj` | ❌ Não implementado | **CRIAR** |
| **Icaraí** | `icarai-rj` | ❌ Não implementado | **CRIAR** |
| **Jardim Botânico** | `jardim-botanico-rj` | ❌ Não implementado | **CRIAR** |
| Niterói | `niteroi-rj` | ✅ Implementado | OK |
| **Região dos Lagos** | `regiao-dos-lagos-rj` | ❌ Não implementado | **CRIAR** |
| **Região Serrana** | `regiao-serrana-rj` | ❌ Não implementado | **CRIAR** |
| **Angra dos Reis** | `angra-dos-reis-rj` | ❌ Não implementado | **CRIAR** |
| Zona Sul | `zona-sul-rj` | ✅ Implementado | OK |
| Zona Norte | `zona-norte-rj` | ✅ Implementado | OK |
| **Jacarepaguá** | `jacarepagua-rj` | ❌ Não implementado | **CRIAR** |
| Centro | `centro-rj` | ✅ Implementado | OK |

### 7.3 Comparação: São Paulo (17 regiões no seed)

| Região | Slug LiveSEO | Status | Observação |
|--------|--------------|--------|------------|
| **Tatuapé** | `tatuape-sp` | ❌ Não implementado | **CRIAR** |
| Vila Mariana | `vila-mariana-sp` | ✅ Implementado | OK |
| Pinheiros | `pinheiros-sp` | ✅ Implementado | OK |
| **Mooca** | `mooca-sp` | ❌ Não implementado | **CRIAR** |
| **Perdizes** | `perdizes-sp` | ❌ Não implementado | **CRIAR** |
| Itaim Bibi | `itaim-bibi-sp` | ✅ Implementado | OK |
| **Riviera de São Lourenço** | `riviera-de-sao-lourenco-sp` | ❌ Não implementado | **CRIAR** |
| Moema | `moema-sp` | ✅ Implementado | OK |
| **Santana** | `santana-sp` | ❌ Não implementado | **CRIAR** |
| **Campo Belo** | `campo-belo-sp` | ❌ Não implementado | **CRIAR** |
| **Jardim América** | `jardim-america-sp` | ❌ Não implementado | `jardins-sp` existe (diferente) |
| **Bela Vista** | `bela-vista-sp` | ❌ Não implementado | **CRIAR** |
| **Brooklin** | `brooklin-sp` | ❌ Não implementado | **CRIAR** |
| **Pacaembu** | `pacaembu-sp` | ❌ Não implementado | **CRIAR** |
| **Higienópolis** | `higienopolis-sp` | ❌ Não implementado | **CRIAR** |
| **Alto de Pinheiros** | `alto-de-pinheiros-sp` | ❌ Não implementado | **CRIAR** |
| **Ipiranga** | `ipiranga-sp` | ❌ Não implementado | **CRIAR** |

### 7.4 Resumo do Gap

| Métrica | Valor |
|---------|-------|
| **Total de regiões no seed LiveSEO** | 39 |
| **Páginas implementadas** | 25 |
| **Páginas faltando criar** | 20 |
| **Slugs inconsistentes** | 2 |

### 7.5 Meta Descriptions: Comparação de Qualidade

As meta descriptions do seed da LiveSEO são **otimizadas para CTR** e melhores que as atuais:

**Exemplo - Copacabana:**

| Fonte | Meta Description |
|-------|------------------|
| **Atual** | "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão em Copacabana, Rio de Janeiro." |
| **LiveSEO** | "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão com até 50% de desconto. Oportunidades únicas na Zona Sul. Confira!" |

**Diferenças:**
- LiveSEO inclui **benefício** ("até 50% de desconto")
- LiveSEO inclui **CTA** ("Confira!")
- LiveSEO é mais **persuasiva**

---

## 8. Arquivos Relevantes

### Código-fonte Principal

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/StaticCatalog.tsx` | Página regional (SPA) |
| `src/components/NoScriptFallback.tsx` | Fallback para noscript (dentro do React) |
| `src/data/regionContent.ts` | Dados estáticos por região |
| `scripts/generate-static-pages.cjs` | Gerador de HTML estático |
| `config/seo-pages.json` | Configuração das páginas SEO |

### Dados SEO da LiveSEO

| Arquivo | Descrição |
|---------|-----------|
| `cataldo_sdd_pack/docs-pré-projeto/SEO/regional_pages_seo_seed.json` | 39 regiões com meta tags otimizadas |
| `cataldo_sdd_pack/docs-pré-projeto/SEO/regional_pages_seo_seed.csv` | Mesmo conteúdo em CSV |

### Configuração de Deploy

| Arquivo | Descrição |
|---------|-----------|
| `vercel.json` | Rewrites do Vercel |
| `index.html` | HTML base da SPA |
| `public/catalogo/*.html` | HTMLs estáticos (25 arquivos) |

### Banco de Dados (Supabase)

| Tabela | Descrição |
|--------|-----------|
| `seo_pages` | Configuração de meta tags e filtros por região |
| `imoveis` | Lista de imóveis (não alterar!) |

---

## 9. Conclusão

### Problemas Identificados

1. **Roteamento:** O Vercel serve a SPA para URLs canônicas, não os HTMLs estáticos
2. **Gap de páginas:** 20 regiões do seed da LiveSEO não estão implementadas
3. **Meta descriptions:** As atuais são menos otimizadas que as do seed
4. **Slugs inconsistentes:** 2 regiões têm slugs diferentes do padrão LiveSEO

### Ações Necessárias

1. **Corrigir roteamento** (vercel.json) - Prioridade ALTA
2. **Atualizar meta descriptions** com dados do seed - Prioridade ALTA
3. **Criar 20 novas páginas regionais** - Prioridade MÉDIA
4. **Padronizar slugs** (avaliar impacto de redirects) - Prioridade BAIXA

**Próximo passo:** Ver `SEO_JS_OFF_PLANO.md` para a solução proposta.
