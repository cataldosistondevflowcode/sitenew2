# SPEC: v18 — Correção UI Topo + Navegação Regional

## Metadata
- **Feature ID**: V18-UI-NAV
- **Data**: 2026-02-05
- **Status**: Aprovada
- **Prioridade**: Alta
- **Origem**: Feedback do Lucas (QA interno)

---

## 1. Problema

Dois problemas foram reportados durante validação de QA:

### 1.1. Layout Shift no Topo (UI)
O callout superior (SocialBar) "pisca" e a barra "achata" quando o usuário interage com os ícones de WhatsApp/Instagram. Isso causa:
- Experiência visual ruim (CLS - Cumulative Layout Shift)
- Potencial impacto negativo em Core Web Vitals
- Percepção de instabilidade na interface

### 1.2. Navegação para Páginas Regionais
No catálogo RJ/SP, quando o usuário seleciona APENAS UM bairro/região, ele deveria ser direcionado automaticamente para a página regional correspondente (slug SEO), mas isso não acontece de forma consistente.

**Regra do escopo:** Os slugs das páginas regionais devem SUBSTITUIR os filtros dessas regiões (conforme RF-03 e RF-04 do SPEC.md principal).

---

## 2. Solução Proposta

### 2.1. Correção UI Topo
- Garantir altura fixa/estável do componente SocialBar
- Evitar que hover/click nos ícones cause reflow
- Garantir que ícones tenham dimensões fixas (não dependam de carregamento)
- Remover qualquer transição que altere height/line-height

### 2.2. Navegação Regional Inteligente
Implementar lógica no componente de filtro:
- Se `selectedNeighborhoods.length === 1` E existe página SEO mapeada → navegar para slug regional
- Se `selectedNeighborhoods.length >= 2` → permanecer na página city com filtros aplicados
- Se `selectedNeighborhoods.length === 0` → permanecer na página city padrão

---

## 3. Requisitos Funcionais

### FR-V18-001 — Estabilidade do Layout do Topo
**Descrição**: O componente SocialBar não pode sofrer layout shift ao interagir com seus elementos.

**Regras**:
1. Altura do SocialBar deve ser fixa (min-height definido)
2. Ícones devem ter dimensões explícitas (width/height fixos)
3. Estados de hover não podem alterar dimensões do container
4. Não deve haver flicker/piscar ao interagir
5. **Ícones sociais (Facebook, Instagram, YouTube) devem ser monocromáticos na cor dourada `#C9A227`** — NÃO usar cores originais das marcas
6. Ícones devem ser SVG inline (não imagens externas) para evitar FOUC

**Critérios de aceite**:
- [ ] Interagir com ícones WhatsApp/Instagram NÃO altera altura do header
- [ ] Nenhum elemento "salta" ou "desloca" durante interação
- [ ] CLS (Cumulative Layout Shift) mantido abaixo de 0.1
- [ ] Funciona consistentemente em mobile, tablet e desktop

---

### FR-V18-002 — Navegação Automática para Página Regional (1 bairro)
**Descrição**: Quando o usuário selecionar APENAS UM bairro/região que tenha página SEO mapeada, o sistema deve navegar automaticamente para essa página.

**Regras**:
1. Se `selectedNeighborhoods.length === 1`:
   - Verificar se existe página SEO para esse bairro em `seo_pages`
   - Se existir, usar `router.replace('/catalogo/{page_id}')` para navegar
   - URL deve refletir o slug regional
2. Usar `replace` em vez de `push` para não poluir histórico
3. A navegação deve ocorrer após o usuário clicar em "Buscar" ou equivalente

**Critérios de aceite**:
- [ ] Selecionar "Leblon" no filtro RJ e buscar → navega para `/catalogo/leblon-rj`
- [ ] URL do browser atualiza para o slug regional
- [ ] Listagem mostra apenas imóveis daquele bairro
- [ ] Conteúdo SEO da página regional é exibido

