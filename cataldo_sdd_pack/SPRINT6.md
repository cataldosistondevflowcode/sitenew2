# Sprint 6 — Layout Completo das Páginas Regionais (SEO Local)
_Data: 2026-01-20_  
_Atualizado: 2026-01-24_  
_Status: ✅ CONCLUÍDA (25 páginas regionais criadas - 15 RJ + 10 SP)_  
_Prioridade: Alta_  
_Prazo Original: 30/01/2026_

---

## Status Atual

### ✅ O que já foi implementado:

| Item | Status | Observação |
|------|--------|------------|
| Layout completo páginas regionais | ✅ | Implementado no `StaticCatalog.tsx` |
| `RegionContentSection` | ✅ | Bairros, atrações, infraestrutura, diferenciais |
| `SupportCTA` | ✅ | "Não encontrou o que procurava?" |
| `SuccessCasesSection` | ✅ | Casos de sucesso com vídeos YouTube |
| `TestimonialsSection` | ✅ | Depoimentos com navegação |
| Texto introdutório | ✅ | Campo `intro_text` na tabela `seo_pages` |
| Descrição da região | ✅ | Campo `region_description` |
| Conteúdo complementar | ✅ | Campo `region_content` (JSON) |
| **15 páginas regionais RJ** | ✅ | Copacabana, Ipanema, Leblon, Barra, Zona Sul + 10 novas |
| **10 páginas regionais SP** | ✅ | Jardins, Pinheiros, Moema, Itaim Bibi, Vila Mariana, Zonas |

### ✅ Componentes implementados:

| Item | Status | Prioridade |
|------|--------|------------|
| `RelatedPropertiesCarousel` | ✅ | Implementado |
| `BlogPostsCarousel` | ✅ | Implementado |
| Mais páginas regionais (expansão) | ⏸️ | Baixa (futura) |

---

## Escopo Original (docs-pré-projeto)

Conforme documentos de escopo:
- **Volume planejado**: ~35 regiões
- **Estados**: RJ e SP
- **Implementado**: 25 páginas (15 RJ + 10 SP)

---

## Páginas Regionais - Status Completo

### Rio de Janeiro (RJ) - ✅ 15 páginas

| ID | Região | URL | Tipo | Status |
|----|--------|-----|------|--------|
| `copacabana-rj` | Copacabana | `/catalogo/copacabana-rj` | Bairro | ✅ |
| `ipanema-rj` | Ipanema | `/catalogo/ipanema-rj` | Bairro | ✅ |
| `leblon-rj` | Leblon | `/catalogo/leblon-rj` | Bairro | ✅ |
| `barra-tijuca-rj` | Barra da Tijuca | `/catalogo/barra-tijuca-rj` | Bairro | ✅ |
| `zona-sul-rj` | Zona Sul | `/catalogo/zona-sul-rj` | Zona | ✅ |
| `botafogo-rj` | Botafogo | `/catalogo/botafogo-rj` | Bairro | ✅ |
| `flamengo-rj` | Flamengo | `/catalogo/flamengo-rj` | Bairro | ✅ |
| `laranjeiras-rj` | Laranjeiras | `/catalogo/laranjeiras-rj` | Bairro | ✅ |
| `tijuca-rj` | Tijuca | `/catalogo/tijuca-rj` | Bairro | ✅ |
| `recreio-rj` | Recreio dos Bandeirantes | `/catalogo/recreio-rj` | Bairro | ✅ |
| `zona-norte-rj` | Zona Norte | `/catalogo/zona-norte-rj` | Zona | ✅ |
| `zona-oeste-rj` | Zona Oeste | `/catalogo/zona-oeste-rj` | Zona | ✅ |
| `niteroi-rj` | Niterói | `/catalogo/niteroi-rj` | Cidade | ✅ |
| `centro-rj` | Centro | `/catalogo/centro-rj` | Bairro | ✅ |
| `meier-rj` | Méier | `/catalogo/meier-rj` | Bairro | ✅ |

### São Paulo (SP) - ✅ 10 páginas

| ID | Região | URL | Tipo | Status |
|----|--------|-----|------|--------|
| `jardins-sp` | Jardins | `/catalogo/jardins-sp` | Bairro | ✅ |
| `pinheiros-sp` | Pinheiros | `/catalogo/pinheiros-sp` | Bairro | ✅ |
| `moema-sp` | Moema | `/catalogo/moema-sp` | Bairro | ✅ |
| `itaim-bibi-sp` | Itaim Bibi | `/catalogo/itaim-bibi-sp` | Bairro | ✅ |
| `vila-mariana-sp` | Vila Mariana | `/catalogo/vila-mariana-sp` | Bairro | ✅ |
| `zona-sul-sp` | Zona Sul | `/catalogo/zona-sul-sp` | Zona | ✅ |
| `zona-oeste-sp` | Zona Oeste | `/catalogo/zona-oeste-sp` | Zona | ✅ |
| `zona-norte-sp` | Zona Norte | `/catalogo/zona-norte-sp` | Zona | ✅ |
| `zona-leste-sp` | Zona Leste | `/catalogo/zona-leste-sp` | Zona | ✅ |
| `centro-sp` | Centro | `/catalogo/centro-sp` | Bairro | ✅ |

