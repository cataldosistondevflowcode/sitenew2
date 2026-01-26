# SPEC.md — Cataldo Siston | Site Leilões RJ/SP (Webflow + Código)  
_Versão: 1.0 | Data: 2026-01-15_

## 1. Objetivo
Entregar a etapa final do projeto de recriação do site cataldosiston.com.br, garantindo:
- Correções e checklist de **SEO técnico** durante a migração
- **Páginas regionais fixas** (SEO local) com URLs estáveis e filtros aplicados automaticamente
- **Gerenciamento de filtros** (regiões, bairros, cidades) via Supabase + interface de administração
- Ajustes finais de **RD Station**
- Integração com **CMS do Webflow** (menor prioridade, última fase)
- Conexão das páginas criadas por empresa externa quando entregues

## 2. Contexto e restrições
- Prazo estimado: ~2 semanas (pode variar por dependências externas)
- Trabalho já está em andamento (há sistema rodando e documentação do repositório)
- Parte das páginas virão de empresa externa (integração posterior)


## 2.1 Proibições e restrições críticas (NÃO NEGOCIÁVEL)

### PROIBIÇÃO-DB-01 — Não alterar a tabela `imoveis` (produção)
**Motivo:** o site atual já utiliza a tabela `imoveis`. Qualquer alteração estrutural pode quebrar o funcionamento do catálogo.

**É PROIBIDO:**
- `ALTER TABLE imoveis` (adicionar/remover/renomear colunas, alterar tipos)
- `DROP/RENAME` da tabela, colunas, constraints
- Alterar triggers, indexes, policies/RLS da tabela `imoveis`
- Qualquer migração que modifique a estrutura da tabela `imoveis`

**É PERMITIDO:**
- Somente **leituras** (`SELECT`) na tabela `imoveis`
- Criar **novas tabelas**, **views**, **materialized views** ou tabelas auxiliares que **não** alterem `imoveis`

**Se uma necessidade parecer exigir mudança em `imoveis`:**
1) Pare imediatamente.  
2) Proponha alternativas seguras (view/tabela auxiliar/join por chave).  
3) Só executar algo após confirmação explícita do responsável.

### RESTRIÇÃO-DB-02 — Qualquer trabalho de banco deve usar o MCP do Supabase
Antes de escrever query/migration/policy:
1) Inspecionar schema real via **MCP do Supabase** (tabelas, colunas, constraints, RLS).  
2) Somente então implementar.  
Se o schema não puder ser confirmado: **não chutar**.


\1
### Fase 1 — SEO (alta prioridade)
- Corrigir problemas técnicos nas páginas RJ/SP e página “Imóveis em Leilão RJ”
- Implementar controles de indexação durante migração:
  - `robots noindex, follow` temporário
  - Canônicas consistentes (autorreferenciadas e padrão para páginas com filtros)
  - Status codes corretos (2xx em páginas válidas)
- Rodar auditorias: Screaming Frog, Lighthouse/WebPageTest e checagem on-page

### Fase 2 — Páginas regionais fixas (SEO local)
- Criar/ativar ~35 páginas regionais com:
  - URL fixa (slug)
  - Meta title/description/keywords
  - Aplicação automática do filtro ao carregar
- **Regra-chave:** o uso dessas páginas deve “substituir” o filtro dinâmico para as regiões cobertas.

### Fase 3 — Filtro (regiões, bairros e cidades) com dados no Supabase
- Garantir que o filtro mantenha o mesmo comportamento atual
- Refatorar a fonte de dados para vir do Supabase
- Criar módulo de gerenciamento (admin) para o cliente adicionar/editar cidades e bairros

### Fase 4 — RD Station (ajustes finais)
- Ajustes finos em widgets, pop-ups e eventos conforme feedback do cliente/marketing

### Fase 5 — Webflow CMS (menor prioridade / último item)
- Permitir que o cliente edite via CMS:
  - Texto principal (hero)
  - Imagem de fundo (hero)
  - Depoimentos (já existe CMS para depoimentos/vídeos)
- Implementação preferencial via API/integração segura (não expor token no frontend)

## 4. Estado atual do sistema (base técnica)
### 4.1 Stack
- React + TypeScript + Vite
- React Router
- Tailwind + shadcn/ui
- TanStack Query
- Supabase (Postgres + possivelmente Edge Functions)

### 4.2 Componentes-chave existentes (a preservar)
- Sistema de filtros com sincronização por URL (hook)
- Paginação (40 itens por página, configurável)
- Sistema de geração de páginas SEO regionais:
  - `config/seo-pages.json`
  - script `scripts/manage-seo-pages.js`
  - output em `html-static/`

