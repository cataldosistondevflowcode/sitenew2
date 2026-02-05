# SPEC: CMS v14 — Regionais via CMS (Conteúdo Complementar)

## Metadata
- **Feature ID**: CMS-V14
- **Autor**: SDD Agent
- **Data**: 2026-02-04
- **Status**: Draft
- **Sprint**: CMS v14
- **Base**: `ROADMAP_SPRINTS.md`, `CMS_RASTREAMENTO_COMPLETO.md`

## Resumo

Implementar edição de conteúdo complementar das páginas regionais (textos, CTAs, "sobre a região") via CMS Admin, mantendo a listagem/filtro de imóveis intacta. O CMS deve permitir editar textos introdutórios, descrições de região, conteúdo estruturado (bairros, atrações, infraestrutura) e CTAs sem afetar a funcionalidade de busca de imóveis.

## Problema

Atualmente, as páginas regionais têm:
1. **Conteúdo hardcoded** na tabela `seo_pages` (campos `intro_text`, `region_description`, `region_content`)
2. **Sem controle via Admin CMS** — edições requerem acesso direto ao banco
3. **Inconsistência** — algumas páginas têm conteúdo, outras não
4. **Sem preview** — não há como visualizar alterações antes de publicar

## Solução Proposta

1. **Criar blocos CMS dedicados** para conteúdo regional:
   - `region_intro_text` (richtext) — texto introdutório
   - `region_hero_title` (text) — título H1 customizado
   - `region_hero_desc` (richtext) — descrição do hero
   - `region_content_neighborhoods` (list) — lista de bairros
   - `region_content_attractions` (list) — atrações
   - `region_content_infrastructure` (list) — infraestrutura
   - `region_content_highlights` (list) — diferenciais
   - `region_about_title` (text) — título "Sobre a empresa"
   - `region_about_desc` (richtext) — descrição da empresa
   - `region_cta_text` (text) — texto do CTA final
   - `region_cta_url` (text) — URL do CTA
   - `region_cta_button` (cta) — botão CTA composto

2. **Criar páginas CMS por regional** (ou modelo dinâmico):
   - Opção A: Uma página CMS por slug regional (ex: `imoveis-copacabana`, `imoveis-zona-sul-rj`)
   - Opção B: Modelo base + override por slug (menos granular, mais fácil de manter)
   
3. **Renderizar no StaticCatalog.tsx**:
   - Consumir blocos CMS publicados
   - Fallback seguro: se CMS falhar, usar dados existentes da `seo_pages`

4. **Manter separação total** do domínio de imóveis (regra crítica).

---

## Requisitos Funcionais (RF)

### RF-CMS14-001: Criar página CMS para modelo de regional
- **Descrição**: Criar uma entrada na tabela `cms_pages` que sirva como modelo para páginas regionais
- **Entrada**: Slug `regional-template` ou específico por região
- **Saída**: Página CMS editável com blocos específicos para conteúdo regional
- **Regras**: 
  - Não alterar tabela `imoveis`
  - Não criar FK com `seo_pages`
  - Usar prefixo `region_` para block_keys

### RF-CMS14-002: Criar blocos CMS para conteúdo regional
- **Descrição**: Criar blocos que representem os campos editáveis das páginas regionais
- **Entrada**: Lista de block_keys e tipos (ver seção 4.1)
- **Saída**: Blocos em `cms_blocks` associados à página regional
- **Regras**:
  - Tipos válidos: text, richtext, list, cta
  - Conteúdo JSON segue padrão existente
  - Lista de bairros/atrações usa tipo `list`

### RF-CMS14-003: Renderizar conteúdo CMS no StaticCatalog
- **Descrição**: O componente `StaticCatalog.tsx` deve consumir blocos CMS publicados
- **Entrada**: Slug da página regional (ex: `imoveis-copacabana`)
- **Saída**: Renderização do conteúdo do CMS se existir; fallback para dados da `seo_pages` caso contrário
- **Regras**:
  - Prioridade: CMS publicado > seo_pages > vazio/default
  - Não quebrar página se CMS falhar
  - Manter SEO intacto (metas, H1, canonical)

### RF-CMS14-004: Editor de blocos regionais no Admin
- **Descrição**: Interface para editar blocos regionais no Admin CMS
- **Entrada**: Acesso à rota `/admin/cms/pages/[regional-slug]/edit`
- **Saída**: Editor com todos os blocos configurados
- **Regras**:
  - Reutilizar editores existentes (TextBlockEditor, RichTextBlockEditor, ListBlockEditor, CtaBlockEditor)
  - Preview deve mostrar layout similar ao site público

### RF-CMS14-005: Fallback seguro para CMS indisponível
- **Descrição**: Se CMS falhar ao carregar, página regional continua funcionando
- **Entrada**: Erro de conexão ou dados ausentes no CMS
- **Saída**: Página renderiza com dados da `seo_pages` ou defaults
- **Regras**:
  - Não exibir erro ao usuário público
  - Log de erro para monitoramento
  - Listagem de imóveis NUNCA é afetada

---

## Requisitos Não-Funcionais (NFR)

