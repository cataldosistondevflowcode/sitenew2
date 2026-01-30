# Plano de Implementação: SEO JS-Off para Páginas Regionais

**Data:** 29/01/2026  
**Última Atualização:** 30/01/2026  
**Referência:** [Diagnóstico](./SEO_JS_OFF_DIAGNOSTICO.md)  
**Solicitante:** LiveSEO (Augusto Xavier)

---

## ⚠️ ATUALIZAÇÃO IMPORTANTE (30/01/2026)

### Novo Requisito: Paridade Total HTML vs React

Após análise detalhada dos prints da versão React, identificamos que o fallback HTML atual **não possui paridade completa** com a versão renderizada.

**Documentação complementar:**
- **[SEO_FALLBACK_HTML_SPEC.md](./SEO_FALLBACK_HTML_SPEC.md)** - Especificação completa de todos os elementos
- **[SEO_FALLBACK_SPRINTS.md](./SEO_FALLBACK_SPRINTS.md)** - Plano de sprints para implementação

### Elementos que FALTAM no HTML Estático:

| # | Elemento | Status Atual |
|---|----------|--------------|
| 1 | Header Superior (email, telefone, WhatsApp, redes sociais) | ❌ Falta |
| 2 | Hero com imagem de fundo | ❌ Falta |
| 3 | Vídeo Institucional (YouTube embed/thumbnail) | ❌ Falta |
| 4 | Seção "Oportunidades de Imóveis em Leilão" | ❌ Falta |
| 5 | CTA "Não encontrou o que estava procurando?" | ❌ Falta |
| 6 | Ícones na seção "Conheça mais sobre" | ❌ Falta |
| 7 | Casos de Sucesso com thumbnails de vídeo | ⚠️ Só texto |
| 8 | Seção Depoimentos com carrossel estático | ❌ Falta |
| 9 | Seção Newsletter com formulário e foto | ❌ Falta |
| 10 | Footer completo (3 colunas + redes sociais) | ⚠️ Diferente |

### Exceção Acordada:
- **Filtros de imóveis** - NÃO incluir no HTML estático
- **Listagem de imóveis** - NÃO incluir no HTML estático

### Próximo Passo:
Seguir o plano em `SEO_FALLBACK_SPRINTS.md` para implementar paridade total.

---

## 1. Escopo do Problema

### 1.1 Problemas Identificados

| # | Problema | Impacto | Prioridade |
|---|----------|---------|------------|
| 1 | Roteamento serve SPA para URLs canônicas | Conteúdo genérico para crawlers | **ALTA** |
| 2 | Meta descriptions não otimizadas | CTR baixo nos resultados | **ALTA** |
| 3 | 20 regiões do seed não implementadas | Oportunidades de tráfego perdidas | **MÉDIA** |
| 4 | 2 slugs inconsistentes com padrão LiveSEO | Confusão de URLs | **BAIXA** |

### 1.2 Fonte de Dados Oficial

**Arquivo:** `cataldo_sdd_pack/docs-pré-projeto/SEO/regional_pages_seo_seed.json`

Contém 39 regiões com:
- Meta Title otimizado
- Meta Description focada em CTR
- Keyword principal
- Slug sugerido

---

## 2. Soluções Propostas

### Solução A: Servir HTML Estático nas URLs Canônicas (Recomendada)

**Conceito:** Alterar o `vercel.json` para servir os HTMLs estáticos diretamente nas URLs sem `.html`.

**Prós:**
- ✅ Usa infraestrutura já existente (25 HTMLs prontos)
- ✅ Zero dependência de JS para conteúdo crítico
- ✅ TTFB mínimo (arquivos estáticos)
- ✅ Implementação rápida (apenas configuração)
- ✅ Compatível com qualquer crawler

**Contras:**
- ⚠️ Usuários com JS verão versão simplificada inicialmente
- ⚠️ Necessário manter dois conjuntos de conteúdo sincronizados
- ⚠️ Perda de interatividade na primeira renderização

---

### Solução B: Progressive Enhancement com Hydration

**Conceito:** Servir HTML estático e "hidratar" com React quando JS disponível.

**Prós:**
- ✅ Melhor UX para usuários com JS
- ✅ Conteúdo único para crawlers
- ✅ Uma única fonte de verdade (React)

**Contras:**
- ❌ Requer migração para framework SSR (Next.js, Remix, Astro)
- ❌ Alto esforço de implementação
- ❌ Mudança arquitetural significativa
- ❌ Risco de regressões