## 5. Requisitos Funcionais (RF)
### RF-01 — SEO / Migração (indexação, canônica, status)
**Descrição:** garantir que o ambiente em migração não seja indexado antes da validação final.  
**Regras:**
1. Todas as páginas devem incluir `meta robots` conforme fase (migração vs produção).
2. Deve existir **apenas 1** canônica por página.
3. Páginas válidas retornam HTTP 2xx.

**Critérios de aceite:**
- RoboTag presente em todas as páginas no ambiente de migração
- Nenhuma URL indexada indevidamente
- Auditoria (Screaming Frog) sem erros críticos

### RF-02 — Correções SEO nas páginas “Imóveis RJ / Imóveis SP / Imóveis em Leilão RJ”
**Descrição:** resolver problemas identificados pela empresa de SEO e enviar para validação.

**Critérios de aceite:**
- Checklist de SEO aplicado
- Empresa de SEO valida as correções (ok)

### RF-03 — Páginas Regionais Fixas (SEO Local)
**Descrição:** para regiões estratégicas, existir uma página fixa que já abre com o filtro aplicado.

**Regras:**
1. Cada página tem um slug único e estável.
2. Deve aplicar filtro automaticamente no carregamento.
3. A página deve ter SEO completo (title/description/keywords/h1).
4. Para as regiões contempladas, o filtro deve direcionar para a URL fixa (substituir filtros dinâmicos).

**Critérios de aceite:**
- 35 páginas configuradas e geradas (ou ao menos o lote definido pelo cliente)
- Links internos apontam para as URLs fixas dessas regiões
- A página abre e mostra imóveis filtrados corretamente

### RF-04 — Conectar sistema de páginas regionais ao filtro atual
**Descrição:** o sistema de geração já existe, mas precisa “conversar” com o filtro do app.

**Regras:**
1. O app deve expor uma API mínima no `window` (ex.: `window.propertyFilter.setFilters`) **ou** outra forma compatível com o script já existente.
2. O script injetado na página gerada deve funcionar de forma determinística (sem race condition).

**Critérios de aceite:**
- Abrir uma página regional e ver o filtro aplicado automaticamente sem falha
- Recarregar a página 10x e o comportamento ser consistente

### RF-05 — Filtros vindos do Supabase + Admin de gerenciamento
**Descrição:** dados de regiões/bairros/cidades devem ser buscados do Supabase e o cliente deve poder gerenciar.

**Regras:**
1. UI do filtro mantém o mesmo comportamento atual.
2. Fonte de dados passa a ser tabelas no Supabase.
3. Admin (protegido por auth) permite CRUD:
   - Cidades
   - Bairros
   - Relacionamento bairro↔zona/região (se aplicável)

**Critérios de aceite:**
- Filtro carrega opções do Supabase
- Alterações feitas no admin aparecem no filtro após refresh
- RLS impede acesso público às rotas/tabelas de admin

### RF-06 — Integração RD Station (eventos, pop-ups, widgets)
**Descrição:** configurar tudo 100% conforme feedback do cliente.

**Critérios de aceite:**
- Eventos principais disparando (form submit, CTA click, etc.)
- Pop-ups e widgets renderizando corretamente
- Não há regressão de performance/SEO por scripts

### RF-07 — Webflow CMS (última fase)
**Descrição:** permitir edição pelo cliente via CMS (escopo editável mínimo).

**Regras:**
1. Conteúdo editável mínimo:
   - Hero text
   - Hero background image
   - Testimonials
2. Token Webflow **não** fica no frontend (usar Edge Function / backend proxy).

**Critérios de aceite:**
- Editor altera conteúdo no Webflow → mudança reflete no site
- Sem exposição de credenciais no bundle

### RF-08 — Integração de páginas externas (quando entregues)
**Descrição:** integrar páginas vindas de empresa externa mantendo SEO base e navegação consistente.

**Critérios de aceite:**
- Rotas funcionando e sem 404
- Layout e header/footer consistentes
- Sem regressões no sistema de busca

### RF-09 — Layout Completo das Páginas Regionais (SEO Local Avançado) ⭐ NOVO
**Descrição:** implementar layout completo das páginas regionais conforme especificação da LiveSEO para otimização de SEO local.

