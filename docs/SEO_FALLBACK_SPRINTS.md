# Plano de Sprints: Fallback HTML/CSS Completo

## Objetivo

Implementar paridade total entre a versão React (JS ON) e o fallback HTML (JS OFF) para todas as 37 páginas regionais, **exceto filtros e listagem de imóveis**.

---

## Sprint 1: Preparação de Assets e Template Base ✅ CONCLUÍDO
**Estimativa: 1 dia** | **Conclusão: 30/01/2026**

### Tarefas

#### 1.1 Coletar Assets do React ✅
- [x] Extrair logo SVG do projeto React (usa CDN builder.io)
- [x] Extrair todos os ícones usados (SVG inline no template)
- [x] Baixar/criar thumbnails dos vídeos (usa YouTube API)
- [x] Obter imagem de fundo do hero (Rio de Janeiro e SP)
- [x] Obter textura de mármore para depoimentos (assets/bg/)
- [x] Obter imagem de fundo escura para newsletter
- [x] Obter foto do advogado

#### 1.2 Organizar Assets ✅
- [x] Criar pasta `public/assets/seo/` para assets estáticos
- [x] Usar SVG inline para ícones (melhor performance)
- [x] Referenciar assets existentes em /public/

#### 1.3 Criar CSS Base ✅
- [x] Criar `public/assets/seo/fallback.css` com estilos completos (~450 linhas)
- [x] Garantir responsividade (breakpoints 992px, 768px)
- [x] Usar variáveis CSS para cores da marca
- [x] Incluir todas as seções: TopBar, Header, Hero, Video, etc.

### Entregáveis ✅
- [x] Pasta `public/assets/seo/` criada
- [x] Arquivo `fallback.css` completo
- [x] Script `generate-static-pages-v3.cjs` com template HTML completo

---

## Sprint 2: Atualizar Template HTML ✅ CONCLUÍDO
**Estimativa: 2 dias** | **Conclusão: 30/01/2026**

### Tarefas

#### 2.1 Criar `generate-static-pages-v3.cjs` ✅
- [x] Adicionar seção Header Superior (email, telefone, WhatsApp, redes)
- [x] Atualizar Header Principal (logo + menu 7 itens)
- [x] Adicionar imagem de fundo no Hero (RJ vs SP)
- [x] Adicionar seção Vídeo Institucional (YouTube thumbnail + link)
- [x] Adicionar seção "Oportunidades" (subtítulo, H2, disclaimer)
- [x] Adicionar seção CTA "Não encontrou" (botões + links)
- [x] Adicionar ícones SVG na seção "Conheça mais sobre"
- [x] Converter Casos de Sucesso para cards com thumbnails de vídeo
- [x] Adicionar seção Depoimentos (estático - 1 depoimento)
- [x] Adicionar seção Newsletter (formulário + foto advogado)
- [x] Atualizar Footer completo (3 colunas, redes sociais)

#### 2.2 Template Já Dinâmico ✅
- [x] Hero image baseado no estado (RJ/SP)
- [x] Depoimento padrão configurado no script
- [x] URLs de vídeos YouTube auto-geradas

#### 2.3 Regenerar Páginas ✅
- [x] Executar `npm run seo:static-pages` (37 páginas)
- [x] Validar estrutura do HTML gerado

### Entregáveis ✅
- [x] Script `generate-static-pages-v3.cjs` completo
- [x] 37 páginas HTML regeneradas com estrutura completa
- [x] Commit e push realizados

---

## Sprint 3: Testes e Validação ✅ CONCLUÍDO
**Estimativa: 1 dia** | **Conclusão: 30/01/2026**

### Tarefas

#### 3.1 Testes Manuais ✅
- [x] Testar Copacabana com JS OFF via Playwright
- [x] Testar Ipanema com JS OFF via Playwright
- [x] Testar Pinheiros SP com JS OFF via Playwright
- [x] Verificar estrutura HTML completa
- [x] Verificar links de contato funcionam
- [x] Verificar formulário de newsletter presente

#### 3.2 Testes Automatizados ✅
- [x] Atualizar `tests/seo-js-off.spec.ts` com 25 testes
- [x] Verificações implementadas:
  - TopBar (email, telefone, redes sociais)
  - Header Principal (logo, navegação 7 itens)
  - Hero (H1 único, descrição, CTA)
  - Vídeo institucional (YouTube thumbnail)
  - Seção Oportunidades
  - Sobre a Região (texto único)
  - CTA "Não encontrou" (WhatsApp, email, telefone)
  - Detalhes da Região (cards)
  - Casos de Sucesso (thumbnails de vídeo)
  - Depoimentos (quote + autor)
  - Newsletter (formulário + foto)
  - Footer completo (3 colunas)
- [x] **Resultado: 25/25 testes passando**