---

### Solução C: Prerender com Plugin Vite

**Conceito:** Usar `vite-plugin-prerender` para gerar HTML em build time.

**Prós:**
- ✅ Mantém stack atual (Vite)
- ✅ Automatiza geração de HTML
- ✅ Conteúdo único por rota

**Contras:**
- ⚠️ Requer configuração complexa
- ⚠️ Build time aumenta significativamente
- ⚠️ Dados dinâmicos (imóveis) não são pré-renderizados
- ⚠️ Plugin já está no projeto mas não configurado

---

## 3. Decisão: Solução A (HTML Estático nas URLs Canônicas)

### Justificativa

1. **Infraestrutura pronta:** Os 25 HTMLs já existem com conteúdo único
2. **Baixo risco:** Apenas configuração de servidor, sem mudança de código
3. **Tempo de implementação:** ~2 horas para correção do roteamento
4. **Atende 100% dos requisitos da LiveSEO**

### Trade-offs Aceitos

| Trade-off | Mitigação |
|-----------|-----------|
| UX inicial simplificada | Banner com link para versão completa (já existe no HTML) |
| Dois conjuntos de conteúdo | Script de geração automatizado (`npm run seo:static-pages`) |
| Manutenção dupla | Dados centralizados em `regionContent.ts` e `generate-static-pages.cjs` |

---

## 4. Plano de Implementação

### Fase 1: Corrigir Roteamento (Prioridade ALTA)

#### Passo 1.1: Atualizar `vercel.json`

**Objetivo:** Servir HTMLs estáticos para URLs canônicas.

**Arquivo:** `vercel.json`

**Mudança:**
```json
{
  "cleanUrls": false,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/catalogo/copacabana-rj", "destination": "/catalogo/copacabana-rj.html" },
    { "source": "/catalogo/ipanema-rj", "destination": "/catalogo/ipanema-rj.html" },
    { "source": "/catalogo/leblon-rj", "destination": "/catalogo/leblon-rj.html" },
    { "source": "/catalogo/barra-tijuca-rj", "destination": "/catalogo/barra-tijuca-rj.html" },
    { "source": "/catalogo/botafogo-rj", "destination": "/catalogo/botafogo-rj.html" },
    { "source": "/catalogo/flamengo-rj", "destination": "/catalogo/flamengo-rj.html" },
    { "source": "/catalogo/laranjeiras-rj", "destination": "/catalogo/laranjeiras-rj.html" },
    { "source": "/catalogo/tijuca-rj", "destination": "/catalogo/tijuca-rj.html" },
    { "source": "/catalogo/recreio-rj", "destination": "/catalogo/recreio-rj.html" },
    { "source": "/catalogo/zona-sul-rj", "destination": "/catalogo/zona-sul-rj.html" },
    { "source": "/catalogo/zona-norte-rj", "destination": "/catalogo/zona-norte-rj.html" },
    { "source": "/catalogo/zona-oeste-rj", "destination": "/catalogo/zona-oeste-rj.html" },
    { "source": "/catalogo/niteroi-rj", "destination": "/catalogo/niteroi-rj.html" },
    { "source": "/catalogo/centro-rj", "destination": "/catalogo/centro-rj.html" },
    { "source": "/catalogo/meier-rj", "destination": "/catalogo/meier-rj.html" },
    { "source": "/catalogo/jardins-sp", "destination": "/catalogo/jardins-sp.html" },
    { "source": "/catalogo/pinheiros-sp", "destination": "/catalogo/pinheiros-sp.html" },
    { "source": "/catalogo/moema-sp", "destination": "/catalogo/moema-sp.html" },
    { "source": "/catalogo/itaim-bibi-sp", "destination": "/catalogo/itaim-bibi-sp.html" },
    { "source": "/catalogo/vila-mariana-sp", "destination": "/catalogo/vila-mariana-sp.html" },
    { "source": "/catalogo/zona-sul-sp", "destination": "/catalogo/zona-sul-sp.html" },
    { "source": "/catalogo/zona-oeste-sp", "destination": "/catalogo/zona-oeste-sp.html" },
    { "source": "/catalogo/zona-norte-sp", "destination": "/catalogo/zona-norte-sp.html" },
    { "source": "/catalogo/zona-leste-sp", "destination": "/catalogo/zona-leste-sp.html" },
    { "source": "/catalogo/centro-sp", "destination": "/catalogo/centro-sp.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/catalogo/:path*",
      "headers": [
        { "key": "X-Robots-Tag", "value": "index, follow" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }
      ]
    }
  ]
}
```

