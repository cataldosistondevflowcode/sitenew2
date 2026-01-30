# Mapeamento de Colunas: Planilha SERPs → Registry SEO

**Data:** 30/01/2026  
**Arquivo fonte:** `cataldo_sdd_pack/docs-pré-projeto/SEO/SERPs 02 das regiões selecionadas para criação de páginas - Cataldo Siston (1).xlsx`

---

## 1. Estrutura da Planilha Original

### Aba: "Página1"

| # | Coluna Original | Tipo | Exemplo |
|---|-----------------|------|---------|
| A | Estado | String | "RJ", "SP" |
| B | Região / Bairro | String | "Copacabana", "Ipanema" |
| C | Keyword Principal | String | "comprar apartamento copacabana" |
| D | Meta Title (Otimizado) | String | "Comprar Apartamento Copacabana: leilão de Imóveis \| Cataldo Siston" |
| E | Meta Description (Focada em CTR) | String | "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão com até 50% de desconto..." |

---

## 2. Mapeamento para o Registry JSON

### De-Para das Colunas

| Coluna Planilha | Campo JSON | Transformação |
|-----------------|------------|---------------|
| Estado | `estado` | Direto (ex: "RJ") |
| Região / Bairro | `regiao` | Direto (ex: "Copacabana") |
| Keyword Principal | `keyword` | Direto |
| Meta Title (Otimizado) | `metaTitle` | Direto |
| Meta Description (Focada em CTR) | `metaDescription` | Direto |
| — | `slug` | **Gerado automaticamente** |
| — | `cidade` | Vazio (não existe na planilha) |
| — | `searchVolume` | Null (não existe na planilha) |
| — | `sourceSheet` | Nome da aba de origem |

### Geração do Slug

O slug é gerado automaticamente a partir de `regiao` + `estado`:

```javascript
function generateSlug(regiao, estado) {
  const estadoSuffix = estado === 'RJ' ? 'rj' : estado === 'SP' ? 'sp' : estado.toLowerCase();
  
  const regiaoSlug = regiao
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Remove especiais
    .replace(/\s+/g, '-')            // Espaços → hífens
    .trim();
  
  return `${regiaoSlug}-${estadoSuffix}`;
}

// Exemplos:
// "Copacabana" + "RJ" → "copacabana-rj"
// "Barra da Tijuca" + "RJ" → "barra-da-tijuca-rj"
// "Jardim Botânico" + "RJ" → "jardim-botanico-rj"
```

---

## 3. Estrutura do Registry JSON

### Arquivo: `data/regional_pages_seo_seed.json`

```json
{
  "_meta": {
    "generatedAt": "2026-01-30T02:22:56.795Z",
    "sourceFile": "SERPs 02 das regiões selecionadas para criação de páginas - Cataldo Siston (1).xlsx",
    "totalRegions": 37,
    "columnMappings": { ... }
  },
  "regions": [
    {
      "slug": "copacabana-rj",
      "estado": "RJ",
      "cidade": "",
      "regiao": "Copacabana",
      "keyword": "comprar apartamento copacabana",
      "metaTitle": "Comprar Apartamento Copacabana: leilão de Imóveis | Cataldo Siston",
      "metaDescription": "Procura comprar apartamento em Copacabana? Encontre imóveis de leilão com até 50% de desconto...",
      "searchVolume": null,
      "sourceSheet": "Página1"
    },
    // ... mais regiões
  ]
}
```

---

## 4. Campos Adicionais (não na planilha)

Estes campos podem ser adicionados manualmente ou via outra fonte:

| Campo | Descrição | Fonte Sugerida |
|-------|-----------|----------------|
| `cidade` | Cidade da região | Inferir do estado ou adicionar manualmente |
| `searchVolume` | Volume de busca mensal | Google Keyword Planner / SEMrush |
| `aboutText` | Texto "Sobre a região" | Criar manualmente ou via IA |
| `neighborhoods` | Lista de bairros | Dados locais |
| `attractions` | Atrações da região | Dados locais |
| `infrastructure` | Infraestrutura | Dados locais |

---

## 5. Validações Aplicadas

### Durante o Parse

1. **Linhas vazias:** Ignoradas
2. **Região vazia:** Linha ignorada
3. **Duplicatas de slug:** Mantida apenas a primeira ocorrência
4. **Caracteres especiais:** Removidos do slug (acentos, pontuação)

### Duplicatas Encontradas

| Slug | Ocorrências | Ação |
|------|-------------|------|
| `recreio-dos-bandeirantes-rj` | 2 | Mantida primeira |

---

## 6. Estatísticas do Registry

| Métrica | Valor |
|---------|-------|
| Total de regiões | 37 |
| Regiões RJ | 20 |
| Regiões SP | 17 |
| Duplicatas removidas | 1 |

### Por Estado

| Estado | Quantidade | Exemplos |
|--------|------------|----------|
| RJ | 20 | Copacabana, Ipanema, Leblon, Barra da Tijuca... |
| SP | 17 | Pinheiros, Moema, Itaim Bibi, Vila Mariana... |

---

## 7. Script de Geração

### Comando

```bash
node scripts/parse-serps-xlsx.cjs
```

### Arquivo

`scripts/parse-serps-xlsx.cjs`

### Saída

`data/regional_pages_seo_seed.json`

---

## 8. Atualização do Registry

Quando a planilha for atualizada:

1. Substituir o arquivo `.xlsx` na pasta `cataldo_sdd_pack/docs-pré-projeto/SEO/`
2. Executar: `node scripts/parse-serps-xlsx.cjs`
3. Verificar o JSON gerado em `data/regional_pages_seo_seed.json`
4. Regenerar páginas estáticas: `npm run seo:static-pages`
5. Testar com JS desabilitado
6. Commit e deploy

---

## 9. Observações

### Limitações da Planilha Atual

1. **Sem cidade:** A planilha não especifica cidade, apenas estado
2. **Sem volume de busca:** Não há dados de search volume
3. **Sem textos "Sobre":** Meta descriptions são focadas em CTR, não em conteúdo descritivo

### Recomendações

1. Adicionar coluna "Cidade" na planilha para regiões como Niterói, Região dos Lagos
2. Adicionar coluna "Search Volume" para priorização
3. Criar arquivo separado com textos "Sobre a região" para cada slug
