# Checklist de Teste: SEO JS-Off para Páginas Regionais

**Data:** 29/01/2026  
**Páginas testadas:** `/catalogo/copacabana-rj` e `/catalogo/ipanema-rj`

---

## 1. Pré-requisitos

- [ ] Deploy realizado no Vercel (ou ambiente de staging)
- [ ] URLs acessíveis: `https://sitenew2.vercel.app/catalogo/copacabana-rj` e `https://sitenew2.vercel.app/catalogo/ipanema-rj`

---

## 2. Teste Manual: Desabilitar JavaScript no Chrome

### Passo a passo:

1. Abra o Chrome DevTools (F12 ou Ctrl+Shift+I)
2. Pressione `Ctrl+Shift+P` para abrir o Command Menu
3. Digite "Disable JavaScript" e selecione a opção
4. Faça um **Hard Reload** (Ctrl+Shift+R)

### Checklist para `/catalogo/copacabana-rj`:

| Item | Esperado | Status |
|------|----------|--------|
| **H1 único** | "Imóveis em Leilão em Copacabana - Rio de Janeiro" | [ ] OK |
| **Meta title** | "Comprar Apartamento Copacabana: leilão de Imóveis \| Cataldo Siston" | [ ] OK |
| **Meta description** | Contém "até 50% de desconto" e "Zona Sul" | [ ] OK |
| **Header/Nav** | Visível com links funcionais (Início, Imóveis, Quem Somos, etc.) | [ ] OK |
| **Hero** | Texto introdutório sobre Copacabana visível | [ ] OK |
| **Seção "Sobre Copacabana"** | Texto único sobre o bairro | [ ] OK |
| **Info Grid** | Bairros, Atrações, Infraestrutura, Diferenciais | [ ] OK |
| **Casos de Sucesso** | 3 cards com exemplos de economia | [ ] OK |
| **Footer** | Visível com links e endereço | [ ] OK |
| **Links internos** | Funcionam (tags `<a>` com href) | [ ] OK |

### Checklist para `/catalogo/ipanema-rj`:

| Item | Esperado | Status |
|------|----------|--------|
| **H1 único** | "Imóveis em Leilão em Ipanema - Rio de Janeiro" | [ ] OK |
| **Meta title** | "Comprar Apartamento Ipanema: leilão de Imóveis \| Cataldo Siston" | [ ] OK |
| **Meta description** | Contém "até 50% de desconto" e "bairro mais desejado" | [ ] OK |
| **Header/Nav** | Visível com links funcionais | [ ] OK |
| **Hero** | Texto introdutório sobre Ipanema visível | [ ] OK |
| **Seção "Sobre Ipanema"** | Texto único sobre o bairro | [ ] OK |
| **Info Grid** | Bairros, Atrações, Infraestrutura, Diferenciais | [ ] OK |
| **Casos de Sucesso** | 3 cards com exemplos de economia | [ ] OK |
| **Footer** | Visível com links e endereço | [ ] OK |
| **Links internos** | Funcionam (tags `<a>` com href) | [ ] OK |

---

## 3. Teste: View Source

### Passo a passo:

1. Acesse a URL no navegador
2. Clique com botão direito → "Exibir código-fonte da página" (ou Ctrl+U)
3. Verifique se o HTML contém os textos regionais

### Verificações:

**Copacabana (`/catalogo/copacabana-rj`):**

```
[ ] <title> contém "Copacabana"
[ ] <meta name="description"> contém "Copacabana"
[ ] <h1> contém "Copacabana"
[ ] Texto "Praia de Copacabana" presente
[ ] Texto "Forte de Copacabana" presente
[ ] Texto "Cardeal Arcoverde" presente (metrô)
```

**Ipanema (`/catalogo/ipanema-rj`):**

```
[ ] <title> contém "Ipanema"
[ ] <meta name="description"> contém "Ipanema"
[ ] <h1> contém "Ipanema"
[ ] Texto "Praia de Ipanema" presente
[ ] Texto "Pedra do Arpoador" presente
[ ] Texto "General Osório" presente (metrô)
```

---

## 4. Teste: curl (linha de comando)

### Comandos:

```bash
# Copacabana
curl -s "https://sitenew2.vercel.app/catalogo/copacabana-rj" | grep -o "<h1>.*</h1>" | head -1

# Esperado: <h1>Imóveis em Leilão em Copacabana - Rio de Janeiro</h1>

# Ipanema
curl -s "https://sitenew2.vercel.app/catalogo/ipanema-rj" | grep -o "<h1>.*</h1>" | head -1

# Esperado: <h1>Imóveis em Leilão em Ipanema - Rio de Janeiro</h1>
```