**Checkpoint:** Deploy no Vercel e verificar que `/catalogo/copacabana-rj` retorna HTML estático.

---

### Fase 2: Atualizar Meta Descriptions (Prioridade ALTA)

#### Passo 2.1: Atualizar Script de Geração

**Objetivo:** Usar meta descriptions otimizadas do seed da LiveSEO.

**Arquivos a modificar:**
- `scripts/generate-static-pages.cjs`
- `src/data/regionContent.ts`
- `config/seo-pages.json`

**Fonte de dados:** `cataldo_sdd_pack/docs-pré-projeto/SEO/regional_pages_seo_seed.json`

**Exemplo de atualização para Copacabana:**

| Campo | Valor Atual | Valor LiveSEO |
|-------|-------------|---------------|
| Meta Title | "Comprar Apartamento Copacabana: Leilão de Imóveis \| Cataldo Siston" | "Comprar Apartamento Copacabana: leilão de Imóveis \| Cataldo Siston" |
| Meta Description | "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão em Copacabana, Rio de Janeiro." | "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão com até 50% de desconto. Oportunidades únicas na Zona Sul. Confira!" |

#### Passo 2.2: Regenerar HTMLs

```bash
npm run seo:static-pages
```

**Checkpoint:** Verificar que os 25 arquivos foram atualizados com novas meta descriptions.

---

### Fase 3: Criar Novas Páginas Regionais (Prioridade MÉDIA)

#### Passo 3.1: Lista de 20 Novas Páginas a Criar

**Rio de Janeiro (7 novas):**

| # | Região | Slug | Keyword |
|---|--------|------|---------|
| 1 | Lagoa | `lagoa-rj` | comprar apartamento lagoa |
| 2 | Icaraí | `icarai-rj` | imóveis icaraí |
| 3 | Jardim Botânico | `jardim-botanico-rj` | imóveis jardim botânico rj |
| 4 | Região dos Lagos | `regiao-dos-lagos-rj` | imóveis região dos lagos |
| 5 | Região Serrana | `regiao-serrana-rj` | imóveis região serrana rj |
| 6 | Angra dos Reis | `angra-dos-reis-rj` | imóveis angra dos reis |
| 7 | Jacarepaguá | `jacarepagua-rj` | imóveis jacarepaguá |

**São Paulo (13 novas):**

| # | Região | Slug | Keyword |
|---|--------|------|---------|
| 8 | Tatuapé | `tatuape-sp` | imóveis tatuapé |
| 9 | Mooca | `mooca-sp` | comprar apartamento mooca |
| 10 | Perdizes | `perdizes-sp` | comprar apartamento perdizes |
| 11 | Riviera de São Lourenço | `riviera-de-sao-lourenco-sp` | comprar apartamento riviera |
| 12 | Santana | `santana-sp` | comprar apartamento santana |
| 13 | Campo Belo | `campo-belo-sp` | comprar apartamento campo belo |
| 14 | Jardim América | `jardim-america-sp` | comprar apartamento jardim américa |
| 15 | Bela Vista | `bela-vista-sp` | comprar apartamento bela vista |
| 16 | Brooklin | `brooklin-sp` | comprar apartamento brooklin |
| 17 | Pacaembu | `pacaembu-sp` | comprar apartamento pacaembu |
| 18 | Higienópolis | `higienopolis-sp` | comprar apartamento higienópolis |
| 19 | Alto de Pinheiros | `alto-de-pinheiros-sp` | comprar apartamento alto de pinheiros |
| 20 | Ipiranga | `ipiranga-sp` | comprar apartamento ipiranga |

#### Passo 3.2: Adicionar Dados ao Script de Geração

**Arquivo:** `scripts/generate-static-pages.cjs`

Para cada nova região, adicionar:
1. Dados de conteúdo (heroTitle, aboutDescription, neighborhoods, etc.)
2. Meta tags do seed da LiveSEO
3. Regiões relacionadas

#### Passo 3.3: Adicionar ao Supabase (seo_pages)

Inserir registros na tabela `seo_pages` para cada nova região.

#### Passo 3.4: Adicionar ao vercel.json