---

### FR-V18-003 — Permanência na Página City (2+ bairros)
**Descrição**: Quando o usuário selecionar DOIS ou mais bairros/regiões, o sistema deve permanecer na página da cidade com filtros aplicados.

**Regras**:
1. Se `selectedNeighborhoods.length >= 2`:
   - NÃO navegar para página regional
   - Manter URL como `/leilao-rj?neighborhood=X,Y` ou similar
   - Aplicar filtro para os múltiplos bairros
2. Não exibir conteúdo específico de um único bairro

**Critérios de aceite**:
- [ ] Selecionar "Leblon" + "Ipanema" → permanece em `/leilao-rj`
- [ ] Filtro mostra imóveis de ambos os bairros
- [ ] Nenhum redirecionamento automático ocorre

---

### FR-V18-004 — Limpar Filtros Retorna ao Estado City
**Descrição**: Ao limpar todos os filtros de bairro, o usuário deve retornar ao estado padrão da página city.

**Regras**:
1. Se `selectedNeighborhoods.length === 0`:
   - Se estiver em página regional, navegar de volta para city
   - Se já estiver em city, permanecer e mostrar todos os imóveis

**Critérios de aceite**:
- [ ] Limpar filtros em `/catalogo/leblon-rj` → volta para `/leilao-rj`
- [ ] Limpar filtros em `/leilao-rj` → permanece em `/leilao-rj`
- [ ] Lista mostra todos os imóveis da cidade

---

## 4. Requisitos Não-Funcionais

### NFR-V18-001 — Performance Visual
- Nenhuma transição deve causar layout shift visível
- Tempo de resposta da navegação < 500ms

### NFR-V18-002 — SEO
- URLs regionais devem ser mantidas para indexação
- Redirecionamentos devem usar status code apropriado (replace = 308)

### NFR-V18-003 — Compatibilidade
- Funcionar em Chrome, Firefox, Safari, Edge (últimas 2 versões)
- Funcionar em iOS Safari e Android Chrome

---

## 5. Fora do Escopo

- Alteração do layout visual das páginas regionais (apenas navegação)
- Novos mapeamentos de páginas SEO (usar existentes)
- Alterações no backend/Supabase
- Testes automatizados Playwright (documentar testes manuais)

---

## 6. Testes Obrigatórios

### 6.1. Teste UI Topo
1. Abrir `/leilao-rj`
2. Hover no ícone WhatsApp → verificar que altura do header não muda
3. Click no ícone Instagram → verificar que nada "pula"
4. Repetir em mobile (viewport 375px)

### 6.2. Teste Navegação Regional
1. Abrir `/leilao-rj`
2. Selecionar APENAS "Leblon" no filtro de bairro
3. Clicar "Buscar"
4. Verificar que URL mudou para `/catalogo/leblon-rj` (ou slug equivalente)
5. Verificar que listagem mostra imóveis de Leblon

### 6.3. Teste Multi-Bairro (sem navegação)
1. Abrir `/leilao-rj`
2. Selecionar "Leblon" + "Ipanema" no filtro
3. Clicar "Buscar"
4. Verificar que permanece em `/leilao-rj`
5. Verificar que filtro está aplicado para ambos os bairros

### 6.4. Teste Limpar Filtros
1. Abrir `/catalogo/leblon-rj`
2. Limpar filtros de bairro
3. Verificar que retorna para `/leilao-rj`

---

## 7. Referências

- `SPEC.md` — RF-03 (Páginas Regionais Fixas), RF-04 (Conectar sistema ao filtro)
- `src/components/SocialBar.tsx` — Componente do topo
- `src/hooks/useSEORedirect.tsx` — Hook de redirecionamento SEO
- `src/pages/LeilaoRJ.tsx` — Página principal RJ

---

_Documento criado seguindo SDD (Spec-Driven Development)._
