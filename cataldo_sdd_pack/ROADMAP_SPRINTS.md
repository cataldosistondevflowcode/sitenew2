# ROADMAP_SPRINTS.md — Cataldo Siston | Execução em Sprints
_Data: 2026-01-15_  
_Atualizado: 2026-02-03 (Admin CMS)_  
_Base: prazo estimado ~2 semanas (com dependências externas)._

## Workstreams
- W1) SEO técnico + correções em páginas RJ/SP
- W2) Páginas regionais fixas (SEO local) + "substituição" do filtro dinâmico
- W3) Filtros via Supabase + Admin de gerenciamento
- W4) RD Station (eventos, pop-ups, widgets)
- ~~W5) Webflow CMS~~ → **W5) Admin CMS próprio (tipo WordPress)** ⭐ ATUALIZADO
- W6) Integração de páginas externas (quando chegar)
- **W7) Layout completo páginas regionais (SEO local avançado) — LiveSEO**

---

## Sprint 0 — Setup e entendimento (0,5–1 dia)
**Objetivos**
- Clonar repo, rodar local, validar env vars
- Mapear rotas existentes e scripts de SEO pages
- Mapear schema do Supabase e auth admin

**Entregáveis**
- Ambiente OK
- `DECISIONS.md` preenchido com decisões iniciais

---

## Sprint 1 — SEO migração + correções críticas (2–3 dias)
**Escopo**
- Implementar `noindex, follow` no ambiente de migração
- Padronizar canônicas
- Corrigir problemas técnicos nas páginas:
  - Imóveis RJ
  - Imóveis SP
  - Imóveis em Leilão RJ (se aplicável)

**Entregáveis**
- Checklist SEO técnico aplicado
- Relatório resumido de validação (Screaming Frog + Lighthouse)

---

## Sprint 2 — Páginas regionais fixas (3–4 dias)
**Escopo**
- Revisar `config/seo-pages.json` e scripts `seo:*`
- Garantir que páginas geradas:
  - injetam meta tags corretas
  - aplicam filtros automaticamente
- Conectar páginas regionais ao filtro (garantir `window.propertyFilter` ou equivalente)
- Implementar regra: ao selecionar regiões “mapeadas”, navegar para URL fixa (slug)

**Entregáveis**
- Lote inicial de páginas regionais publicado (ex.: 10–15) + pipeline ok
- UI do filtro redireciona para slug quando aplicável

---

## Sprint 3 — Filtros via Supabase + Admin (3–4 dias)
**Regra crítica:** **não alterar a tabela `imoveis`**. Toda evolução deve ocorrer por **novas tabelas/views**. Antes de qualquer mudança/consulta, **usar MCP do Supabase** para confirmar schema/policies.

**Escopo**
- Implementar queries Supabase para carregar cidades/bairros
- Criar Admin (protegido) para CRUD
- Ajustar/confirmar RLS (se necessário)

**Entregáveis**
- Admin funcional
- Filtro lendo do Supabase sem regressão

---

## Sprint 4 — RD Station + Integrações finais (1–2 dias)
**Escopo**
- Ajustar scripts/widgets/pop-ups conforme feedback
- Implementar e validar eventos principais

**Entregáveis**
- Lista de eventos implementados + evidências

---

## Sprint 5 — ~~Webflow CMS~~ → Admin CMS Próprio ⭐ SUBSTITUÍDO
> **DECISÃO:** Substituído por Admin CMS próprio via Supabase.
> Ver `CMS_ADMIN_SPEC.md` para especificação completa.
> Ver `DECISIONS.md` — DEC-ADM-001 para justificativa.

**Status:** ⏸️ PLANEJADO (após Sprints 6 e 7)

**Escopo geral:**
- Portal admin para edição de conteúdo do site
- Sistema draft → preview → publish
- Biblioteca de mídia
- Versionamento e rollback
- Audit log

**Dividido em sub-sprints incrementais (Ralph Wiggum technique):**
- Sprint CMS v0 → Sprint CMS v4 (ver abaixo)

---

