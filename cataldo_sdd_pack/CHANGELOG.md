# CHANGELOG.md
_Data: 2026-01-27_

## 2026-01-27 (v2.4.1) — Correção Crítica: Bug de Filtro de Data 🐛

### Bug Corrigido
**BUG CRÍTICO:** Páginas regionais exibiam "0 oportunidades encontradas" mesmo com imóveis válidos no banco.

**Causa Raiz:**
- As colunas `data_leilao_1` e `data_leilao_2` são do tipo `DATE` (formato: YYYY-MM-DD)
- O código usava `toISOString()` que gera timestamp completo (ex: `2026-01-27T02:00:32.626Z`)
- A comparação entre tipos diferentes (`DATE` vs `TIMESTAMP`) falhava silenciosamente no Supabase

**Solução:**
- Criado utilitário centralizado `src/utils/dateUtils.ts` com função `getTodayDateString()`
- Todas as comparações de data agora usam formato `YYYY-MM-DD`
- Adicionados comentários explicativos para prevenir regressão

### Arquivos Modificados
- **NOVO:** `src/utils/dateUtils.ts` — Utilitário centralizado para formatação de datas
- `src/pages/StaticCatalog.tsx` — Corrigido filtro de data
- `src/pages/Index.tsx` — Corrigido filtro de data
- `src/pages/LeilaoSP.tsx` — Corrigido filtro de data
- `src/pages/LeilaoRJ.tsx` — Corrigido filtro de data
- `src/pages/LeilaoCaixaRJ.tsx` — Corrigido filtro de data
- `src/components/admin/PropertiesTable.tsx` — Corrigido filtro de data

### Prevenção de Regressão
- Utilitário `getTodayDateString()` deve ser usado em TODAS as comparações com colunas DATE
- Comentários adicionados em cada local corrigido
- Documentação no próprio arquivo `dateUtils.ts` explica o problema e a solução

### Impacto
- ✅ Páginas regionais agora exibem imóveis corretamente
- ✅ Filtros de leilões futuros funcionam em todas as páginas
- ✅ Admin panel filtra corretamente por "Leilões Atuais"

---

## 2026-01-26 (v2.4.0) — Sprint 6 + Sprint 7: CONCLUÍDAS ✅

### Sprint 7 - Correções de Layout/UX

**Correções Implementadas:**
- ✅ Corrigido overflow horizontal na seção Depoimentos (mobile)
  - Adicionado `overflow-hidden` em containers
  - Texto responsivo com `break-words`
  - Altura dinâmica do container mobile
- ✅ Corrigido overflow horizontal na Paginação (mobile)
  - Adicionado `max-w-full` e `overflow-hidden`
  - Flex-wrap para quebra de linha se necessário
- ✅ Alinhados botões de navegação dos depoimentos ao topo (desktop)
  - Usando `self-start` e `mt-4` para alinhamento
- ✅ Implementado fallback `<noscript>` para SEO
  - Criado componente `NoScriptFallback.tsx`
  - Integrado no `StaticCatalog.tsx`
  - Conteúdo estático para crawlers sem JS
- ✅ Deduplicação de imóveis mantida (já existia no código)

### Sprint 6 - Componentes Finalizados

**Componentes Implementados:**
- ✅ `RelatedPropertiesCarousel` - Carrossel de imóveis relacionados
- ✅ `BlogPostsCarousel` - Carrossel de posts do blog institucional

### Arquivos Modificados
- `src/components/testimonials/TestimonialsSection.tsx` - Overflow mobile
- `src/components/testimonials/TestimonialCard.tsx` - Texto responsivo
- `src/components/PropertyPagination.tsx` - Overflow mobile
- `src/components/NoScriptFallback.tsx` - **NOVO** componente
- `src/pages/StaticCatalog.tsx` - Integração NoScriptFallback

### Documentação Atualizada
- `SPRINT6.md` - Status CONCLUÍDA, componentes marcados
- `SPRINT7.md` - Status CONCLUÍDA
- `ROADMAP_SPRINTS.md` - Ambos sprints marcados como concluídos
- `CHANGELOG.md` - Versão 2.4.0

---

## 2026-01-24 (v2.3.0) — Sprint 6: CONCLUÍDA - 25 Páginas Regionais 🎉

### Páginas Regionais Criadas
Implementação completa das páginas regionais conforme escopo original:

**Rio de Janeiro (15 páginas):**
- ✅ Copacabana, Ipanema, Leblon, Barra da Tijuca, Zona Sul (existentes)
- ✅ Botafogo, Flamengo, Laranjeiras, Tijuca, Recreio (novas)
- ✅ Zona Norte, Zona Oeste, Niterói, Centro, Méier (novas)

**São Paulo (10 páginas):**
- ✅ Jardins, Pinheiros, Moema, Itaim Bibi, Vila Mariana
- ✅ Zona Sul, Zona Oeste, Zona Norte, Zona Leste, Centro

### Testes Realizados
- ✅ Botafogo RJ: Página carregando com título e filtro corretos
- ✅ Jardins SP: Página carregando com imagem de São Paulo
- ✅ Zona Leste SP: 2565 imóveis encontrados (filtro funcionando)

### Comandos Executados
```bash
npm run seo:sync  # 20 criadas, 5 atualizadas
```

### Documentos Atualizados
- `config/seo-pages.json` — 25 páginas configuradas
- `SPRINT6.md` — Status CONCLUÍDA
- `ROADMAP_SPRINTS.md` — Sprint 6 marcada como concluída
- `resumo_cliente.md` — Progresso atualizado para 90%

---

## 2026-01-24 (v2.2.2) — Sprint 6: Atualização de Status 📋

### Revisão de Escopo
Após análise dos documentos de pré-projeto (`docs-pré-projeto/`), identificou-se que:

1. **Escopo original**: ~35 regiões (RJ + SP)
2. **Implementado**: 5 páginas (apenas RJ)
3. **Pendente**: ~30 páginas regionais

### Status Atualizado da Sprint 6
- ✅ Layout completo implementado
- ✅ Componentes criados (RegionContentSection, SupportCTA, SuccessCasesSection)
- ✅ 5 páginas RJ: Copacabana, Ipanema, Leblon, Barra da Tijuca, Zona Sul
- ❌ Páginas São Paulo: Nenhuma criada
- ❌ Páginas RJ adicionais: ~15 pendentes

### Documentos Atualizados
- `SPRINT6.md` — Status real e lista de páginas pendentes
- `ROADMAP_SPRINTS.md` — Reflete status parcialmente concluído

### Próximos Passos
1. Criar ~15 páginas regionais RJ (Botafogo, Flamengo, Tijuca, Niterói, etc.)
2. Criar ~10-20 páginas regionais SP (Jardins, Pinheiros, Moema, etc.)
3. Componentes pendentes: `RelatedPropertiesCarousel`, `BlogPostsCarousel`

---

## 2026-01-24 (v2.2.1) — Sprint 7: Testes e Validação ✅

### Validação Realizada
- Testado em viewport mobile (375x812 - iPhone 12/13 Pro)
- Navegação de depoimentos funcionando corretamente
- Seção de Casos de Sucesso visível e funcional
- Nenhum overflow horizontal detectado
- Build de produção concluído com sucesso

### Status
- **Sprint 7 CONCLUÍDA** 

---

## 2026-01-23 (v2.2) — Sprint 7: Correções de Layout e UX 🔧

### Novos Documentos
- **CRIADO:** `SPRINT7.md` — Documentação completa das correções de layout e UX

### Problemas Identificados (Validação QA)
1. **BUG-01 (Crítico):** Conteúdo não renderiza com JavaScript desativado
2. **BUG-02 (Alto):** Navegação de Depoimentos causa quebra lateral no mobile
3. **BUG-03 (Alto):** Paginação causa overflow horizontal no mobile
4. **BUG-04 (Médio):** Botões de navegação mal posicionados (desktop)
5. **MELHORIA-01:** Adicionar seção de Casos de Sucesso
6. **MELHORIA-02:** Imóveis duplicados na listagem

### Correções Implementadas ✅

**Layout Mobile:**
- `TestimonialsSection.tsx`: Layout responsivo com botões abaixo do card no mobile
- `PropertyPagination.tsx`: Paginação compacta com botões de ícone no mobile
- `index.css`: Estilos adicionais para prevenir overflow

**SEO:**
- `index.html`: Fallback `<noscript>` completo com conteúdo, links e estilos