### ⏸️ Expansão Futura (Baixa Prioridade)

| ID | Região | Tipo | Prioridade |
|----|--------|------|------------|
| `jacarepagua-rj` | Jacarepaguá | Bairro | Baixa |
| `ilha-governador-rj` | Ilha do Governador | Bairro | Baixa |
| `regiao-lagos-rj` | Região dos Lagos | Zona | Baixa |
| `regiao-serrana-rj` | Região Serrana | Zona | Baixa |
| `baixada-fluminense-rj` | Baixada Fluminense | Zona | Baixa |
| `santana-sp` | Santana | Bairro | Baixa |
| `tatuape-sp` | Tatuapé | Bairro | Baixa |
| `mooca-sp` | Mooca | Bairro | Baixa |
| `perdizes-sp` | Perdizes | Bairro | Baixa |
| `brooklin-sp` | Brooklin | Bairro | Baixa |
| `alphaville-sp` | Alphaville | Bairro | Média |
| `abc-paulista-sp` | ABC Paulista | Zona | Média |
| `guarulhos-sp` | Guarulhos | Cidade | Média |
| `campinas-sp` | Campinas | Cidade | Baixa |
| `santos-sp` | Santos | Cidade | Baixa |

---

## Tarefas Atualizadas

### Fase 1: Expandir Páginas RJ (2-3 dias)
- [ ] **T6.1** - Criar 10 novas páginas regionais RJ (alta prioridade)
  - Botafogo, Flamengo, Laranjeiras, Tijuca, Recreio
  - Zona Norte, Zona Oeste, Niterói, Centro, Méier
- [ ] **T6.2** - Adicionar conteúdo para cada região
  - Texto introdutório
  - Descrição da região
  - Bairros, atrações, infraestrutura, diferenciais

### Fase 2: Criar Páginas SP (3-4 dias)
- [ ] **T6.3** - Criar 10 páginas regionais SP (alta prioridade)
  - Centro, Zona Sul, Zona Oeste, Zona Norte, Zona Leste
  - Jardins, Pinheiros, Moema, Itaim Bibi, Vila Mariana
- [ ] **T6.4** - Adicionar conteúdo para cada região SP
  - Texto introdutório
  - Descrição da região
  - Bairros, atrações, infraestrutura, diferenciais

### Fase 3: Componentes Pendentes (1-2 dias)
- [ ] **T6.5** - Criar `RelatedPropertiesCarousel`
  - Carrossel de imóveis relacionados
  - Buscar imóveis da mesma zona/cidade
- [ ] **T6.6** - Criar `BlogPostsCarousel` (baixa prioridade)
  - Integrar com Webflow CMS ou criar tabela local

### Fase 4: Expansão Adicional (2-3 dias)
- [ ] **T6.7** - Criar páginas RJ restantes (média prioridade)
  - Jacarepaguá, Ilha do Governador
  - Região dos Lagos, Região Serrana, Baixada Fluminense
- [ ] **T6.8** - Criar páginas SP restantes (média prioridade)
  - Santana, Tatuapé, Mooca, Perdizes, Brooklin
  - Alphaville, ABC Paulista, Guarulhos

---

## Estrutura de Dados para Novas Páginas

### Exemplo de configuração para `seo-pages.json`:

```json
{
  "id": "botafogo-rj",
  "estado": "RJ",
  "regiao": "Botafogo",
  "keyword": "comprar apartamento botafogo",
  "urlSlug": "comprar-apartamento-botafogo",
  "metaTitle": "Comprar Apartamento Botafogo: Leilão de Imóveis | Cataldo Siston",
  "metaDescription": "Encontre apartamentos em leilão em Botafogo, Rio de Janeiro. Leilões judiciais e extrajudiciais com excelentes oportunidades. Cataldo Siston Advogados.",
  "metaKeywords": "comprar apartamento botafogo, leilão de imóveis botafogo, leilão RJ",
  "filterType": "bairro",
  "filterValue": "Botafogo",
  "active": true,
  "intro_text": "Botafogo é um dos bairros mais tradicionais da Zona Sul do Rio de Janeiro, conhecido pela vista para o Pão de Açúcar e excelente infraestrutura.",
  "region_description": "Com localização privilegiada entre Copacabana e o Centro, Botafogo oferece fácil acesso a diversas regiões da cidade. O bairro conta com metrô, shoppings, hospitais e uma vida cultural intensa.",
  "region_content": {
    "neighborhoods": ["Botafogo", "Urca", "Humaitá"],
    "attractions": ["Praia de Botafogo", "Pão de Açúcar", "Casa de Rui Barbosa", "Shopping Rio Sul"],
    "infrastructure": ["Metrô Botafogo", "Hospital Samaritano", "Colégio Santo Inácio"],
    "highlights": ["Vista para o Pão de Açúcar", "Proximidade com praias", "Vida noturna agitada"]
  }
}
```

