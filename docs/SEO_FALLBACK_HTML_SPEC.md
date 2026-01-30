# Especificação: Fallback HTML/CSS para SEO (JS OFF)

**Última atualização:** 30/01/2026  
**Status:** ✅ IMPLEMENTADO E VALIDADO  
**Páginas em conformidade:** 37/37 (100%)

## Objetivo

Garantir que quando JavaScript está desativado, a página regional exiba **exatamente a mesma estrutura, textos, títulos, informações, formulários e componentes** da versão React, com a **única exceção sendo os filtros e listagem de imóveis**.

## Contexto

A LiveSEO identificou que crawlers (Googlebot) não executam JavaScript de forma confiável. Para SEO, o conteúdo crítico deve estar presente no HTML inicial.

---

## ✅ Validação Automatizada

Execute o script de validação para verificar conformidade:

```bash
npm run seo:validate
# ou
node scripts/validate-seo-pages.cjs --verbose
```

### Critérios de Validação

O script verifica automaticamente:

1. **Textos Obrigatórios** (paridade com React)
   - Seção Oportunidades: "OPORTUNIDADES DE IMÓVEIS EM LEILÃO", "Imóveis até 50% abaixo da sua avaliação", "estudo de viabilidade jurídica"
   - CTA: "Não encontrou o que estava procurando?", "Fale Conosco", "Buscar Imóveis"
   - Casos de Sucesso: Títulos dos 3 vídeos reais
   - Depoimentos: Felipe Bueno, PRESIDENTE DA BX CAPITAL
   - Newsletter: "Receba nossa newsletter"
   - Footer: Endereço completo, Mapa do Site

2. **Estruturas HTML Obrigatórias**
   - `.header-topbar` - Top Bar
   - `.header-main` - Header Principal
   - `.hero` - Hero Section
   - `.video-section` - Vídeo
   - `.opportunities-section` - Oportunidades
   - `.about-region` - Sobre a Região
   - `.cta-not-found` - CTA Não Encontrou
   - `.region-details` - Detalhes da Região
   - `.success-cases` - Casos de Sucesso
   - `.testimonials` - Depoimentos
   - `.newsletter` - Newsletter
   - `.footer` - Footer

3. **Meta Tags SEO**
   - `<title>` único por página
   - `<meta name="description">` único
   - `<link rel="canonical">` 

4. **Vídeos de Casos de Sucesso**
   - `nXMiKXmjEOs` - Ipanema/RJ
   - `AH_sNBsqIMg` - Botafogo/RJ
   - `9vziuX_9kxA` - Fonte da Saudade/RJ

---

## Mapeamento: React vs HTML Estático

### ✅ IMPLEMENTADO NO HTML ESTÁTICO (Paridade com React)

| # | Seção | Elementos | Status |
|---|-------|-----------|--------|
| 1 | **Header Superior** | Email, telefone, "Fale Conosco", redes sociais | ✅ |
| 2 | **Header Principal** | Logo + Menu 7 itens | ✅ |
| 3 | **Hero** | Imagem fundo, H1 dinâmico, texto, CTA | ✅ |
| 4 | **Vídeo Institucional** | Thumbnail YouTube + link | ✅ |
| 5 | **Oportunidades** | Subtítulo, H2 "50% abaixo", disclaimer | ✅ |
| 6 | **Sobre a Região** | H2 + texto único | ✅ |
| 7 | **[EXCEÇÃO]** | ~~Filtros de imóveis~~ | N/A |
| 8 | **[EXCEÇÃO]** | ~~Listagem de imóveis~~ | N/A |
| 9 | **CTA "Não encontrou"** | H2, texto, 2 botões, 2 links | ✅ |
| 10 | **Conheça mais** | H2, Grid 4 colunas com ícones | ✅ |
| 11 | **Casos de Sucesso** | 3 vídeos REAIS + botão | ✅ |
| 12 | **Depoimentos** | Texto completo + autor | ✅ |
| 13 | **Newsletter** | Formulário + foto advogado | ✅ |
| 14 | **Footer** | Logo, endereço, Mapa do Site, contato | ✅ |
| 15 | **Copyright** | Texto + links | ✅ |

---

## Arquivos de Implementação

### Scripts de Geração

| Arquivo | Descrição |
|---------|-----------|
| `scripts/generate-static-pages-v3.cjs` | Gerador principal (v3) |
| `scripts/generate-vercel-rewrites.cjs` | Gera rewrites para Vercel |
| `scripts/validate-seo-pages.cjs` | Validador de conformidade |
| `scripts/parse-serps-xlsx.cjs` | Parser da planilha SEO |