Incluir rewrites para as 20 novas URLs.

#### Passo 3.5: Gerar HTMLs

```bash
npm run seo:static-pages
```

**Checkpoint:** Verificar que 45 arquivos existem em `public/catalogo/`.

---

### Fase 4: Atualizar Sitemap (Prioridade MÉDIA)

#### Passo 4.1: Verificar URLs no Sitemap

**Arquivo:** `public/sitemap.xml`

**Verificar:**
- URLs devem apontar para `/catalogo/copacabana-rj` (sem `.html`)
- Incluir as 20 novas páginas
- Lastmod deve refletir data de atualização
- Priority adequada para páginas regionais

---

### Fase 5: Validação (Prioridade ALTA)

#### Passo 5.1: Testes Manuais

| Teste | Comando/Ação | Resultado Esperado |
|-------|--------------|-------------------|
| View Source | Acessar URL e ver código-fonte | HTML completo com conteúdo único |
| Curl | `curl -s https://site.com/catalogo/copacabana-rj` | HTML estático (não SPA) |
| JS Off | Desabilitar JS no browser | Página legível com conteúdo da região |
| Google Cache | `cache:site.com/catalogo/copacabana-rj` | Conteúdo indexado corretamente |

#### Passo 5.2: Testes Automatizados

```bash
# Verificar que cada URL retorna HTML único
for region in copacabana-rj ipanema-rj leblon-rj; do
  echo "=== $region ==="
  curl -s "https://sitenew2.vercel.app/catalogo/$region" | grep -o "<h1>.*</h1>"
done
```

**Resultado esperado:** Cada URL deve ter um `<h1>` diferente.

---

## 5. Definition of Done (DoD)

### Critérios de Aceite (conforme LiveSEO)

| Item | Critério | Verificação |
|------|----------|-------------|
| ✅ | Header/Nav visível sem JS | `curl` retorna `<header>` com links |
| ✅ | Banner/Hero com textos únicos | `<h1>` diferente por região |
| ✅ | Seção "Sobre a Região" | `<section>` com descrição única |
| ✅ | Seção de Infos Detalhadas | Bairros, atrações, infraestrutura |
| ✅ | Seção de Casos/Depoimentos | Links para casos de sucesso |
| ✅ | Footer visível | `<footer>` com contato |
| ✅ | Meta tags únicas | `<title>` e `<meta description>` por região |
| ✅ | Canonical correto | `<link rel="canonical">` para URL sem `.html` |
| ✅ | Meta descriptions otimizadas | Usar dados do seed LiveSEO |

### Métricas de Sucesso

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Páginas com conteúdo único (JS off) | 0/25 | 45/45 | 100% |
| Páginas regionais implementadas | 25 | 45 | +20 |
| TTFB médio | ~200ms | ~50ms | < 100ms |
| Tamanho HTML | ~2KB (SPA shell) | ~15KB | < 50KB |

---

## 6. Impacto em Performance

### TTFB (Time to First Byte)

| Cenário | TTFB Atual | TTFB Esperado |
|---------|------------|---------------|
| SPA (index.html) | ~150ms | N/A |
| HTML Estático | N/A | ~30-50ms |

**Melhoria:** ~70% mais rápido para crawlers.

### LCP (Largest Contentful Paint)

| Cenário | LCP Atual | LCP Esperado |
|---------|-----------|--------------|
| SPA (com JS) | ~2.5s | ~2.5s (sem mudança) |
| HTML Estático (sem JS) | N/A | ~0.5s |

---

## 7. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Cache desatualizado | Média | Baixo | Headers de cache configurados |
| Conteúdo dessincronizado | Média | Médio | Script de geração automatizado |
| Regressão em UX | Baixa | Médio | Banner com link para SPA |
| Erro de configuração Vercel | Baixa | Alto | Testes em staging primeiro |
| Dados do seed incompletos | Baixa | Médio | Completar com dados genéricos |

---

## 8. Cronograma Sugerido

### Sprint 1: Correção Urgente (Fase 1 + 2)

| Fase | Atividade | Estimativa |
|------|-----------|------------|
| 1.1 | Atualizar vercel.json | 30 min |
| 2.1 | Atualizar meta descriptions (25 páginas) | 2h |
| 2.2 | Regenerar HTMLs | 15 min |
| 5.1 | Testes e validação | 1h |
| - | Deploy em produção | 30 min |
| **Total Sprint 1** | | **~4h** |

