# ROADMAP_SPRINTS.md — Cataldo Siston | Execução em Sprints
_Data: 2026-01-15_  
_Base: prazo estimado ~2 semanas (com dependências externas)._

## Workstreams
- W1) SEO técnico + correções em páginas RJ/SP
- W2) Páginas regionais fixas (SEO local) + "substituição" do filtro dinâmico
- W3) Filtros via Supabase + Admin de gerenciamento
- W4) RD Station (eventos, pop-ups, widgets)
- W5) Webflow CMS (última fase)
- W6) Integração de páginas externas (quando chegar)
- **W7) Layout completo páginas regionais (SEO local avançado) — LiveSEO** ⭐ NOVO

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

## Sprint 5 — Webflow CMS (2–4 dias, se entrar)
**Escopo**
- Definir campos editáveis
- Criar integração segura (Edge Function) e renderizar conteúdo

**Entregáveis**
- Cliente edita hero/depôimentos e vê no site

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
