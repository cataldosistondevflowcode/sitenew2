

📚 Documentação Completa do Projeto - Leilão RJ Imóveis

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Sistema de Filtros](#sistema-de-filtros)
5. [Sistema de Geração de Páginas Regionais](#sistema-de-geração-de-páginas-regionais)
6. [Componentes Principais](#componentes-principais)
7. [Rotas e Navegação](#rotas-e-navegação)
8. [Banco de Dados](#banco-de-dados)
9. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
10. [Utilitários e Helpers](#utilitários-e-helpers)

---

## 🎯 Visão Geral

Este é um sistema web para exibição e busca de imóveis em leilão no Rio de Janeiro e São Paulo. O projeto permite que usuários busquem imóveis através de filtros avançados, visualizem detalhes de propriedades e acessem páginas SEO otimizadas para diferentes regiões.

### Características Principais

- ✅ Sistema de filtros avançado com sincronização via URL
- ✅ Geração automática de páginas SEO regionais
- ✅ Busca de imóveis em tempo real via Supabase
- ✅ Interface responsiva com React e Tailwind CSS
- ✅ Paginação eficiente de resultados
- ✅ URLs amigáveis e compartilháveis

### Volume de Dados

- **~16.000 imóveis** cadastrados
- Suporte para **RJ** e **SP**
- Múltiplas zonas e bairros

---

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico

#### Frontend
- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.5.3** - Tipagem estática
- **Vite 5.4.1** - Build tool e dev server
- **React Router 6.26.2** - Roteamento
- **Tailwind CSS 3.4.11** - Estilização
- **shadcn/ui** - Componentes UI
- **TanStack Query 5.56.2** - Gerenciamento de estado servidor

#### Backend/Database
- **Supabase** - Backend as a Service (PostgreSQL)
- **Edge Functions** - Funções serverless

#### Ferramentas
- **Node.js** - Runtime
- **ESLint** - Linter
- **PostCSS** - Processamento CSS

### Arquitetura Geral

```
┌─────────────────────────────────────────┐
│         FRONTEND (React SPA)            │
│                                         │
│  ┌──────────────┐    ┌──────────────┐   │
│  │   Componentes│    │   Hooks     │   │
│  │   React      │    │   Custom    │   │
│  └──────┬───────┘    └──────┬──────┘   │
│         │                   │           │
│         └──────────┬─────────┘           │
│                   │                     │
│         ┌─────────▼─────────┐          │
│         │  React Router      │          │
│         │  (URL Management)  │          │
│         └─────────┬─────────┘          │
└───────────────────┼─────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Supabase Client    │
         │   (PostgreSQL API)   │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Supabase Database  │
         │   (PostgreSQL)       │
         └──────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
leilao-rj-imoveis-site-main-novo/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── admin/          # Componentes administrativos
│   │   ├── property-detail/ # Componentes de detalhe do imóvel
│   │   ├── ui/             # Componentes shadcn/ui
│   │   └── ...
│   ├── pages/              # Páginas principais da aplicação
│   │   ├── Index.tsx       # Página inicial (RJ)
│   │   ├── LeilaoRJ.tsx    # Página específica RJ
│   │   ├── LeilaoSP.tsx    # Página específica SP
│   │   ├── PropertyDetail.tsx # Detalhe do imóvel
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   ├── useFilterParams.tsx # Hook de gerenciamento de filtros
│   │   ├── useAuth.tsx     # Autenticação
│   │   └── ...
│   ├── integrations/       # Integrações externas
│   │   ├── supabase/      # Cliente Supabase
│   │   ├── mapbox/        # Integração Mapbox
│   │   └── googlemaps/    # Integração Google Maps
│   ├── utils/             # Funções utilitárias
│   │   ├── stringUtils.ts # Manipulação de strings
│   │   ├── slugUtils.ts   # Geração de URLs
│   │   └── ...
│   └── App.tsx            # Componente raiz
├── config/
│   └── seo-pages.json     # Configuração de páginas SEO
├── scripts/
│   ├── manage-seo-pages.js # Gerenciamento de páginas SEO
│   ├── generate-sitemap.js # Geração de sitemap
│   └── ...
├── html-static/           # Páginas HTML estáticas geradas
├── supabase/
│   ├── functions/         # Edge Functions
│   └── migrations/        # Migrações do banco
└── package.json
```

---

## 🔍 Sistema de Filtros

O sistema de filtros é o coração da aplicação, permitindo busca avançada de imóveis com sincronização automática via URL.

### Arquitetura do Sistema de Filtros

```
┌─────────────────┐
│   URL Params    │ ← Usuário acessa URL com filtros
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useFilterParams │ ← Hook lê filtros da URL
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Estado Filters │ ← Filtros aplicados no estado
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase Query │ ← Query construída com filtros
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Resultados     │ ← 40 itens por página
└─────────────────┘
```

### Interface de Filtros

```typescript
interface FilterParams {
  // Localização
  city?: string;                    // Cidade única
  cities?: string[];                 // Múltiplas cidades
  neighborhood?: string;             // Bairro único
  neighborhoods?: string[];         // Múltiplos bairros
  zone?: string;                    // Zona única (ex: "Zona Sul (Rio de Janeiro)")
  zones?: string[];                 // Múltiplas zonas
  location?: string;                 // Busca livre em endereço, bairro ou cidade
  
  // Tipo de Imóvel
  type?: string;                     // Tipo único ou múltiplos separados por vírgula
  
  // Busca por Texto
  keyword?: string;                  // Busca em título e descrição
  
  // Preço
  priceRange?: {
    min?: number;                    // Valor mínimo
    max?: number;                    // Valor máximo
  };
  priceRanges?: string[];           // Múltiplas faixas de preço selecionadas
  
  // Tipo de Leilão
  auctionType?: string;              // "Judicial", "EXTRAJUDICIAL_CUSTOM", "EXTRAJUDICIAL_COMPOSTO", "CAIXA"
  
  // Características do Leilão
  hasSecondAuction?: boolean;         // Apenas imóveis com segundo leilão
  financiamento?: boolean;           // Aceita financiamento
  fgts?: boolean;                    // Aceita FGTS
  parcelamento?: boolean;           // Permite parcelamento
  
  // Data
  dataFimSegundoLeilao?: string;    // Data final para encerramento do segundo leilão (ISO format)
}
```

### Mapeamento URL ↔ Filtros

| Parâmetro URL | Campo Filtro | Tipo | Exemplo |
|--------------|--------------|------|---------|
| `cidade` | `city` | string | `?cidade=Rio de Janeiro` |
| `cidades` | `cities` | string[] | `?cidades=Rio de Janeiro,Niterói` |
| `bairro` | `neighborhood` | string | `?bairro=Copacabana` |
| `bairros` | `neighborhoods` | string[] | `?bairros=Copacabana,Ipanema` |
| `zona` | `zone` | string | `?zona=Zona Sul (Rio de Janeiro)` |
| `zonas` | `zones` | string[] | `?zonas=Zona Sul (Rio de Janeiro),Zona Norte (Rio de Janeiro)` |
| `tipo` | `type` | string | `?tipo=Apartamento` |
| `localizacao` | `location` | string | `?localizacao=Ipanema` |
| `palavra_chave` | `keyword` | string | `?palavra_chave=mar` |
| `preco_min` | `priceRange.min` | number | `?preco_min=200000` |
| `preco_max` | `priceRange.max` | number | `?preco_max=500000` |
| `faixas_preco` | `priceRanges` | string[] | `?faixas_preco=200k-500k,500k-1M` |
| `tipo_leilao` | `auctionType` | string | `?tipo_leilao=Judicial` |
| `segundo_leilao` | `hasSecondAuction` | boolean | `?segundo_leilao=true` |
| `financiamento` | `financiamento` | boolean | `?financiamento=true` |
| `fgts` | `fgts` | boolean | `?fgts=true` |
| `parcelamento` | `parcelamento` | boolean | `?parcelamento=true` |
| `data_fim_segundo_leilao` | `dataFimSegundoLeilao` | string | `?data_fim_segundo_leilao=2024-12-31` |

### Hook useFilterParams

O hook `useFilterParams` gerencia a sincronização entre URL e estado dos filtros:

**Localização:** `src/hooks/useFilterParams.tsx`

**Funcionalidades:**
- `parseFiltersFromURL()` - Lê filtros da URL e converte para objeto
- `updateURL(filters)` - Atualiza URL com novos filtros
- `clearFiltersFromURL()` - Remove todos os filtros da URL
- `getShareableURL()` - Retorna URL atual compartilhável
- `createShareableURL(filters)` - Cria URL com filtros específicos

### Construção de Queries Supabase

Os filtros são aplicados sequencialmente na query do Supabase:

```typescript
// Exemplo: Busca por "Apartamentos em Copacabana até R$ 500k"

let query = supabase
  .from('leiloes_imoveis')
  .select('*', { count: 'exact' });

// Filtro base: Estado
query = query.eq('estado', 'RJ');

// Filtro: Valor mínimo (R$ 75.000)
query = query.gte('leilao_1', 75000);

// Filtro: Tipo de propriedade
query = query.eq('tipo_propriedade', 'Apartamento');

// Filtro: Bairro
query = query.eq('bairro', 'Copacabana');

// Filtro: Preço máximo
query = query.lte('leilao_1', 500000);

// Filtro automático: Apenas leilões futuros
query = query.or('data_leilao_1.is.null,data_leilao_1.gte.hoje,data_leilao_2.gte.hoje');

// Ordenação
query = query.order('data_leilao_1', { ascending: true });

// Paginação (40 itens por página)
const from = (currentPage - 1) * 40;
const to = from + 40 - 1;
query = query.range(from, to);

// Executar query
const { data, count } = await query;
```

### Filtros Especiais

#### 1. Filtro de Zona
Quando uma zona é selecionada, o sistema busca todos os bairros associados àquela zona:

```typescript
// Exemplo: "Zona Sul (Rio de Janeiro)"
const bairrosZonaSul = [
  'Botafogo', 'Catete', 'Copacabana', 'Cosme Velho', 
  'Flamengo', 'Gávea', 'Humaitá', 'Ipanema', ...
];

query = query.in('bairro', bairrosZonaSul);
```

#### 2. Filtro de Localização (Busca Livre)
Busca flexível em endereço, bairro ou cidade:

```typescript
if (filters.location) {
  const location = escapeSqlLike(filters.location);
  query = query.or(
    `endereco.ilike.%${location}%,bairro.ilike.%${location}%,cidade.ilike.%${location}%`
  );
}
```

#### 3. Filtro de Palavra-chave
Busca em título e descrição:

```typescript
if (filters.keyword) {
  const keyword = escapeSqlLike(filters.keyword);
  query = query.or(
    `titulo_propriedade.ilike.%${keyword}%,descricao.ilike.%${keyword}%`
  );
}
```

#### 4. Filtro de Faixas de Preço
Múltiplas faixas podem ser selecionadas:

```typescript
// Exemplo: ["200k-500k", "500k-1M"]
const priceRanges = [
  { min: 200000, max: 500000 },
  { min: 500000, max: 1000000 }
];

query = query.or(
  'leilao_1.gte.200000,leilao_1.lte.500000,leilao_1.gte.500000,leilao_1.lte.1000000'
);
```

### Paginação

- **40 itens por página** (configurável via `ITEMS_PER_PAGE`)
- Contagem total de resultados para cálculo de páginas
- Navegação via componente `PropertyPagination`

---

## 📄 Sistema de Geração de Páginas Regionais

O sistema permite gerar páginas HTML estáticas otimizadas para SEO, cada uma focada em uma região/bairro específico.

### Arquitetura

```
┌──────────────────────┐
│ config/seo-pages.json│ ← Configuração das páginas
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ manage-seo-pages.js  │ ← Script de geração
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Template HTML (RJ/SP)│ ← Template base
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Páginas HTML Geradas │ ← html-static/*.html
└──────────────────────┘
```

### Arquivo de Configuração

**Localização:** `config/seo-pages.json`

```json
{
  "pages": [
    {
      "id": "copacabana-rj",
      "estado": "RJ",
      "regiao": "Copacabana",
      "keyword": "comprar apartamento copacabana",
      "urlSlug": "comprar-apartamento-copacabana",
      "metaTitle": "Comprar Apartamento Copacabana: leilão de Imóveis | Cataldo Siston",
      "metaDescription": "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão...",
      "metaKeywords": "comprar apartamento copacabana, leilão de imóveis, leilão RJ...",
      "filterType": "bairro",
      "filterValue": "Copacabana",
      "active": true
    }
  ],
  "settings": {
    "outputDir": "html-static",
    "templateRJ": "html-static/leilao-rj.html",
    "templateSP": "html-static/leilao-sp.html",
    "autoGenerateSlug": true
  }
}
```

### Campos da Configuração

#### Campos Obrigatórios
- `id` - Identificador único
- `estado` - "RJ" ou "SP"
- `regiao` - Nome da região/bairro
- `keyword` - Palavra-chave principal
- `metaTitle` - Título da página
- `metaDescription` - Descrição para SEO

#### Campos Opcionais
- `urlSlug` - URL amigável (gerado automaticamente se não fornecido)
- `metaKeywords` - Palavras-chave adicionais
- `filterType` - "bairro" ou "zona" (detectado automaticamente)
- `filterValue` - Valor do filtro (normalizado automaticamente)
- `active` - true/false (padrão: true)

### Processo de Geração

1. **Leitura da Configuração**
   - Carrega `config/seo-pages.json`
   - Filtra apenas páginas com `active: true`

2. **Seleção do Template**
   - RJ: `html-static/leilao-rj.html`
   - SP: `html-static/leilao-sp.html`

3. **Substituições no Template**
   - `<title>` - Substituído pelo `metaTitle`
   - `<meta name="description">` - Substituído pelo `metaDescription`
   - `<meta name="keywords">` - Substituído pelo `metaKeywords`
   - `<h1>` - Adiciona região destacada

4. **Injeção de Script de Filtro**
   - Adiciona script JavaScript que aplica filtro automaticamente ao carregar
   - Filtro aplicado baseado em `filterType` e `filterValue`

5. **Geração do Arquivo**
   - Salva em `html-static/{urlSlug}.html`

### Script de Filtro Automático

Cada página gerada inclui um script que aplica o filtro automaticamente:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.propertyFilter) {
      const filterValue = "Copacabana";
      const filterType = "bairro";
      if (filterType === 'bairro') {
        window.propertyFilter.setFilters({ neighborhood: filterValue });
      } else if (filterType === 'zona') {
        window.propertyFilter.setFilters({ zone: filterValue });
      }
    }
  }, 800);
});
```

### Comandos Disponíveis

```bash
# Listar todas as páginas configuradas
npm run seo:list

# Gerar todas as páginas HTML ativas
npm run seo:generate

# Adicionar nova página
npm run seo:add -- '{"estado":"RJ","regiao":"Leblon","keyword":"comprar apartamento leblon","metaTitle":"...","metaDescription":"..."}'

# Atualizar página existente
npm run seo:update -- copacabana-rj '{"metaTitle":"Novo título"}'

# Deletar página
npm run seo:delete -- copacabana-rj

# Ativar página
npm run seo:enable -- copacabana-rj

# Desativar página
npm run seo:disable -- copacabana-rj
```

### Detecção Automática de Tipo de Filtro

O sistema detecta automaticamente se é **bairro** ou **zona**:

- **Zonas:** "Zona Sul", "Zona Norte", "Região dos lagos", "Região serrana"
- **Bairros:** Todos os outros

### Normalização de Valores

Valores de filtro são normalizados automaticamente:

```javascript
const filterMapping = {
  'Zona Sul': 'Zona Sul',
  'Zona Norte': 'Zona Norte',
  'Região dos lagos': 'Região dos Lagos',
  'Região serrana': 'Região Serrana'
};
```

---

## 🧩 Componentes Principais

### PropertyCard

**Localização:** `src/components/PropertyCard.tsx`

Componente que exibe um card de imóvel na listagem.

**Props:**
```typescript
interface PropertyCardProps {
  id: number;
  image: string;
  title: string;
  location: string;
  firstAuctionDate: string;
  firstAuctionValue: string;
  secondAuctionDate?: string;
  secondAuctionValue?: string;
  area?: string;
  parkingSpots?: string;
  tipoLeilao?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
}
```

**Funcionalidades:**
- Exibe imagem do imóvel
- Mostra informações de localização
- Badges para características (FGTS, Financiamento, etc.)
- Informações de leilão (data e valor)
- Link para página de detalhes
- Botão de compartilhamento

### PropertyPagination

**Localização:** `src/components/PropertyPagination.tsx`

Componente de paginação dos resultados.

**Props:**
```typescript
interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

### Header

**Localização:** `src/components/Header.tsx`

Cabeçalho principal da aplicação com navegação.

### Footer

**Localização:** `src/components/Footer.tsx`

Rodapé com links e informações.

### SEO

**Localização:** `src/components/SEO.tsx`

Componente para gerenciamento de meta tags dinâmicas.

---

## 🗺️ Rotas e Navegação

### Estrutura de Rotas

**Localização:** `src/App.tsx`

```typescript
<Routes>
  {/* Páginas Principais */}
  <Route path="/" element={<Index />} />
  <Route path="/leilao-caixa-rj" element={<LeilaoCaixaRJ />} />
  <Route path="/leilao-rj" element={<LeilaoRJ />} />
  <Route path="/imovel-rj" element={<LeilaoRJ />} />
  <Route path="/leilao-sp" element={<LeilaoSP />} />
  
  {/* Detalhe do Imóvel */}
  <Route path="/imovel/:id" element={<PropertyDetail />} />
  <Route path="/imovel/:id/:slug" element={<PropertyDetail />} />
  
  {/* Páginas Estáticas */}
  <Route path="/catalogo/:pageId" element={<StaticCatalog />} />
  
  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Formato de URL de Imóvel

```
/imovel/{id}/{slug}/
```

**Exemplo:**
```
/imovel/12345/imovel-leilao-avenida-atlantica-copacabana-rio-de-janeiro-rj/
```

O slug é gerado automaticamente a partir do endereço, bairro, cidade e estado.

---

## 🗄️ Banco de Dados

### Tabela Principal: `leiloes_imoveis`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | number | ID único do imóvel |
| `titulo_propriedade` | string | Título do imóvel |
| `endereco` | string | Endereço completo |
| `bairro` | string | Bairro |
| `cidade` | string | Cidade |
| `estado` | string | Estado (RJ/SP) |
| `data_leilao_1` | date | Data do 1º leilão |
| `data_leilao_2` | date | Data do 2º leilão |
| `leilao_1` | number | Valor do 1º leilão |
| `leilao_2` | number | Valor do 2º leilão |
| `tipo_propriedade` | string | Tipo (Casa, Apartamento, etc.) |
| `tipo_leilao` | string | Judicial, Extrajudicial, etc. |
| `descricao` | text | Descrição do imóvel |
| `imagem` | string | URL da imagem |
| `financiamento` | boolean | Aceita financiamento |
| `fgts` | boolean | Aceita FGTS |
| `parcelamento` | boolean | Permite parcelamento |

### Tabelas de Filtros

#### `filter_zones`
Armazena zonas e seus bairros associados.

#### `filter_neighborhoods`
Armazena bairros disponíveis para filtro.

### Cliente Supabase

**Localização:** `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
```

---

## 🔄 Fluxo de Funcionamento

### Fluxo de Busca Completo

1. **Usuário acessa página com filtros na URL**
   ```
   /?bairro=Copacabana&tipo=Apartamento&preco_max=500000
   ```

2. **Hook `useFilterParams` lê URL**
   ```typescript
   const filters = parseFiltersFromURL();
   // { neighborhood: "Copacabana", type: "Apartamento", priceRange: { max: 500000 } }
   ```

3. **Estado é atualizado**
   ```typescript
   setFilters(filters);
   ```

4. **useEffect detecta mudança e busca dados**
   ```typescript
   useEffect(() => {
     fetchProperties();
   }, [filters, currentPage]);
   ```

5. **Query Supabase é construída**
   ```typescript
   let query = supabase.from('leiloes_imoveis')
     .eq('estado', 'RJ')
     .gte('leilao_1', 75000)
     .eq('tipo_propriedade', 'Apartamento')
     .eq('bairro', 'Copacabana')
     .lte('leilao_1', 500000);
   ```

6. **Paginação é aplicada**
   ```typescript
   query = query.range(from, to);
   ```

7. **Query é executada**
   ```typescript
   const { data, count } = await query;
   ```

8. **Resultados são exibidos**
   ```typescript
   setProperties(data);
   setTotalCount(count);
   ```

### Fluxo de Geração de Página SEO

1. **Configuração é lida**
   ```javascript
   const config = loadConfig();
   const activePages = config.pages.filter(p => p.active);
   ```

2. **Para cada página ativa:**
   - Template é carregado (RJ ou SP)
   - Meta tags são substituídas
   - Script de filtro é injetado
   - Arquivo HTML é salvo

3. **Página gerada é servida**
   - Usuário acessa `/comprar-apartamento-copacabana.html`
   - Script aplica filtro automaticamente
   - Imóveis filtrados são exibidos

---

## 🛠️ Utilitários e Helpers

### stringUtils.ts

**Localização:** `src/utils/stringUtils.ts`

Funções utilitárias para manipulação de strings:

- `normalizeString(str)` - Remove acentos e normaliza
- `flexibleSearch(text, search)` - Busca flexível
- `formatCurrency(value)` - Formata valores monetários
- `escapeSqlLike(str)` - Escapa caracteres especiais SQL
- `sanitizeSearchInput(str)` - Sanitiza entrada de busca

### slugUtils.ts

**Localização:** `src/utils/slugUtils.ts`

Funções para geração de URLs:

- `createSlug(text)` - Converte texto em slug
- `createPropertyUrl(id, address, ...)` - Cria URL de imóvel
- `extractPropertyIdFromUrl(urlPath)` - Extrai ID da URL
- `normalizeAuctionType(tipoLeilao)` - Normaliza tipo de leilão

### addressFormatter.ts

**Localização:** `src/utils/addressFormatter.ts`

Formatação de endereços para exibição.

---

## 📝 Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "generate-sitemap": "node scripts/generate-sitemap.js",
    "seo:list": "node scripts/manage-seo-pages.js list",
    "seo:generate": "node scripts/manage-seo-pages.js generate",
    "seo:add": "node scripts/manage-seo-pages.js add",
    "seo:update": "node scripts/manage-seo-pages.js update",
    "seo:delete": "node scripts/manage-seo-pages.js delete",
    "seo:enable": "node scripts/manage-seo-pages.js enable",
    "seo:disable": "node scripts/manage-seo-pages.js disable"
  }
}
```

---

## 🚀 Como Executar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:8080`

### Build de Produção

```bash
# Gerar sitemap
npm run generate-sitemap

# Build
npm run build
```

### Geração de Páginas SEO

```bash
# Listar páginas
npm run seo:list

# Gerar todas as páginas
npm run seo:generate
```

---

## 📌 Observações Importantes

1. **Filtro Automático de Leilões Futuros**
   - Aplicado automaticamente em todas as buscas
   - Inclui leilões sem data (null) ou com data futura
   - Pode ser desabilitado com filtro `dataFimSegundoLeilao`

2. **Valor Mínimo**
   - Filtro automático de R$ 75.000 aplicado em todas as buscas

3. **Paginação**
   - 40 itens por página (configurável)
   - Contagem total sempre calculada

4. **URLs Compartilháveis**
   - Todos os filtros são sincronizados com a URL
   - URLs podem ser compartilhadas diretamente

5. **Páginas SEO**
   - Geradas como HTML estático
   - Filtros aplicados via JavaScript
   - Otimizadas para mecanismos de busca

---

## 📚 Referências

- [Documentação React](https://react.dev)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação React Router](https://reactrouter.com)
- [Documentação Tailwind CSS](https://tailwindcss.com)
- [Documentação shadcn/ui](https://ui.shadcn.com)

---

**Última atualização:** Dezembro 2024