### Sprint 2: Expansão (Fase 3 + 4)

| Fase | Atividade | Estimativa |
|------|-----------|------------|
| 3.1 | Criar dados para 20 novas regiões | 4h |
| 3.2 | Atualizar script de geração | 2h |
| 3.3 | Inserir no Supabase | 1h |
| 3.4 | Atualizar vercel.json | 30 min |
| 3.5 | Gerar HTMLs | 15 min |
| 4.1 | Atualizar sitemap | 30 min |
| 5.1 | Testes e validação | 2h |
| - | Deploy em produção | 30 min |
| **Total Sprint 2** | | **~10h** |

---

## 9. Próximos Passos (Após Validação)

1. **Solicitar reindexação** no Google Search Console
2. **Monitorar** indexação nas próximas 2-4 semanas
3. **Reportar** resultados para LiveSEO
4. **Considerar** migração para SSR/SSG (Next.js) no futuro para unificar código

---

## 10. Alternativa Futura: Migração para Next.js

Se o projeto crescer e a manutenção de dois conjuntos de código se tornar problemática, considerar:

| Framework | Prós | Contras |
|-----------|------|---------|
| **Next.js** | SSR/SSG nativo, App Router, ISR | Migração complexa |
| **Astro** | Excelente para conteúdo estático | Menos suporte a React interativo |
| **Remix** | SSR com React, loaders | Curva de aprendizado |

**Recomendação:** Manter solução atual (HTML estático) até que haja necessidade clara de SSR dinâmico.

---

## Anexo A: Checklist de Implementação

```markdown
## Sprint 1: Correção Urgente

### Fase 1: Roteamento
- [ ] Backup do vercel.json atual
- [ ] Atualizar vercel.json com rewrites específicos
- [ ] Deploy em staging/preview
- [ ] Testar 3 URLs com curl

### Fase 2: Meta Descriptions
- [ ] Importar dados do seed LiveSEO
- [ ] Atualizar generate-static-pages.cjs
- [ ] Atualizar regionContent.ts
- [ ] Executar npm run seo:static-pages
- [ ] Verificar 25 arquivos gerados

### Validação Sprint 1
- [ ] Teste curl em 5 URLs
- [ ] Teste com JS desabilitado no browser
- [ ] Verificar H1 único por página
- [ ] Verificar meta descriptions atualizadas
- [ ] Deploy em produção

## Sprint 2: Expansão

### Fase 3: Novas Páginas
- [ ] Criar dados para 7 novas regiões RJ
- [ ] Criar dados para 13 novas regiões SP
- [ ] Atualizar generate-static-pages.cjs
- [ ] Inserir 20 registros no Supabase (seo_pages)
- [ ] Atualizar vercel.json com 20 novos rewrites
- [ ] Executar npm run seo:static-pages
- [ ] Verificar 45 arquivos em public/catalogo/

### Fase 4: Sitemap
- [ ] Adicionar 20 novas URLs ao sitemap
- [ ] Atualizar lastmod

### Validação Sprint 2
- [ ] Teste curl em todas as 45 URLs
- [ ] Verificar H1 único por página
- [ ] Deploy em produção
- [ ] Solicitar reindexação no GSC
- [ ] Comunicar LiveSEO
```

---

## Anexo B: Dados do Seed LiveSEO

**Arquivo fonte:** `cataldo_sdd_pack/docs-pré-projeto/SEO/regional_pages_seo_seed.json`

### Regiões RJ (22 total)

