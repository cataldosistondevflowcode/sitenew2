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

## Sprint 3: Testes e Validação
**Estimativa: 1 dia**

### Tarefas

#### 3.1 Testes Manuais
- [ ] Testar Copacabana com JS OFF no Chrome
- [ ] Testar Ipanema com JS OFF no Chrome
- [ ] Testar Pinheiros com JS OFF no Chrome
- [ ] Comparar visualmente com versão React
- [ ] Verificar todos os links funcionam
- [ ] Verificar formulário de newsletter

#### 3.2 Testes Automatizados
- [ ] Atualizar `tests/seo-js-off.spec.ts` com novos elementos
- [ ] Adicionar verificação de:
  - Header Superior (email, telefone visíveis)
  - Vídeo institucional (thumbnail presente)
  - Seção Oportunidades
  - CTA "Não encontrou"
  - Ícones na seção "Conheça mais"
  - Thumbnails de vídeo nos Casos de Sucesso
  - Seção Depoimentos
  - Formulário Newsletter
  - Footer completo

#### 3.3 Validação SEO
- [ ] Verificar `<title>` e `<meta description>` únicos
- [ ] Verificar `<link rel="canonical">` correto
- [ ] Verificar estrutura de headings (H1, H2, H3)
- [ ] Verificar Schema.org (se aplicável)
- [ ] Testar com Lighthouse (modo SEO)

### Entregáveis
- Relatório de testes manuais
- Testes Playwright atualizados
- Score Lighthouse SEO > 90

---

## Sprint 4: Deploy e Validação em Produção
**Estimativa: 0.5 dia**

### Tarefas

#### 4.1 Deploy
- [ ] Commit com descrição clara
- [ ] Push para branch main
- [ ] Aguardar deploy Vercel
- [ ] Verificar 3 URLs em produção

#### 4.2 Validação LiveSEO
- [ ] Enviar URLs para validação
- [ ] Documentar feedback
- [ ] Ajustar se necessário

### Entregáveis
- URLs em produção funcionando
- Aprovação da LiveSEO

---

## Sprint 5: Rollout para Todas as Páginas
**Estimativa: 1 dia**

### Tarefas

#### 5.1 Gerar Todas as 37 Páginas
- [ ] Executar `npm run seo:static-pages`
- [ ] Executar `npm run seo:generate-rewrites`
- [ ] Verificar `vercel.json` atualizado

#### 5.2 Validação em Massa
- [ ] Script para verificar todas as 37 URLs
- [ ] Verificar H1 único em cada página
- [ ] Verificar textos "Sobre" diferentes

#### 5.3 Deploy Final
- [ ] Commit final
- [ ] Push para produção
- [ ] Monitorar erros no Vercel

### Entregáveis
- 37 páginas funcionando em produção
- Relatório de validação

---

## Resumo do Cronograma

| Sprint | Descrição | Estimativa |
|--------|-----------|------------|
| 1 | Preparação de Assets e Template Base | 1 dia |
| 2 | Atualizar Template HTML | 2 dias |
| 3 | Testes e Validação | 1 dia |
| 4 | Deploy e Validação em Produção | 0.5 dia |
| 5 | Rollout para Todas as Páginas | 1 dia |
| **Total** | | **5.5 dias** |

---

## Definition of Done (DoD)

### Para cada página regional:

1. **Com JS desativado**, a página exibe:
   - [ ] Header superior completo (email, telefone, WhatsApp, redes)
   - [ ] Header principal com logo e menu 7 itens
   - [ ] Hero com imagem de fundo, H1 único, texto, CTA
   - [ ] Vídeo institucional (thumbnail clicável)
   - [ ] Seção "Oportunidades" com subtítulo, H2, disclaimer
   - [ ] Seção "Sobre [Região]" com texto único
   - [ ] CTA "Não encontrou" com botões e links
   - [ ] Seção "Conheça mais" com 4 colunas e ícones
   - [ ] Casos de Sucesso com 3 thumbnails de vídeo
   - [ ] Depoimentos com texto completo
   - [ ] Newsletter com formulário
   - [ ] Footer completo com 3 colunas e redes sociais
   - [ ] Copyright com links

2. **View Source** contém todo o conteúdo acima em HTML

3. **Comparação visual** com versão React mostra paridade (exceto filtros/listagem)

4. **Testes Playwright** passam

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