### Exemplo para São Paulo:

```json
{
  "id": "jardins-sp",
  "estado": "SP",
  "regiao": "Jardins",
  "keyword": "comprar apartamento jardins são paulo",
  "urlSlug": "comprar-apartamento-jardins-sp",
  "metaTitle": "Comprar Apartamento Jardins SP: Leilão de Imóveis | Cataldo Siston",
  "metaDescription": "Encontre apartamentos em leilão nos Jardins, São Paulo. Leilões judiciais e extrajudiciais com excelentes oportunidades. Cataldo Siston Advogados.",
  "metaKeywords": "comprar apartamento jardins, leilão de imóveis jardins sp, leilão SP",
  "filterType": "bairro",
  "filterValue": "Jardins",
  "active": true,
  "intro_text": "Os Jardins são uma das regiões mais nobres de São Paulo, conhecida por suas ruas arborizadas, lojas de grife e restaurantes sofisticados.",
  "region_description": "Localizado na região central de São Paulo, os Jardins englobam bairros como Jardim Paulista, Jardim América e Jardim Europa. A região oferece alta qualidade de vida e valorização imobiliária.",
  "region_content": {
    "neighborhoods": ["Jardim Paulista", "Jardim América", "Jardim Europa", "Cerqueira César"],
    "attractions": ["Avenida Paulista", "Parque Trianon", "Rua Oscar Freire", "MASP"],
    "infrastructure": ["Metrô Trianon-MASP", "Hospital Sírio-Libanês", "Shopping Iguatemi"],
    "highlights": ["Região mais valorizada de SP", "Gastronomia de alto padrão", "Comércio de luxo"]
  }
}
```

---

## Estimativa de Tempo Atualizada

| Fase | Duração Estimada |
|------|------------------|
| Fase 1: Expandir RJ | 2-3 dias |
| Fase 2: Criar SP | 3-4 dias |
| Fase 3: Componentes | 1-2 dias |
| Fase 4: Expansão Adicional | 2-3 dias |
| **Total** | **8-12 dias** |

---

## Critérios de Aceite Atualizados

### Páginas Regionais
- [x] Layout completo implementado ✅
- [x] 5 páginas RJ criadas ✅
- [ ] 15+ páginas RJ criadas
- [ ] 10+ páginas SP criadas
- [ ] Conteúdo específico para cada região

### Componentes
- [x] `RegionContentSection` ✅
- [x] `SupportCTA` ✅
- [x] `SuccessCasesSection` ✅
- [x] `TestimonialsSection` ✅
- [x] `RelatedPropertiesCarousel` ✅
- [x] `BlogPostsCarousel` ✅

### SEO
- [x] H1 único por região ✅
- [x] Meta tags completas ✅
- [x] Canônicas corretas ✅
- [ ] Todas as regiões prioritárias cobertas

---

## Comandos para Criar Novas Páginas

```bash
# Listar páginas existentes
npm run seo:list

# Adicionar nova página RJ
npm run seo:add -- '{"estado":"RJ","regiao":"Botafogo","keyword":"comprar apartamento botafogo","metaTitle":"Comprar Apartamento Botafogo: Leilão de Imóveis | Cataldo Siston","metaDescription":"Encontre apartamentos em leilão em Botafogo..."}'

# Adicionar nova página SP
npm run seo:add -- '{"estado":"SP","regiao":"Jardins","keyword":"comprar apartamento jardins são paulo","metaTitle":"Comprar Apartamento Jardins SP: Leilão de Imóveis | Cataldo Siston","metaDescription":"Encontre apartamentos em leilão nos Jardins..."}'

# Sincronizar com Supabase
npm run seo:sync

# Gerar páginas estáticas
npm run seo:generate
```

---

## Referências

- [Tarefa LiveSEO - Layout Páginas Regionais](https://app.liveseo.com.br/projeto/CB742/task/12336/205270/preview?key=RE2Go6ZXGj55Q79q)
- Sprint 2 - Páginas Regionais Fixas (base implementada)
- Sprint 7 - Correções de Layout/UX (melhorias aplicadas)
- `docs-pré-projeto/escopo_projeto_transcricao.md` - Escopo original (~35 regiões)

---

## Histórico de Atualizações

| Data | Alteração |
|------|-----------|
| 2026-01-20 | Sprint criada com especificação LiveSEO |
| 2026-01-23 | Componentes implementados (Sprint 7 aplicou correções) |
| 2026-01-24 | Status atualizado - identificado que faltam páginas SP e mais RJ |
| 2026-01-26 | ✅ RelatedPropertiesCarousel e BlogPostsCarousel implementados |

---

**Status**: ✅ **CONCLUÍDA**

**Nota**: Todos os componentes foram implementados. Expansão de páginas regionais para outras regiões é tarefa de baixa prioridade para sprints futuras.