### NFR-CMS14-001 — Segurança
- RLS em `cms_pages` e `cms_blocks` deve permitir:
  - `anon`: SELECT apenas onde `status = 'published'`
  - `authenticated`: SELECT, INSERT, UPDATE, DELETE (admin)
- Não expor conteúdo draft para usuários públicos
- Preview protegido por autenticação ou token

### NFR-CMS14-002 — Performance
- Query de blocos CMS não deve adicionar mais de 100ms ao carregamento
- Considerar cache de blocos publicados (opcional nesta sprint)
- Não impactar performance do filtro/listagem de imóveis

### NFR-CMS14-003 — Integridade
- Publicar bloco deve ser atômico (usar RPC existente `publish_block_atomic`)
- Versão anterior deve ser salva em `cms_versions`
- Audit log deve registrar todas as edições

### NFR-CMS14-004 — Compatibilidade
- Não alterar tabela `seo_pages` (apenas leitura para fallback)
- Não alterar tabela `imoveis` sob nenhuma circunstância
- Código existente de filtro/paginação deve continuar funcionando

---

## Critérios de Aceite (CA)

### Funcionalidade Core
- [ ] **CA-CMS14-001**: Consigo ver página regional no Admin CMS (`/admin/cms/pages/regional-[slug]/edit`)
- [ ] **CA-CMS14-002**: Consigo editar texto introdutório da regional e salvar como draft
- [ ] **CA-CMS14-003**: Consigo editar lista de bairros/atrações/infraestrutura
- [ ] **CA-CMS14-004**: Consigo editar CTA final da página regional
- [ ] **CA-CMS14-005**: Preview mostra alterações antes de publicar
- [ ] **CA-CMS14-006**: Ao publicar, conteúdo aparece no site público

### Segurança e Fallback
- [ ] **CA-CMS14-007**: Usuário público não vê conteúdo draft
- [ ] **CA-CMS14-008**: Se CMS falhar, página regional continua funcionando (fallback para seo_pages)
- [ ] **CA-CMS14-009**: Listagem de imóveis não é afetada por edições no CMS

### Qualidade
- [ ] **CA-CMS14-010**: SEO (metas, H1, canonical) não degrada após publicação
- [ ] **CA-CMS14-011**: Build (`npm run build`) passa sem erros
- [ ] **CA-CMS14-012**: Audit log registra edições/publicações

---

## Fora do Escopo

1. **Não alterar** tabela `imoveis` ou lógica de filtro/listagem
2. **Não alterar** estrutura da tabela `seo_pages` (apenas leitura)
3. **Não implementar** sincronização automática CMS ↔ seo_pages
4. **Não implementar** CRUD de páginas regionais no CMS (apenas edição de conteúdo)
5. **Não implementar** cache avançado (pode ser sprint futura)
6. **Não alterar** layout/design das páginas regionais (apenas conteúdo)

---

## Dependências

- **Sprint CMS v13 concluída** ✅ (Home 100%)
- **Tabelas CMS existentes** ✅ (`cms_pages`, `cms_blocks`, `cms_versions`, `cms_audit_log`)
- **Componentes de edição** ✅ (TextBlockEditor, RichTextBlockEditor, ListBlockEditor, CtaBlockEditor)
- **Hook useCmsContent** ✅
- **RPC publish_block_atomic** ✅
- **MCP Supabase** para verificar/criar blocos

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar listagem de imóveis | Baixa | Alto | Código CMS totalmente separado; testes manuais obrigatórios |
| Performance degradar com muitas páginas regionais | Média | Médio | Lazy loading; cache opcional; queries otimizadas |
| Inconsistência entre CMS e seo_pages | Média | Baixo | Documentar que CMS tem prioridade; fallback claro |
| Complexidade de gerenciar 25+ páginas regionais | Alta | Médio | Começar com 1 regional (slice); modelo pode ser replicado |

---

## Abordagem: Slice Vertical (1 Regional Completa)

Para esta sprint, implementaremos um **slice vertical completo** com **1 página regional** de ponta a ponta:

1. **Escolha**: `imoveis-copacabana` (RJ, alta visibilidade)
2. **Criar** página CMS + blocos
3. **Renderizar** no StaticCatalog com fallback
4. **Testar** fluxo completo: editar → preview → publicar
5. **Validar** SEO e listagem intacta
6. **Documentar** processo para replicar nas demais regionais

---

## Referências

- `ROADMAP_SPRINTS.md` — Contexto da Sprint v14
- `CMS_RASTREAMENTO_COMPLETO.md` — Mapa de 145 campos (seção 2.8 Regionais)
- `CMS_ADMIN_SPEC.md` — Especificação do Admin CMS
- `.cursor/rules/25-supabase-mcp-safety.mdc` — Regras de segurança de banco
- `.cursor/rules/55-admin-cms.mdc` — Regras do Admin CMS
- `src/pages/StaticCatalog.tsx` — Página atual das regionais
- `src/components/regional/RegionContentSection.tsx` — Componente de conteúdo regional

---

## Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-04 | 1.0 | Criação do documento |

---

_Documento criado seguindo SDD (Spec-Driven Development)._
_Aguardando aprovação antes de implementação._