### Verificar que são diferentes:

```bash
# Comparar H1s
COPA=$(curl -s "https://sitenew2.vercel.app/catalogo/copacabana-rj" | grep -o "<h1>.*</h1>" | head -1)
IPAN=$(curl -s "https://sitenew2.vercel.app/catalogo/ipanema-rj" | grep -o "<h1>.*</h1>" | head -1)

if [ "$COPA" != "$IPAN" ]; then
  echo "✅ H1s são diferentes"
else
  echo "❌ H1s são iguais - PROBLEMA!"
fi
```

---

## 5. Teste: Comparação Ipanema vs Copacabana

### Elementos que DEVEM ser diferentes:

| Elemento | Copacabana | Ipanema |
|----------|------------|---------|
| H1 | "...Copacabana..." | "...Ipanema..." |
| Meta title | "...Copacabana..." | "...Ipanema..." |
| Meta description | "...Zona Sul..." | "...bairro mais desejado..." |
| Hero text | "praia de 4km" | "imortalizada em canção" |
| Sobre | "Forte de Copacabana" | "Pedra do Arpoador" |
| Metrô | "Cardeal Arcoverde, Siqueira Campos, Cantagalo" | "General Osório" |
| Faixa de preço | "R$ 400.000 a R$ 3.000.000" | "R$ 800.000 a R$ 8.000.000" |
| Casos de sucesso | "Posto 5", "Leme" | "Visconde de Pirajá", "Prudente de Morais" |

### Elementos que DEVEM ser iguais:

| Elemento | Valor |
|----------|-------|
| Logo | "Cataldo Siston Advogados" |
| Nav links | Início, Imóveis, Quem Somos, etc. |
| Footer endereço | "Av. Rio Branco, 156..." |
| WhatsApp | "+55 (21) 97729-4848" |

---

## 6. Teste Automatizado: Playwright

### Arquivo: `tests/seo-js-off.spec.ts`

Execute com:

```bash
npx playwright test tests/seo-js-off.spec.ts
```

### Casos de teste:

1. **Copacabana com JS desabilitado:**
   - H1 contém "Copacabana"
   - Header visível
   - Footer visível
   - Seção "Sobre Copacabana" presente

2. **Ipanema com JS desabilitado:**
   - H1 contém "Ipanema"
   - Header visível
   - Footer visível
   - Seção "Sobre Ipanema" presente

3. **Comparação:**
   - H1 de Copacabana ≠ H1 de Ipanema
   - Meta description de Copacabana ≠ Meta description de Ipanema

---

## 7. Critérios de Aceite (Definition of Done)

### Obrigatórios (conforme LiveSEO):

- [ ] **Header/Nav:** Visível sem JS, links funcionais em `<a>`
- [ ] **H1:** Único por região, presente no HTML source
- [ ] **Texto introdutório:** Específico da região
- [ ] **Seção "Sobre":** Conteúdo único por região
- [ ] **Casos de Sucesso:** Lista estática (pode ser sem carrossel)
- [ ] **Footer:** Visível com informações de contato
- [ ] **Meta tags:** Title e description únicos por região
- [ ] **Canonical:** Aponta para URL sem `.html`

### Desejáveis:

- [ ] **Cache headers:** `Cache-Control` configurado
- [ ] **X-Robots-Tag:** `index, follow`
- [ ] **Progressive enhancement:** Banner para versão completa (só com JS)

---

## 8. Resultado dos Testes

### Data: ____/____/____

| Página | JS Off | View Source | curl | Playwright |
|--------|--------|-------------|------|------------|
| `/catalogo/copacabana-rj` | [ ] Pass | [ ] Pass | [ ] Pass | [ ] Pass |
| `/catalogo/ipanema-rj` | [ ] Pass | [ ] Pass | [ ] Pass | [ ] Pass |

### Observações:

```
(Anotar aqui qualquer problema encontrado)
```

### Aprovado por: ________________

### Data de aprovação: ____/____/____

---

## 9. Próximos Passos (após aprovação)

1. [ ] Solicitar reindexação no Google Search Console
2. [ ] Monitorar indexação por 2-4 semanas
3. [ ] Reportar resultados para LiveSEO
4. [ ] Expandir solução para as outras 23 páginas regionais