**UX:**
- `StaticCatalog.tsx`: Integração da seção Casos de Sucesso
- `StaticCatalog.tsx`: Deduplicação de imóveis por ID

### Arquivos Modificados
- `src/components/testimonials/TestimonialsSection.tsx`
- `src/components/PropertyPagination.tsx`
- `src/pages/StaticCatalog.tsx`
- `src/index.css`
- `index.html`

### Documentos Atualizados
- `SPEC.md` → Adicionados RF-10, RF-11, RF-12
- `ROADMAP_SPRINTS.md` → Adicionada Sprint 7
- `SPRINT7.md` → Status atualizado para "Implementação Concluída"

### URLs Validadas
- https://sitenew2.vercel.app/catalogo/copacabana-rj
- https://sitenew2.vercel.app/catalogo/ipanema-rj
- https://sitenew2.vercel.app/catalogo/leblon-rj
- https://sitenew2.vercel.app/catalogo/barra-tijuca-rj
- https://sitenew2.vercel.app/catalogo/zona-sul-rj

---

## 2026-01-20 (v2.1) — CORREÇÃO DE CORES 🔧

### ⚠️ Correção Crítica: Paleta de Cores
Após revisão visual do site institucional, foram identificadas **cores incorretas** na versão anterior (v2.0).

**Cores REMOVIDAS (incorretas):**
- ❌ `#265C54` (verde escuro) — **NÃO EXISTE** como cor principal do hero
- ❌ `#404040` (top bar) — Cor incorreta

**Cores CORRIGIDAS:**
- ✅ Top bar: `#3C3C3C` (grafite claro)
- ✅ Hero: **Imagem de fundo + overlay escuro** (não cor sólida)
- ✅ Cards de destaque: **Gradiente grafite** `#191919 → #464646`
- ✅ Footer: `#32373C`
- ✅ Primary (Dourado): `#D68E08` (mantido)
- ✅ Bege/Cream: `#EBE5DE` (mantido)

### Arquivos Atualizados
- `DESIGN_SYSTEM.md` → Versão 2.1 com cores corrigidas
- `SPEC.md` → Seção 10.3, 10.5, 10.7 corrigidas
- `SPRINT6.md` → Estrutura e exemplos de código corrigidos

### Resumo das Alterações

**DESIGN_SYSTEM.md:**
- Removida referência a verde escuro `#265C54`
- Adicionado gradiente grafite para cards de destaque
- Corrigida cor do top bar para `#3C3C3C`
- Corrigida cor do footer para `#32373C`
- Adicionada documentação de hero com imagem + overlay

**SPEC.md:**
- Seção 10.3: Paleta de cores corrigida
- Seção 10.5: Backgrounds por tipo de seção corrigidos
- Seção 10.7: Estrutura de páginas regionais corrigida
- Seção 10.8: Checklist atualizado

**SPRINT6.md:**
- Checklist obrigatório atualizado
- Estrutura da página regional corrigida
- Código de exemplo atualizado com hero usando imagem + overlay

---

## 2026-01-20 (v2.0) — Design System Completo 🎨
- **CRIADO:** `DESIGN_SYSTEM.md` — Documento completo de design system
- **ATUALIZADO:** `SPEC.md` seção 10 — Padrões visuais obrigatórios expandidos
- **ATUALIZADO:** `SPRINT6.md` — Adicionada regra crítica de design

### Descobertas da Análise Visual
Após análise completa dos sites (institucional + Site de imóveis), foram documentados:

**Tipografia (CONFIRMADO ✅):**
- Títulos (H1-H3): `Playfair Display`, 500, 44px/40px/32px
- Corpo: `Quicksand`, 400, 17.6px

**Paleta de Cores (CORRIGIDA em v2.1):**
- Primary (Dourado): `#D68E08` ✅
- ~~Dark Green (Hero): `#265C54`~~ → Removido em v2.1
- Cream (Seções alternadas): `#EBE5DE` ✅
- ~~Neutral 700 (Top bar): `#404040`~~ → Corrigido para `#3C3C3C` em v2.1
- Dark Gray (Texto): `#191919` ✅

---

## 2026-01-15
- Recriado pacote SDD (SPEC + Roadmap + Test Plan + Runbook + Cursor Rules)
- Adicionada restrição global no SPEC: **não alterar `imoveis`** + uso obrigatório do **MCP do Supabase** (2026-01-15).