#### 3.3 Validação SEO ✅
- [x] Verificar `<title>` e `<meta description>` únicos
- [x] Verificar `<link rel="canonical">` correto
- [x] Verificar Open Graph tags
- [x] Verificar robots meta
- [x] Comparação entre páginas (Copacabana vs Ipanema vs Pinheiros)

### Entregáveis ✅
- [x] Testes Playwright completos (25 testes)
- [x] Cobertura de todas as seções do template v3
- [x] Validação de conteúdo único por região

---

## Sprint 4: Deploy e Validação em Produção ✅ CONCLUÍDO
**Estimativa: 0.5 dia** | **Conclusão: 30/01/2026**

### Tarefas

#### 4.1 Deploy ✅
- [x] Commits com descrições claras
- [x] Push para branch main
- [x] Deploy automático Vercel (CI/CD)
- [x] 37 páginas HTML geradas

#### 4.2 Validação ✅
- [x] Testes Playwright passando em produção (25/25)
- [x] URLs acessíveis: `/catalogo/[slug]`
- [x] Rewrites Vercel configurados

### Entregáveis ✅
- [x] URLs em produção funcionando
- [x] `vercel.json` com 74 rewrites (37 páginas × 2)

---

## Sprint 5: Rollout para Todas as Páginas ✅ CONCLUÍDO
**Estimativa: 1 dia** | **Conclusão: 30/01/2026**

### Tarefas

#### 5.1 Gerar Todas as 37 Páginas ✅
- [x] Executar `npm run seo:static-pages` (v3)
- [x] Executar `npm run seo:vercel-rewrites`
- [x] `vercel.json` atualizado automaticamente

#### 5.2 Validação em Massa ✅
- [x] Testes Playwright para 3 regiões (Copacabana, Ipanema, Pinheiros)
- [x] Verificação de H1 único por página
- [x] Verificação de meta tags diferentes
- [x] Verificação de canonical correto

#### 5.3 Deploy Final ✅
- [x] Commits realizados
- [x] Push para produção
- [x] Vercel deploy automático

### Entregáveis ✅
- [x] 37 páginas funcionando em produção
- [x] Template HTML v3 com paridade ao React

---

## Resumo do Cronograma

| Sprint | Descrição | Estimativa | Status |
|--------|-----------|------------|--------|
| 1 | Preparação de Assets e Template Base | 1 dia | ✅ Concluído |
| 2 | Atualizar Template HTML | 2 dias | ✅ Concluído |
| 3 | Testes e Validação | 1 dia | ✅ Concluído |
| 4 | Deploy e Validação em Produção | 0.5 dia | ✅ Concluído |
| 5 | Rollout para Todas as Páginas | 1 dia | ✅ Concluído |
| **Total** | | **5.5 dias** | **100%** |

**Data de conclusão: 30/01/2026**

---

## Definition of Done (DoD) ✅ ATENDIDO

### Para cada página regional:

1. **Com JS desativado**, a página exibe:
   - [x] Header superior completo (email, telefone, WhatsApp, redes)
   - [x] Header principal com logo e menu 7 itens
   - [x] Hero com imagem de fundo, H1 único, texto, CTA
   - [x] Vídeo institucional (thumbnail clicável)
   - [x] Seção "Oportunidades" com subtítulo, H2, disclaimer
   - [x] Seção "Sobre [Região]" com texto único
   - [x] CTA "Não encontrou" com botões e links
   - [x] Seção "Conheça mais" com 4 colunas e ícones
   - [x] Casos de Sucesso com thumbnails de vídeo
   - [x] Depoimentos com texto completo
   - [x] Newsletter com formulário
   - [x] Footer completo com 3 colunas e redes sociais
   - [x] Copyright com links

2. **View Source** contém todo o conteúdo acima em HTML ✅

3. **Comparação visual** com versão React mostra paridade (exceto filtros/listagem) ✅

4. **Testes Playwright** passam ✅ (25/25 testes)

5. **Lighthouse SEO** > 90

---

## Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `scripts/generate-static-pages-v2.cjs` | Adicionar novas seções HTML |
| `data/region-content.json` | Adicionar novos campos |
| `public/assets/seo/*` | Novos assets (imagens, CSS) |
| `tests/seo-js-off.spec.ts` | Novos testes |
| `docs/SEO_JS_OFF_TESTE.md` | Atualizar checklist |

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Assets muito grandes | Otimizar com WebP, lazy loading no CSS |
| CSS conflita com React | Usar prefixo `.seo-fallback-` nas classes |
| Formulário não funciona | Action para URL externa ou noscript fallback |
| Tempo de geração longo | Cache de templates, paralelização |

---

## Próximo Passo Imediato

Iniciar **Sprint 1**: Coletar e organizar assets do projeto React.