**Origem:** [Tarefa LiveSEO #205270](https://app.liveseo.com.br/projeto/CB742/task/12336/205270/preview?key=RE2Go6ZXGj55Q79q)  
**Prazo:** 30/01/2026  
**Prioridade:** Alta

**Regras:**
1. **Cabeçalho**: H1 correspondente à região + texto introdutório contextualizando a região
2. **Corpo da página**:
   - Descrição da região destacando características gerais
   - Lista de imóveis (já implementado)
   - Carrossel de imóveis relacionados (mesma região ou similares)
3. **CTA de Apoio**: "Não encontrou o que estava procurando? Entre em contato" → Contato/Busca
4. **Conteúdo complementar**: Bairros, atrações, infraestrutura, diferenciais da região
5. **Sobre a empresa**: Seção "Conheça a Cataldo Siston" com apresentação e contato
6. **Prova social**: Casos de sucesso + carrossel de posts do blog
7. **CTA final**: Último CTA de contato reforçando conversão

**Critérios de aceite:**
- Todas as páginas regionais exibem texto introdutório quando disponível
- Descrição da região é exibida quando disponível
- Carrossel de imóveis relacionados funciona corretamente
- CTA de apoio direciona para contato/busca
- Conteúdo complementar é exibido quando disponível
- Seção "Sobre a empresa" presente
- Prova social (casos de sucesso) presente
- CTA final presente
- Estrutura de headings correta (H1 > H2 > H3)
- Validação positiva da empresa de SEO (LiveSEO)

## 6. Requisitos Não-Funcionais (RNF)
- Performance: metas mínimas Lighthouse (definir baseline e melhorar gargalos)
- Segurança: sem segredos no repo; RLS e políticas de acesso
- Confiabilidade: páginas regionais devem aplicar filtro com consistência
- Observabilidade mínima: logs de erros tratados; falhas não quebram página

## 7. Modelo de Dados (proposta mínima)
> Ajustar para o schema real já existente no Supabase.

### 7.1 Tabelas sugeridas (filtros)
- `filter_cities` (estado, cidade, active)
- `filter_neighborhoods` (estado, cidade, bairro, zone?, active)

### 7.2 Tabela para pages SEO (autonomia)
- `seo_pages` (id, estado, regiao, meta_title, meta_description, url_slug, filter_type, filter_value, active, **intro_text**, **region_description**, **region_content**)

### 7.3 Tabelas adicionais para SEO Local (Sprint 6)
- `success_cases` (id, title, description, client_name, client_image_url, property_type, region, is_active, display_order)
- `blog_posts` (id, title, slug, excerpt, featured_image_url, published_at, is_active) — *ou integrar com Webflow CMS*

## 9. Critérios de aceite globais (Definition of Done)
- Build OK + Deploy OK
- Auditoria SEO base concluída
- Páginas regionais do lote ativo funcionando
- **Páginas regionais com layout completo (RF-09) validado pela LiveSEO** ⭐
- Filtro + admin funcionando
- RD Station ok conforme checklist
- Documentação atualizada (SPEC + Roadmap + Test Plan)

## 10. Design System — Padrão Visual Obrigatório ⭐ CRÍTICO

> **DOCUMENTO COMPLETO:** Ver `DESIGN_SYSTEM.md` para especificações detalhadas.

### 10.1 Regra Geral
**TODAS as páginas e componentes do site de imóveis DEVEM seguir o mesmo padrão visual do site principal (Webflow).** O site de imóveis (React) deve ser visualmente **indistinguível** do site institucional (Webflow).

**Documento de referência:** `cataldo_sdd_pack/DESIGN_SYSTEM.md`

### 10.2 Tipografia (OBRIGATÓRIO)

| Elemento | Fonte | Peso | Tamanho | Line-height |
|----------|-------|------|---------|-------------|
| **H1 (Títulos principais)** | `Playfair Display` | 500 | 44px | 1.2 |
| **H2 (Subtítulos)** | `Playfair Display` | 500 | 40px | 1.2 |
| **H3 (Seções)** | `Playfair Display` | 500 | 32px | 1.3 |
| **H4 (Cards/Destaques)** | `Quicksand` | 600 | 24px | 1.4 |
| **Corpo/Texto** | `Quicksand` | 400 | 17.6px | 1.6 |
| **Botões** | `Quicksand` | 600 | 16px | 1 |

**Configuração Tailwind:**
```javascript
fontFamily: {
  'display': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
  'body': ['Quicksand', 'Arial', 'Verdana', 'sans-serif'],
}
```

**Importação das Fontes (obrigatório no index.html):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 10.3 Paleta de Cores (OBRIGATÓRIO) — CORRIGIDO v2.1

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Primary (Dourado)** | `#D68E08` | rgb(214, 142, 8) | CTAs, botões, links, logo "SISTON", destaques |
| **Primary Dark** | `#B87A07` | rgb(184, 122, 7) | Hover de botões primários |
| **Grafite Escuro** | `#191919` | rgb(25, 25, 25) | Texto principal, início de gradientes |
| **Grafite Médio** | `#464646` | rgb(70, 70, 70) | Final de gradientes, cards de destaque |
| **Grafite Claro** | `#3C3C3C` | rgb(60, 60, 60) | Top bar |
| **Cinza Escuro** | `#333333` | rgb(51, 51, 51) | Texto secundário |
| **Branco** | `#FFFFFF` | rgb(255, 255, 255) | Fundo principal, texto em fundos escuros |
| **Off-White** | `#FDFDFD` | rgb(253, 253, 253) | Backgrounds suaves |
| **Bege/Cream** | `#EBE5DE` | rgb(235, 229, 222) | Seções alternadas |
| **Footer** | `#32373C` | rgb(50, 55, 60) | Background do footer |

**Gradiente Grafite (cards de destaque):**
```css
background: linear-gradient(90deg, #191919 0%, #464646 100%);
```

### 10.4 Estilo de Botões

**Botão Primário (CTA):**
- Background: `#D68E08` (dourado)
- Texto: `#FFFFFF` (branco)
- Fonte: `Quicksand`, 600, 16px
- Border-radius: `4px`
- Padding: `12px 24px`
- Hover: `#B87A07` (escurecer 10%)

**Botão Secundário (Outline):**
- Background: transparente
- Border: `2px solid #D68E08`
- Texto: `#D68E08`
- Hover: preencher com `#D68E08`, texto branco

### 10.5 Seções e Backgrounds — CORRIGIDO v2.1

| Tipo de Seção | Background | Texto |
|---------------|------------|-------|
| **Top Bar** | `#3C3C3C` (grafite claro) | Branco |
| **Navbar** | Transparente ou `#FFFFFF` | `#191919` |
| **Hero/Header** | **Imagem de fundo + overlay escuro** | Branco |
| **Cards de Destaque** | Gradiente grafite `#191919 → #464646` | Branco |
| **Conteúdo padrão** | `#FFFFFF` | `#191919` |
| **Seção alternada** | `#EBE5DE` (bege/cream) | `#191919` |
| **Seção destaque** | `#FDFDFD` (off-white) | `#191919` |
| **CTA destacado** | `#D68E08` (dourado) | Branco |
| **Footer** | `#32373C` | Branco/Cinza claro |

### 10.6 Espaçamentos Padrão

- **Container max-width:** 1200px (centralizado)
- **Padding de seção:** `py-16` (64px) ou `py-20` (80px)
- **Gap entre cards:** `gap-6` (24px)
- **Margem entre seções:** `mb-16` (64px)
- **Padding interno de cards:** `p-4` (16px) ou `p-6` (24px)

### 10.7 Estrutura de Páginas Regionais — CORRIGIDO v2.1

```
┌─────────────────────────────────────────────┐
│  TOP BAR (bg: #3C3C3C - grafite claro)      │
├─────────────────────────────────────────────┤
│  NAVBAR (bg: transparente ou #FFFFFF)       │
├─────────────────────────────────────────────┤
│  HERO (imagem + overlay escuro)             │
│  Cards destaque (gradiente grafite)         │
├─────────────────────────────────────────────┤
│  LISTAGEM DE IMÓVEIS (bg: #FFFFFF)          │
├─────────────────────────────────────────────┤
│  CARROSSEL RELACIONADOS (bg: #FDFDFD)       │
├─────────────────────────────────────────────┤
│  CTA DE APOIO (bg: #EBE5DE)                 │
├─────────────────────────────────────────────┤
│  CONTEÚDO COMPLEMENTAR (bg: #FFFFFF)        │
├─────────────────────────────────────────────┤
│  SOBRE A EMPRESA (bg: gradiente grafite)    │
├─────────────────────────────────────────────┤
│  PROVA SOCIAL (bg: #FFFFFF)                 │
├─────────────────────────────────────────────┤
│  CTA FINAL (bg: #D68E08)                    │
├─────────────────────────────────────────────┤
│  FOOTER (bg: #32373C)                       │
└─────────────────────────────────────────────┘
```

### 10.8 Checklist de Consistência Visual

Antes de finalizar qualquer componente/página, verificar:

**Tipografia:**
- [ ] Títulos (H1, H2, H3) usam `Playfair Display`
- [ ] Corpo de texto usa `Quicksand`
- [ ] Tamanhos de fonte seguem a escala definida

**Cores:**
- [ ] Cor primária (dourado) é `#D68E08`
- [ ] Grafite escuro é `#191919`
- [ ] Bege/cream é `#EBE5DE`
- [ ] Texto escuro é `#191919` ou `#333333`
- [ ] Top bar é `#3C3C3C`
- [ ] Footer é `#32373C`

**Botões:**
- [ ] Botões primários têm bg dourado e texto branco
- [ ] Border-radius é 4px
- [ ] Hover states funcionam

**Layout:**
- [ ] Container tem max-width 1200px
- [ ] Espaçamentos são consistentes
- [ ] Seções alternam backgrounds corretamente
- [ ] Hero usa imagem com overlay escuro
- [ ] Cards de destaque usam gradiente grafite

**Comparação Visual:**
- [ ] Página foi comparada com site Webflow
- [ ] Não há elementos "genéricos" ou "AI slop"
- [ ] Design é indistinguível do site institucional

### 10.9 Anti-Padrões (O que NÃO fazer)

❌ **PROIBIDO:**
- Usar fontes genéricas (Inter, Roboto, Arial, system-ui como fonte principal)
- Gradientes roxos ou cores "AI slop"
- Border-radius muito arredondados (> 8px em botões)
- Cores primárias diferentes de `#D68E08`
- Backgrounds cinza genéricos em vez de `#EBE5DE`
- Tipografia toda sans-serif (títulos DEVEM ser serifados)

✅ **OBRIGATÓRIO:**
- Playfair Display para títulos
- Quicksand para corpo
- Dourado `#D68E08` como cor de destaque
- Verde escuro `#265C54` para heroes
- Bege `#EBE5DE` para seções alternadas

### 10.10 Referências Visuais

Páginas de referência para replicar o design:
- **Quem Somos:** https://leilaodeimoveis-cataldosiston.com/escritorio-imobiliario/
- **Casos Reais:** https://leilaodeimoveis-cataldosiston.com/casos-reais/
- **Assessoria em Leilões:** https://leilaodeimoveis-cataldosiston.com/leilao-imoveis-rj/
- **Site de Imóveis (atual):** https://imoveis.leilaodeimoveis-cataldosiston.com/

---

### RF-10 — Correções de Layout Mobile nas Páginas Regionais ⭐ NOVO
**Descrição:** Corrigir problemas de layout e UX identificados na validação QA das páginas regionais, especialmente em dispositivos móveis.

**Origem:** Validação QA das páginas regionais produzidas (2026-01-23)

**Regras:**
1. Nenhum overflow horizontal em telas de 320px a 767px
2. Componentes de navegação (depoimentos, paginação) devem ser responsivos
3. Touch targets devem ter no mínimo 44x44px
4. Layout deve ser consistente em todas as páginas regionais

**Critérios de aceite:**
- [ ] Navegação de depoimentos não causa quebra lateral no mobile
- [ ] Paginação é usável em telas pequenas (sem scroll horizontal)
- [ ] Botões de navegação funcionam corretamente em todos os dispositivos
- [ ] Testado em múltiplos dispositivos (iOS Safari, Android Chrome)

### RF-11 — Fallback para JavaScript Desativado (SEO) ⭐ NOVO
**Descrição:** Implementar conteúdo de fallback para quando JavaScript está desativado, garantindo que crawlers possam indexar conteúdo essencial.

**Regras:**
1. Conteúdo essencial deve estar visível via `<noscript>`
2. Meta tags devem estar no HTML inicial
3. Links de navegação principais devem estar acessíveis

**Critérios de aceite:**
- [ ] Conteúdo básico visível com JavaScript desativado
- [ ] Meta tags presentes no HTML inicial
- [ ] Lighthouse SEO score > 90

### RF-12 — Integração de Casos de Sucesso nas Páginas Regionais ⭐ NOVO
**Descrição:** Adicionar seção de "Casos de Sucesso" antes dos depoimentos nas páginas regionais para reforçar confiança.

**Critérios de aceite:**
- [ ] Seção de Casos de Sucesso presente em todas as páginas regionais
- [ ] Posicionada após CTA de Apoio e antes dos Depoimentos
- [ ] Vídeos do YouTube carregam corretamente

## 11. Riscos / Dependências
- Entrega de páginas por empresa externa (pode atrasar)
- Dependência de validação da empresa de SEO
- Webflow CMS pode estourar escopo (por isso é último)
- Correções de layout mobile podem impactar outros componentes
