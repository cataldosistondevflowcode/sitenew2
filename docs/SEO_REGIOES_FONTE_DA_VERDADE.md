# Fonte da Verdade: Páginas Regionais SEO

**Data:** 30/01/2026  
**Última atualização:** 30/01/2026

---

## 1. Visão Geral

Este documento descreve a arquitetura de dados para as páginas regionais de SEO do site Cataldo Siston.

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FONTE DE VERDADE                               │
│                                                                          │
│  Planilha SERPs (LiveSEO)                                               │
│  cataldo_sdd_pack/docs-pré-projeto/SEO/SERPs...xlsx                     │
│                                                                          │
│  Contém:                                                                 │
│  - Estado, Região, Keyword, Meta Title, Meta Description                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   npm run seo:parse-serps     │
                    │   (parse-serps-xlsx.cjs)      │
                    └───────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           REGISTRY JSON                                  │
│                                                                          │
│  data/regional_pages_seo_seed.json                                      │
│                                                                          │
│  Contém:                                                                 │
│  - slug, estado, regiao, keyword, metaTitle, metaDescription            │
│  - 37 regiões (RJ + SP)                                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │ npm run seo:static-pages  │   │ generate-vercel-rewrites  │
    │ (generate-static-pages-   │   │ (generate-vercel-         │
    │  v2.cjs)                  │   │  rewrites.cjs)            │
    └───────────────────────────┘   └───────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐
    │  public/catalogo/*.html   │   │      vercel.json          │
    │  (37 arquivos)            │   │  (37 rewrites)            │
    └───────────────────────────┘   └───────────────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │         DEPLOY VERCEL         │
                    │                               │
                    │  /catalogo/copacabana-rj      │
                    │  → copacabana-rj.html         │
                    └───────────────────────────────┘
```

---

## 2. Arquivos Principais

### 2.1 Fonte de Verdade (Planilha)

**Caminho:** `cataldo_sdd_pack/docs-pré-projeto/SEO/SERPs 02 das regiões selecionadas para criação de páginas - Cataldo Siston (1).xlsx`

**Responsável:** LiveSEO

**Colunas:**
| Coluna | Descrição |
|--------|-----------|
| Estado | UF (RJ, SP) |
| Região / Bairro | Nome da região |
| Keyword Principal | Palavra-chave alvo |
| Meta Title (Otimizado) | Título para SEO |
| Meta Description (Focada em CTR) | Descrição para SEO |

### 2.2 Registry JSON

**Caminho:** `data/regional_pages_seo_seed.json`

**Gerado por:** `npm run seo:parse-serps`

**Estrutura:**
```json
{
  "_meta": {
    "generatedAt": "2026-01-30T...",
    "sourceFile": "SERPs...xlsx",
    "totalRegions": 37
  },
  "regions": [
    {
      "slug": "copacabana-rj",
      "estado": "RJ",
      "cidade": "",
      "regiao": "Copacabana",
      "keyword": "comprar apartamento copacabana",
      "metaTitle": "Comprar Apartamento Copacabana: leilão de Imóveis | Cataldo Siston",
      "metaDescription": "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão com até 50% de desconto..."
    }
  ]
}
```

### 2.3 HTMLs Estáticos

**Caminho:** `public/catalogo/*.html`

**Gerado por:** `npm run seo:static-pages`

**Quantidade:** 37 arquivos

### 2.4 Configuração Vercel

**Caminho:** `vercel.json`

**Gerado por:** `node scripts/generate-vercel-rewrites.cjs`

---

## 3. Como Editar Títulos e Descrições

### Opção A: Atualizar a Planilha (Recomendado)

1. Solicitar à LiveSEO a atualização da planilha
2. Substituir o arquivo `.xlsx` em `cataldo_sdd_pack/docs-pré-projeto/SEO/`
3. Executar:
   ```bash
   npm run seo:parse-serps
   npm run seo:static-pages
   node scripts/generate-vercel-rewrites.cjs
   ```
4. Commit e deploy

### Opção B: Editar o Registry JSON Diretamente

1. Editar `data/regional_pages_seo_seed.json`
2. Modificar `metaTitle` e/ou `metaDescription` da região desejada
3. Executar:
   ```bash
   npm run seo:static-pages
   ```
4. Commit e deploy

**Atenção:** Edições manuais no JSON serão sobrescritas se a planilha for reprocessada.

---

## 4. Como Adicionar uma Nova Região

### Passo 1: Adicionar na Planilha

Solicitar à LiveSEO a inclusão da nova região na planilha com:
- Estado
- Nome da região
- Keyword principal
- Meta title
- Meta description

### Passo 2: Reprocessar

```bash
# 1. Gerar novo seed a partir da planilha
npm run seo:parse-serps

# 2. Gerar HTMLs estáticos
npm run seo:static-pages

# 3. Atualizar vercel.json com novos rewrites
node scripts/generate-vercel-rewrites.cjs

# 4. (Opcional) Adicionar conteúdo "Sobre a região"
# Editar scripts/generate-static-pages-v2.cjs
# Adicionar entrada em regionContentData
```

### Passo 3: Adicionar Conteúdo "Sobre a Região" (Opcional)

Editar `scripts/generate-static-pages-v2.cjs` e adicionar em `regionContentData`:

```javascript
'nova-regiao-rj': {
  heroDescription: 'Descrição do hero...',
  aboutText: 'Texto sobre a região...',
  neighborhoods: ['Bairro 1', 'Bairro 2'],
  attractions: ['Atração 1', 'Atração 2'],
  infrastructure: ['Metrô', 'Hospital'],
  highlights: ['Destaque 1', 'Destaque 2'],
  propertyTypes: ['Apartamentos', 'Casas'],
  priceRange: 'R$ X a R$ Y',
  transport: 'Informações de transporte',
  relatedRegions: ['regiao-1-rj', 'regiao-2-rj'],
  successCases: [
    { title: 'Caso 1', savings: '40%', description: 'Descrição...' }
  ]
}
```

### Passo 4: Deploy

```bash
git add .
git commit -m "feat(seo): Adiciona página regional [nome-regiao]"
git push
```

---

## 5. Como Garantir que JS-Off Continue OK

### Checklist de Validação

Após qualquer alteração, executar:

```bash
# 1. Regenerar páginas
npm run seo:static-pages

# 2. Executar testes Playwright
npm run test:seo

# 3. Teste manual
# - Abrir Chrome DevTools
# - Ctrl+Shift+P → "Disable JavaScript"
# - Acessar /catalogo/[slug]
# - Verificar H1, textos, header, footer
```

### O que Verificar

| Item | Esperado |
|------|----------|
| H1 | Único por região, contém nome da região |
| Meta title | Único, contém keyword |
| Meta description | Única, focada em CTR |
| Header/Nav | Visível, links funcionais |
| Seção "Sobre" | Texto único (ou placeholder) |
| Footer | Visível com contato |
| Canonical | Aponta para URL sem `.html` |

### Arquitetura JS-Off

```
Usuário/Crawler acessa:  /catalogo/copacabana-rj
                              │
                              ▼
                    ┌─────────────────┐
                    │   vercel.json   │
                    │    rewrite      │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ copacabana-rj   │
                    │    .html        │
                    │ (HTML estático) │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            JS Desabilitado      JS Habilitado
                    │                   │
                    ▼                   ▼
            ┌───────────────┐   ┌───────────────┐
            │ HTML estático │   │ Banner aparece│
            │ renderizado   │   │ "Ver versão   │
            │ (SEO OK)      │   │  completa"    │
            └───────────────┘   └───────────────┘
```

---

## 6. Como Reexportar o Seed (Planilha Atualizada)

Quando a LiveSEO enviar uma nova versão da planilha:

```bash
# 1. Substituir o arquivo .xlsx
# (copiar para cataldo_sdd_pack/docs-pré-projeto/SEO/)

# 2. Reprocessar tudo
npm run seo:parse-serps
npm run seo:static-pages
node scripts/generate-vercel-rewrites.cjs

# 3. Verificar mudanças
git diff data/regional_pages_seo_seed.json

# 4. Testar
npm run test:seo

# 5. Commit
git add .
git commit -m "chore(seo): Atualiza seed com nova planilha SERPs"
git push
```

---

## 7. Configuração de Robots (Staging vs Produção)

### Variável de Ambiente

```bash
# Staging (noindex)
NOINDEX=true npm run seo:static-pages

# Produção (index)
npm run seo:static-pages
```

### Comportamento

| Ambiente | NOINDEX | Meta Robots |
|----------|---------|-------------|
| Produção | não definido | `index, follow` |
| Staging | `true` | `noindex, follow` |

---

## 8. Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Parse SERPs | `npm run seo:parse-serps` | Lê planilha e gera seed JSON |
| Gerar HTMLs | `npm run seo:static-pages` | Gera HTMLs estáticos do seed |
| Gerar Rewrites | `node scripts/generate-vercel-rewrites.cjs` | Atualiza vercel.json |
| Testar SEO | `npm run test:seo` | Executa testes Playwright |

---

## 9. Estrutura de Arquivos

```
cataldo-siston/
├── cataldo_sdd_pack/
│   └── docs-pré-projeto/
│       └── SEO/
│           └── SERPs...xlsx          # Fonte de verdade (planilha)
├── data/
│   └── regional_pages_seo_seed.json  # Registry JSON
├── public/
│   └── catalogo/
│       ├── copacabana-rj.html        # HTMLs estáticos
│       ├── ipanema-rj.html
│       └── ...
├── scripts/
│   ├── parse-serps-xlsx.cjs          # Parser da planilha
│   ├── generate-static-pages-v2.cjs  # Gerador de HTMLs
│   └── generate-vercel-rewrites.cjs  # Gerador de rewrites
├── tests/
│   └── seo-js-off.spec.ts            # Testes Playwright
├── docs/
│   ├── SEO_SERPS_COLUNAS.md          # Mapeamento de colunas
│   ├── SEO_REGIOES_FONTE_DA_VERDADE.md  # Este documento
│   ├── SEO_JS_OFF_DIAGNOSTICO.md     # Diagnóstico do problema
│   ├── SEO_JS_OFF_PLANO.md           # Plano de implementação
│   └── SEO_JS_OFF_TESTE.md           # Checklist de testes
└── vercel.json                       # Configuração de rewrites
```

---

## 10. Contatos

| Responsável | Área | Contato |
|-------------|------|---------|
| LiveSEO | SEO, Planilha SERPs | Augusto Xavier |
| Desenvolvimento | Implementação | Equipe interna |

---

## 11. Histórico de Alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 30/01/2026 | Documento criado | Cursor AI |
| 30/01/2026 | Integração com planilha SERPs | Cursor AI |