| Região | Keyword | Meta Title |
|--------|---------|------------|
| Copacabana | comprar apartamento copacabana | Comprar Apartamento Copacabana: leilão de Imóveis \| Cataldo Siston |
| Barra da Tijuca | comprar apartamento barra da tijuca | Comprar Apartamento Barra da Tijuca: leilão e Oportunidades \| Cataldo Siston |
| Tijuca | comprar apartamento tijuca | Comprar Apartamento Tijuca: leilão de Imóveis \| Cataldo Siston |
| Botafogo | comprar apartamento botafogo | Comprar Apartamento Botafogo: leilão de Imóveis \| Cataldo Siston |
| Flamengo | comprar apartamento flamengo | Comprar Apartamento Flamengo: imóveis de Leilão \| Cataldo Siston |
| Recreio dos Bandeirantes | comprar apartamento recreio | Comprar Apartamento Recreio: leilão de Imóveis \| Cataldo Siston |
| Ipanema | comprar apartamento ipanema | Comprar Apartamento Ipanema: leilão de Imóveis \| Cataldo Siston |
| Leblon | comprar apartamento leblon | Comprar Apartamento Leblon: leilão de Alto Padrão \| Cataldo Siston |
| Laranjeiras | imóveis laranjeiras | Imóveis Laranjeiras: apartamentos em Leilão \| Cataldo Siston |
| Lagoa | comprar apartamento lagoa | Comprar Apartamento Lagoa: leilão de Imóveis RJ \| Cataldo Siston |
| Icaraí | imóveis icaraí | Imóveis Icaraí: apartamentos à Venda em leilão \| Cataldo Siston |
| Jardim Botânico | imóveis jardim botânico rj | Imóveis Jardim Botânico RJ: leilão de Casas e Aptos \| Cataldo Siston |
| Niterói | casas à venda em niterói | Casas à venda em Niterói (Leilão) \| Cataldo Siston |
| Região dos Lagos | imóveis região dos lagos | Imóveis Região dos Lagos em Leilão \| Cataldo Siston |
| Região Serrana | imóveis região serrana rj | Imóveis Região Serrana RJ (Leilão) \| Cataldo Siston |
| Angra dos Reis | imóveis angra dos reis | Imóveis Angra dos Reis em Leilão \| Cataldo Siston |
| Zona Sul | comprar apartamento zona sul rj | Comprar Apartamento Zona Sul RJ (Leilão) \| Cataldo Siston |
| Zona Norte | imóveis zona norte rj | Imóveis Zona Norte RJ em Leilão \| Cataldo Siston |
| Jacarepaguá | imóveis jacarepaguá | Imóveis Jacarepaguá em Leilão \| Cataldo Siston |
| Centro | imóveis centro rj | Imóveis Centro RJ em Leilão \| Cataldo Siston |

### Regiões SP (17 total)

| Região | Keyword | Meta Title |
|--------|---------|------------|
| Tatuapé | imóveis tatuapé | Imóveis Tatuapé: apartamentos e Casas em Leilão \| Cataldo Siston |
| Vila Mariana | comprar apartamento vila mariana | Comprar Apartamento Vila Mariana: imóveis de Leilão \| Cataldo Siston |
| Pinheiros | comprar apartamento pinheiros | Comprar Apartamento Pinheiros: leilões de Imóveis \| Cataldo Siston |
| Mooca | comprar apartamento mooca | Comprar Apartamento Mooca: imóveis em Leilão \| Cataldo Siston |
| Perdizes | comprar apartamento perdizes | Comprar Apartamento Perdizes: leilão de Imóveis \| Cataldo Siston |
| Itaim Bibi | comprar apartamento itaim bibi | Comprar Apartamento Itaim Bibi: leilão de Alto Padrão \| Cataldo Siston |
| Riviera de São Lourenço | comprar apartamento riviera | Imóveis e Leilão Riviera de São Lourenço \| Cataldo Siston |
| Moema | comprar apartamento moema | Comprar Apartamento Moema: leilão de Imóveis \| Cataldo Siston |
| Santana | comprar apartamento santana | Comprar Apartamento Santana: leilão na Zona Norte \| Cataldo Siston |
| Campo Belo | comprar apartamento campo belo | Comprar Apartamento Campo Belo: imóveis em Leilão \| Cataldo Siston |
| Jardim América | comprar apartamento jardim américa | Comprar Apartamento Jardim América: leilão SP \| Cataldo Siston |
| Bela Vista | comprar apartamento bela vista | Comprar Apartamento Bela Vista: leilão Centro SP \| Cataldo Siston |
| Brooklin | comprar apartamento brooklin | Comprar Apartamento Brooklin: leilão de Imóveis \| Cataldo Siston |
| Pacaembu | comprar apartamento pacaembu | Comprar Apartamento Pacaembu: leilão de Imóveis \| Cataldo Siston |
| Higienópolis | comprar apartamento higienópolis | Comprar Apartamento Higienópolis: leilão SP \| Cataldo Siston |
| Alto de Pinheiros | comprar apartamento alto de pinheiros | Comprar Apartamento Alto de Pinheiros: leilão \| Cataldo Siston |
| Ipiranga | comprar apartamento ipiranga | Comprar Apartamento Ipiranga: imóveis em Leilão \| Cataldo Siston |