## Sprint 6 — Layout Completo das Páginas Regionais ✅ CONCLUÍDA
**Origem**: [Tarefa LiveSEO #205270](https://app.liveseo.com.br/projeto/CB742/task/12336/205270/preview?key=RE2Go6ZXGj55Q79q)  
**Prazo Original**: 30/01/2026  
**Prioridade**: Alta  
**Status**: ✅ CONCLUÍDA (25 páginas regionais - 15 RJ + 10 SP + Componentes)

**✅ Concluído**
- Layout completo implementado (`StaticCatalog.tsx`)
- Componentes: `RegionContentSection`, `SupportCTA`, `SuccessCasesSection`, `TestimonialsSection`
- **15 páginas regionais RJ**: Copacabana, Ipanema, Leblon, Barra, Zona Sul, Botafogo, Flamengo, Laranjeiras, Tijuca, Recreio, Zona Norte, Zona Oeste, Niterói, Centro, Méier
- **10 páginas regionais SP**: Jardins, Pinheiros, Moema, Itaim Bibi, Vila Mariana, Zona Sul, Zona Oeste, Zona Norte, Zona Leste, Centro
- Texto introdutório, descrição, conteúdo complementar
- Sincronização com Supabase via `npm run seo:sync`
- **✅ Componente `RelatedPropertiesCarousel` implementado** (2026-01-26)
- **✅ Componente `BlogPostsCarousel` implementado** (2026-01-26)

**⏸️ Expansão Futura (Baixa Prioridade)**
- Mais páginas regionais (Jacarepaguá, Ilha do Governador, Região dos Lagos, etc.)

**Entregáveis**
- ✅ 25 páginas regionais funcionando
- ✅ SEO otimizado para cada região
- ✅ Filtros automáticos por região
- ⏸️ Validação da empresa de SEO (LiveSEO)

---

## Sprint 7 — Correções de Layout e UX das Páginas Regionais ✅ CONCLUÍDA
**Origem**: Validação QA das páginas regionais produzidas  
**Data**: 2026-01-23  
**Conclusão**: 2026-01-26  
**Prioridade**: Alta  
**Status**: ✅ CONCLUÍDA

**✅ Concluído**
- ✅ Corrigir overflow horizontal na seção de Depoimentos (mobile)
- ✅ Corrigir overflow horizontal na Paginação (mobile)
- ✅ Alinhar botões de navegação dos depoimentos ao topo (desktop)
- ✅ Integrar seção de Casos de Sucesso nas páginas regionais
- ✅ Implementar fallback `<noscript>` para SEO (componente `NoScriptFallback`)
- ✅ Investigar e corrigir imóveis duplicados na listagem (deduplicação via frontend)

**Entregáveis**
- ✅ Layout mobile sem overflow horizontal
- ✅ Navegação de depoimentos responsiva
- ✅ Paginação usável em telas pequenas
- ✅ Seção de Casos de Sucesso integrada
- ✅ Fallback para JavaScript desativado

---

## Sprints Admin CMS (W5) — Entrega Incremental ⭐ NOVO

> **Documento de especificação:** `CMS_ADMIN_SPEC.md`
> **Decisão:** `DECISIONS.md` — DEC-ADM-001
> **Técnica:** Ralph Wiggum (incrementos mínimos testáveis)
> **Rastreamento completo:** `CMS_RASTREAMENTO_COMPLETO.md` (145 campos por página)
> **Documentos de suporte:**
> - `CMS_RESUMO_EXECUTIVO.md` — Para stakeholders
> - `CMS_GUIA_IMPLEMENTACAO_UX.md` — Passo a passo
> - `CMS_VISUALIZACAO_UX.md` — Fluxo de interações
> - `CMS_INDICE_ARQUIVOS.md` — Navegação por papel
> - `README_CMS_COMPLETO.md` — Visão geral

---

### Sprint CMS v0 — MVP Mínimo (Editar 1 texto + Publicar)
**Status:** ✅ CONCLUÍDA  
**Prioridade:** Alta  
**Dependências:** Sprints 6 e 7 concluídas

**Objetivo:** Editar 1 texto do Home e publicar.

**Escopo:**
- Criar tabelas `cms_pages` e `cms_blocks` no Supabase
- Configurar RLS básico (público lê published, admin lê/escreve tudo)
- Rota `/admin/pages/home/edit` funcional
- Edição de 1 bloco de texto (ex: `hero_title`)
- Botões "Salvar Draft" e "Publicar"
- Home renderiza conteúdo do CMS

**Entregáveis:**
- [x] Migrations aplicadas no Supabase
- [x] RLS configurado e testado
- [x] Editor básico de 1 bloco
- [x] Home lê conteúdo do CMS (via HeroSectionWithCms)

**Critérios de aceite:**
- [x] Edito título do hero da Home
- [x] Salvo como draft (site público não muda)
- [x] Publico (site público atualiza)
- [x] Usuário anônimo não vê draft

---

### Sprint CMS v1 — Blocos por Página + Preview
**Status:** ✅ CONCLUÍDA  
**Prioridade:** Alta  
**Dependências:** Sprint CMS v0

**Objetivo:** Editar múltiplos blocos de uma página específica com preview.

**Escopo:**
- Lista de páginas editáveis (`/admin/pages`)
- Editor de múltiplos blocos por página
- Tipos de bloco: text, richtext, image (URL manual)
- Rota `/preview/[slug]` funcional
- Indicador visual de modo preview

**Entregáveis:**
- [x] Lista de páginas no admin (`/admin/cms`)
- [x] Editor de múltiplos blocos (`/admin/cms/pages/:slug/edit`)
- [x] Preview funcional (`/preview/:slug`)
- [x] Tipos text, richtext, image implementados

**Critérios de aceite:**
- [x] Listo todas as páginas configuradas
- [x] Edito 3+ blocos de uma página
- [x] Preview mostra alterações antes de publicar
- [x] Publicar atualiza todos os blocos

---

### Sprint CMS v2 — Biblioteca de Mídia
**Status:** ✅ CONCLUÍDA  
**Prioridade:** Média  
**Dependências:** Sprint CMS v1

**Objetivo:** Upload e seleção de imagens.

**Escopo:**
- Tabela `cms_assets` criada
- Supabase Storage configurado para bucket CMS
- UI de upload de imagens
- Galeria de imagens na biblioteca
- Seletor de imagem integrado ao editor de blocos

**Entregáveis:**
- [x] Bucket CMS no Supabase Storage
- [x] Tabela `cms_assets` com RLS
- [x] Componente de upload (`AssetUploader`)
- [x] Galeria de imagens (`AssetLibrary`)
- [x] Seletor de imagem no editor (`AssetSelector`)

**Critérios de aceite:**
- [x] Faço upload de imagem (jpg, png, webp)
- [x] Vejo imagens na biblioteca
- [x] Seleciono imagem para bloco
- [x] Alt text é editável

---

### Sprint CMS v8 — UX Zero Fricção
**Status:** ✅ CONCLUÍDA  
**Prioridade:** Alta  
**Dependências:** Sprint CMS v2
**Conclusão:** 2026-02-04

**Objetivo:** Melhorar UX do Admin CMS para máxima usabilidade.

**Escopo:**
- Layout lado-a-lado (editor + preview)
- Blocos colapsáveis
- Atalhos de teclado (Ctrl+S, Ctrl+P)
- ValidationFeedback visual
- BlockStatusIndicator

**Entregáveis:**
- [x] Componente `ValidationFeedback` (error, success, warning, info)
- [x] Componente `BlockStatusIndicator` (tipo, status, ações rápidas)
- [x] Componente `LivePreview` (preview em tempo real)
- [x] Hook `useKeyboardShortcuts` (Ctrl+S, Ctrl+P)
- [x] Layout responsivo lado-a-lado em `AdminCmsPageEdit`
- [x] Atalhos em todos os editores (Text, Image, CTA, List, FAQ)

**Critérios de aceite:**
- [x] Preview ao lado do editor (desktop)
- [x] Blocos expandem/colapsam individualmente
- [x] Ctrl+S salva rascunho
- [x] Ctrl+P publica
- [x] Feedback visual claro de mudanças

**Testes E2E:** 97% sucesso (ver `TESTE_RESULTADOS_CMS_V8.md`)

---

### Sprint CMS v9 — UX Sincronizada + Rastreamento Completo
**Status:** CONCLUIDA  
**Prioridade:** Alta  
**Dependencias:** Sprint CMS v8, v3, v4 (concluidas)  
**Conclusao:** 2026-02-04

**Objetivo:** 
1. Implementar split-view sincronizado com auto-scroll e highlight
2. Rastrear 100% dos campos editaveis (145 campos por 8 paginas)
3. Definir roadmap incrementalizado para 100% de cobertura CMS

**Escopo Fase 1 (Integracao):**
- [x] Componente `SyncedLivePreview.tsx` (auto-scroll + highlight + responsive)
- [x] Hook `useSyncedBlockEditor.ts` (sincronizacao editor - preview)
- [x] Integrar em `AdminCmsPageEdit.tsx`
- [x] Testar: auto-scroll, highlight, toggle de tamanho

**Escopo Fase 2 (Status Bar):**
- [x] `EnhancedEditorStatusBar.tsx` (feedback visual, contador, atalhos)
- [x] Integrar no layout (rodape fixo)
- [x] Testar: validacao contextual

**Escopo Fase 3 (Editores Compostos - PROXIMA SPRINT):**
- [x] `CtaFieldEditor.tsx` (editor composto)
- [ ] `CardListEditor.tsx` (cards com drag-drop) - Sprint v10
- [ ] `StepListEditor.tsx` (passos) - Sprint v10

**Mapa de Cobertura CMS — Baseline (2% de 145 campos):**
- Home: 34 campos (3%)
- Quem Somos: 26 campos (0%)
- Assessoria: 22 campos (0%)
- Direito: 18 campos (0%)
- Casos: 16 campos (0%)
- Blog: 4 campos (0%)
- Contato: 10 campos (0%)
- Regionais: 15 campos (13%)
- **TOTAL: 145 campos (2%)**

**Roadmap para 100% (proximas 3 sprints):**
- Sprint v10: Home -> 25%
- Sprint v11: Quem Somos + Editores compostos -> 50%
- Sprint v12: Regionais + finalizacoes -> 100%

**Documentos de suporte:**
- `CMS_RASTREAMENTO_COMPLETO.md` — Mapa tecnico de 145 campos
- `CMS_GUIA_IMPLEMENTACAO_UX.md` — Passo a passo (Fase 1-3)
- `CMS_VISUALIZACAO_UX.md` — Fluxo de interacoes
- `CMS_RESUMO_EXECUTIVO.md` — Para stakeholders
- `README_CMS_COMPLETO.md` — Visao geral

**Criterios de aceite:**
- [x] Auto-scroll para bloco ativo
- [x] Highlight amarelo no bloco
- [x] Toggle de tamanho (mobile/tablet/desktop)
- [x] Status bar com campo ativo
- [x] Contador de mudancas
- [x] Validacao contextual

---

### Sprint CMS v10 — Completar Home (Editores Compostos)
**Status:** CONCLUIDA  
**Prioridade:** Alta  
**Dependencias:** Sprint CMS v9 (concluida)
**Conclusao:** 2026-02-04

**Objetivo:** Criar editores compostos e expandir cobertura da Home.

**Escopo:**
- [x] Criar 14 blocos novos em `cms_blocks` (via SQL)
- [x] Implementar `CardListEditor` (drag-drop de cards)
- [x] Implementar `StepListEditor` (gerenciar passos)
- [x] Atualizar `CmsBlockRenderer` para renderizar cards/steps
- [x] Testar fluxo completo: editar -> preview -> publicar

**Blocos criados:**
- `hero_subtitle`, `hero_cta_primary`, `hero_cta_secondary`
- `highlight_section_title`, `highlight_cards`
- `how_it_works_title`, `how_it_works_desc`, `how_it_works_steps`
- `about_section_title`, `about_section_desc`, `about_section_image`
- `final_cta_title`, `final_cta_desc`, `final_cta_button`

**Criterios de aceite:**
- [x] 16/34 campos da Home editaveis via CMS (47%)
- [x] CardListEditor com drag-drop funciona
- [x] StepListEditor renumera automaticamente
- [x] Preview mostra cards e steps corretamente
- [x] Build passa sem erros

---

### Sprint CMS v11 — Home publica CMS-driven + Quem Somos (inicio)
**Status:** CONCLUIDA  
**Prioridade:** Alta  
**Dependencias:** Sprint CMS v10 (concluida)  
**Conclusao:** 2026-02-04

**Objetivo:** Consumir CMS no site publico (Home) e iniciar pagina institucional Quem Somos.

**Escopo Home (publica):**
- [x] `HeroSectionWithCms` passou a aplicar blocos do CMS:
  - [x] `hero_title`, `hero_subtitle`, `hero_image`, `hero_cta_primary`, `hero_cta_secondary`
- [x] Inserir secoes institucionais opcionais na Home via `HomeCmsMarketingSections`:
  - [x] `highlight_section_title` + `highlight_cards`
  - [x] `how_it_works_title` + `how_it_works_desc` + `how_it_works_steps`
  - [x] `about_section_title` + `about_section_desc` + `about_section_image`
  - [x] `final_cta_title` + `final_cta_desc` + `final_cta_button`
- [x] Fallback seguro: se CMS falhar, as secoes extras nao quebram a Home

**Escopo Quem Somos (publica):**
- [x] Criar pagina `src/pages/QuemSomos.tsx`
- [x] Adicionar rota publica `/quem-somos` no `App.tsx`
- [x] Publicar `cms_pages.slug='quem-somos'` e criar blocos iniciais via MCP

**Criterios de aceite:**
- [x] Home renderiza hero e secoes do CMS quando publicados
- [x] `/quem-somos` renderiza sem erros e consome blocos publicados
- [x] `npm run build` passa sem erros

---

### Sprint CMS v12 — Paginas institucionais publicas (renderer generico)
**Status:** CONCLUIDA  
**Prioridade:** Media  
**Dependencias:** Sprint CMS v11 (concluida)  
**Conclusao:** 2026-02-04

**Objetivo:** Publicar paginas institucionais consumindo blocos publicados do CMS.

**Escopo (frontend):**
- [x] Componente/pagina reutilizavel `CmsPublicPage` (renderer generico)
- [x] Rotas publicas:
  - [x] `/assessoria`
  - [x] `/direito-imobiliario`
  - [x] `/casos-reais`
  - [x] `/blog`
  - [x] `/contato`

**Escopo (Supabase via MCP):**
- [x] Publicar `cms_pages` dos slugs acima (status='published')
- [x] Inserir blocos iniciais (`page_title`, `page_body`, `page_cta`) por pagina

**Criterios de aceite:**
- [x] Todas as rotas renderizam sem erro
- [x] Blocos publicados aparecem nas paginas
- [x] Fallback seguro quando CMS indisponivel/vazio

### Sprint CMS v3 — Preview Completo + Publish Robusto
**Status:** ✅ CONCLUÍDA  
**Prioridade:** Média  
**Dependências:** Sprint CMS v8
**Conclusão:** 2026-02-04

**Objetivo:** Preview em todas as páginas, publish atômico e validação.

**Escopo:**
- Preview funciona para qualquer página editável
- Token de preview com expiração
- Publish atômico (transação: tudo ou nada)
- Validação de conteúdo antes de publicar
- Mensagens de erro claras

**Entregáveis:**
- [x] Preview universal (7 páginas CMS)
- [x] Token de preview seguro (hook usePreviewToken)
- [x] Publish em transação (função RPC publish_block_atomic)
- [x] Validação de campos obrigatórios

**Critérios de aceite:**
- [x] Preview funciona em 5+ páginas diferentes (testado: 7 páginas)
- [x] Preview sem auth falha ou exige token (CmsPreview.tsx atualizado)
- [x] Simular erro no publish não deixa estado inconsistente (transação RPC)
- [x] Validação impede publicar conteúdo inválido

**Nota:** Botão "Compartilhar Preview" implementado mas requer ajuste fino de RLS para produção.

---

### Sprint CMS v4 — Histórico/Rollback + Audit Log
**Status:** ✅ CONCLUÍDA  
**Prioridade:** Baixa  
**Dependências:** Sprint CMS v3
**Conclusão:** 2026-02-04

**Objetivo:** Versionamento completo e auditoria.

**Escopo:**
- Tabela `cms_versions` para histórico
- Tabela `cms_audit_log` para auditoria
- UI para ver histórico de versões
- Botão "Reverter" para restaurar versão anterior
- UI para ver audit log

**Entregáveis:**
- [x] Tabelas de versão e audit criadas (já existiam; RPC documentada em migration)
- [x] Histórico salvo a cada publish (RPC `publish_block_atomic` grava em `cms_versions`)
- [x] UI de histórico de versões (`BlockVersionHistory` + botão "Histórico" por bloco)
- [x] Rollback funcional (RPC `revert_block_to_version` + hook `useCmsVersions`)
- [x] UI de audit log (página `/admin/cms/audit-log`)

**Critérios de aceite:**
- [x] Vejo histórico de publicações de uma página (por bloco, no editor)
- [x] Reverto para versão anterior (como draft)
- [x] Publico versão revertida (fluxo normal de publicar)
- [x] Vejo log de quem alterou o quê (página Log de Auditoria)

---

### Expansão Futura (Baixa Prioridade)
- Editor WYSIWYG mais avançado (TipTap, Slate)
- Agendamento de publicação (publish at datetime)
- Múltiplos usuários admin com permissões
- Locking de edição (evitar conflitos)
- Comparação visual de versões (diff)
- Integração com analytics (qual conteúdo performa melhor)