### Dados

| Arquivo | Descrição |
|---------|-----------|
| `data/regional_pages_seo_seed.json` | Meta tags SEO (37 regiões) |
| `data/region-content.json` | Conteúdo descritivo (37 regiões) |

### CSS

| Arquivo | Descrição |
|---------|-----------|
| `public/assets/seo/fallback.css` | Estilos do fallback HTML |

### Páginas Geradas

| Diretório | Quantidade |
|-----------|------------|
| `public/catalogo/*.html` | 37 páginas |

---

## Textos Padronizados (Paridade React)

### Seção Oportunidades

```
Subtítulo: OPORTUNIDADES DE IMÓVEIS EM LEILÃO
Título: Imóveis até 50% abaixo da sua avaliação
Texto: Os imóveis em leilão abaixo não foram objeto de análise jurídica prévia. 
       Entenda como funciona o nosso estudo de viabilidade jurídica clicando aqui 
       ou entre em contato conosco
```

### CTA "Não Encontrou"

```
Título: Não encontrou o que estava procurando?
Texto: Entre em contato com nossa equipe especializada ou explore mais opções em nossa busca completa.
Botão 1: Fale Conosco (WhatsApp)
Botão 2: Buscar Imóveis (link para catálogo)
Link 1: Página de Contato (externo)
Link 2: Assessoria em Leilões (externo)
```

### Casos de Sucesso (3 vídeos REAIS)

```
1. Leilão de imóvel | Ipanema/RJ (nXMiKXmjEOs)
2. Leilão de imóvel | Botafogo/RJ (AH_sNBsqIMg)
3. Leilão de imóvel | Fonte da Saudade/RJ (9vziuX_9kxA)
Botão: Veja os nossos resultados
```

### Depoimentos

```
Autor: Felipe Bueno
Cargo: PRESIDENTE DA BX CAPITAL
Texto: [Depoimento completo de ~10 anos de parceria]
```

---

## Comandos NPM

```bash
# Gerar todas as páginas estáticas
npm run seo:static-pages

# Gerar rewrites do Vercel
npm run seo:vercel-rewrites

# Validar conformidade
npm run seo:validate

# Executar testes Playwright
npm run test:seo
```

---

## Checklist de Validação Manual

Para cada página regional, verificar (com JS desativado no Chrome DevTools):

- [x] Header superior com email, telefone, WhatsApp, redes sociais
- [x] Header principal com logo e menu 7 itens
- [x] Hero com imagem de fundo, H1 único, texto, CTA
- [x] Vídeo institucional (thumbnail clicável)
- [x] Seção "Oportunidades" com subtítulo correto, H2 "50% abaixo", disclaimer
- [x] Seção "Sobre [Região]" com texto único
- [x] CTA "Não encontrou" com 2 botões e 2 links
- [x] Seção "Conheça mais sobre [Região]" com 4 colunas e ícones
- [x] Casos de Sucesso com 3 vídeos REAIS (thumbnails YouTube)
- [x] Depoimentos com texto completo de Felipe Bueno
- [x] Newsletter com formulário (Nome, Email, Telefone)
- [x] Footer completo com 3 colunas
- [x] Copyright com ano atual

---

## Dados Dinâmicos por Região

Os seguintes campos são preenchidos do `region-content.json`:

```json
{
  "copacabana-rj": {
    "heroDescription": "Texto do hero...",
    "aboutText": "Texto sobre a região...",
    "neighborhoods": ["Leme", "Copacabana"],
    "attractions": ["Praia de Copacabana", ...],
    "infrastructure": ["Metrô Linha 1", ...],
    "highlights": ["4km de orla", ...],
    "propertyTypes": ["Apartamentos", ...],
    "priceRange": "R$ 400.000 a R$ 3.000.000",
    "transport": "Cardeal Arcoverde, Siqueira Campos, Cantagalo",
    "relatedRegions": ["ipanema-rj", ...]
  }
}
```

---

## Histórico de Validações

| Data | Páginas OK | Erros | Observações |
|------|------------|-------|-------------|
| 30/01/2026 | 37/37 | 0 | Paridade total alcançada |

---

## Próximos Passos

Ver `docs/SEO_FALLBACK_SPRINTS.md` para histórico de implementação.
