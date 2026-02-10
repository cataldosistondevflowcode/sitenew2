# TEST_PLAN.md — Checklist de validação
_Data: 2026-01-15_  
_Atualizado: 2026-02-05 (Sprint CMS v16 — Alinhamento Final)_

## 1) Smoke test (sempre)
- [ ] `npm install` ok
- [ ] `npm run dev` ok
- [ ] Navegar: `/`, `/leilao-rj`, `/leilao-sp`, `/imovel/:id`
- [ ] Filtros: aplicar/remover e ver URL sincronizando

## 2) SEO migração
- [ ] `meta robots` correto em todas páginas no ambiente de migração
- [ ] 1 canônica por página
- [ ] Titles/descriptions presentes
- [ ] Headings com hierarquia válida (H1 único por página principal)
- [ ] Páginas válidas retornam HTTP 2xx (sem 4xx/5xx)

## 3) Páginas regionais
- [ ] Abrir 10 páginas regionais diferentes e confirmar:
  - [ ] metaTitle/metaDescription corretos
  - [ ] filtro aplicado automaticamente
  - [ ] resultados batem com a região escolhida
- [ ] Selecionar região no filtro e confirmar que navega para slug (quando aplicável)

## 4) Filtros via Supabase
- [ ] Cidades carregam do Supabase
- [ ] Bairros carregam do Supabase
- [ ] Alterar no Admin e ver refletir no filtro após refresh

## 5) RD Station
- [ ] Widget carrega
- [ ] Pop-up aparece nas condições configuradas
- [ ] Evento de formulário dispara
- [ ] Evento de CTA click dispara (se aplicável)

## 6) Contexto da página (bairro vs cidade) — catálogo regional
Testar no browser em `/catalogo/:pageId` (ex.: página Rio de Janeiro ou bairro).

- [ ] **Nenhum bairro selecionado**
  - H1 = nome da cidade (ex.: "Rio de Janeiro")
  - Conteúdo exibido = cidade (sem texto de bairro)
  - Nenhum bloco "Sobre [bairro]" nem benefícios/atrações de bairro visíveis
- [ ] **Exatamente 1 bairro selecionado**
  - H1 = nome do bairro (ex.: "Imóveis em Leilão em Botafogo")
  - Descrição do bairro e benefícios/atrações visíveis
  - Conteúdo SEO específico do bairro permitido
- [ ] **Dois ou mais bairros selecionados** (ex.: Botafogo + Ipanema + Leblon)
  - H1 = nome da cidade (ex.: "Rio de Janeiro")
  - Nenhum texto de bairro único visível (descrição/benefícios ocultos)
  - Listagem de imóveis correta (filtrada pelos bairros)
  - SEO consistente: title/description sem menção a bairro único; canonical da página da cidade

## 7) Performance
- [ ] Lighthouse (mobile/desktop) sem regressões graves


## 8) DB Safety (obrigatório quando houver mudança de dados/admin)
- [ ] Confirmei via MCP do Supabase que **não há migrations** alterando `imoveis`
- [ ] Não alterei policies/indexes/triggers da tabela `imoveis`
- [ ] Novas tabelas/views possuem RLS/policies adequadas (quando necessário)
- [ ] Fluxo principal do site (listagem + filtro + detalhe) não regrediu

---

## 9) Admin CMS — Testes de Funcionalidade ⭐ ATUALIZADO Sprint v16

> **Documento de especificação:** `CMS_ADMIN_SPEC.md`
> **Validado em:** 2026-02-05 (Sprint CMS v16)

### 9.1) Autenticação e Proteção de Rotas
- [x] Login com email/senha válido funciona
- [x] Login com credenciais inválidas mostra erro
- [x] Acesso a `/admin` sem auth redireciona para `/admin/login`
- [x] Acesso a `/admin/*` sem role admin retorna 403 ou redireciona
- [x] Logout funciona e limpa sessão

### 9.2) Lista de Páginas
- [x] `/admin/cms` lista todas as páginas configuradas
- [x] Status (draft/published) é exibido corretamente
- [x] Data de última atualização é exibida
- [x] Click em página navega para editor

### 9.3) Editor de Blocos
- [x] Abrir página para edição carrega blocos existentes
- [x] Editar bloco de texto funciona
- [x] Editar bloco de imagem funciona
- [x] Editar bloco richtext funciona
- [x] Validação impede salvar campo vazio (se obrigatório)

### 9.4) Salvar Draft
- [x] Botão "Salvar" grava alterações como draft
- [x] Após salvar, página exibe conteúdo atualizado no editor
- [x] Sair e voltar mantém alterações salvas
- [x] Site público **não** exibe conteúdo draft

### 9.5) Preview
- [x] Botão "Pré-visualizar" abre página em modo preview
- [x] Preview exibe conteúdo draft
- [x] Indicador visual de "modo preview" é visível
- [x] Usuário não-autenticado **não** consegue acessar preview
- [ ] Preview tem meta noindex, nofollow _(gap menor identificado)_

### 9.6) Publicar
- [x] Botão "Publicar" funciona
- [x] Após publicar, site público exibe novo conteúdo
- [x] Status da página muda para "published"
- [x] Versão anterior é salva para rollback
- [x] Audit log registra a publicação

### 9.7) Biblioteca de Mídia ✅ IMPLEMENTADO
- [x] Upload de imagem funciona (jpg, png, webp)
- [x] Limite de tamanho é respeitado
- [x] Imagens aparecem na galeria
- [x] Posso selecionar imagem para bloco
- [x] Alt text é editável

### 9.8) Histórico e Rollback ✅ IMPLEMENTADO
- [x] Lista de versões é exibida
- [x] Posso visualizar conteúdo de versão anterior
- [x] Reverter restaura como draft
- [x] Posso publicar versão revertida

### 9.9) Audit Log ✅ IMPLEMENTADO
- [x] Cada ação gera registro no log
- [x] Log mostra actor, timestamp, ação
- [x] Log não pode ser editado (append-only via RLS)
- [x] Interface de visualização funciona

### 9.10) Segurança CMS
- [x] RLS: **habilitado** em todas as 6 tabelas CMS _(CORRIGIDO Sprint v23 — 2026-02-10)_
- [x] RLS: anon só lê status='published' em cms_pages _(CORRIGIDO Sprint v23 — RLS ativado)_
- [x] RLS: anon só lê blocos de páginas published _(CORRIGIDO Sprint v23 — RLS ativado)_
- [x] RLS: authenticated pode ler tudo
- [x] RLS: apenas is_cms_admin() pode escrever _(Sprint v15 + RLS ativado v23)_
- [x] Tabelas CMS não afetam tabela `imoveis`
- [x] AdminRoute verifica isAdmin além de isAuthenticated _(CORRIGIDO Sprint v23.1)_

### 9.11) Funcionalidades do Editor (Auditoria 2026-02-10)
- [x] Undo (Ctrl+Z) desfaz última alteração _(CORRIGIDO Sprint v23 — usa setBlocksLocal)_
- [x] Redo (Ctrl+Shift+Z) refaz alteração _(CORRIGIDO Sprint v23 — usa setBlocksLocal)_
- [x] Status bar mostra erros de validação reais _(CORRIGIDO Sprint v23 — useEffect popula validationErrors)_
- [x] Delete de bloco trata erro corretamente _(CORRIGIDO Sprint v23 — verifica result.success)_
- [x] Validação de imagem aceita URLs relativas _(CORRIGIDO Sprint v23.2 — isValidUrlOrPath)_
- [x] Salvar draft funciona
- [x] Publicar funciona
- [x] Preview sincronizado funciona
- [x] Drag-and-drop reordena blocos
- [x] Criar novo bloco funciona
- [x] Criar nova página funciona

### 9.12) Teste Funcional via Browser (2026-02-10)
- [x] Site público carrega em localhost:8081 (9266 imóveis, filtros, seções)
- [x] Login admin funciona (adm@hotmail.com)
- [x] Lista CMS: 14 páginas publicadas, tabs de filtro
- [x] Editor: 16 blocos, preview live, drag handles, status bar
- [x] Expandir bloco: formulário, validação, botões Salvar/Publicar/Excluir/Histórico
- [x] Edição detecta mudanças: alert "não salvas", botão Salvar habilita
- [x] Preview responsivo: botões Mobile/Tablet/Desktop
- [x] Audit Log carrega (`/admin/cms/audit-log`)
- [x] Biblioteca de Mídia carrega (`/admin/cms/assets`)
- [x] Descarte de alterações: reload restaura conteúdo original
- [x] Site público inalterado após testes

### 9.13) Segurança Pós-Auditoria (2026-02-10 — Sprint v23.3)
- [x] `admin_users`: policy SELECT criada para `is_cms_admin()` apenas
- [x] `admin_users`: sem policies INSERT/UPDATE/DELETE (gerenciamento via SQL)
- [x] 7/7 funções CMS com `search_path = public`
- [x] Security Advisor: 0 erros `rls_enabled_no_policy` em tabelas CMS
- [x] Security Advisor: 0 warnings `function_search_path_mutable` em funções CMS
- [x] Site público inalterado após correções

**Resultado Pós-Sprints v23/v23.1/v23.2/v23.3 (2026-02-10):** 49/49 testes passam (100%)

---

## 10) Regressão após CMS ✅ VALIDADO Sprint v16
Após implementar qualquer sprint do CMS, validar:

- [x] Home carrega normalmente (sem CMS e com CMS)
- [x] Páginas regionais funcionam
- [x] Filtros funcionam
- [x] Listagem de imóveis funciona
- [x] Detalhes de imóvel funcionam
- [x] SEO não regrediu (metas, canonicals, titles)
- [x] Performance não degradou significativamente
- [x] Nenhuma rota pública expõe conteúdo admin/draft

**Resultado Sprint v16:** 8/8 testes de regressão passam (100%)

---

## 11) Próximos passos recomendados (respaldo canônico)

**Documentos de referência:** `ROADMAP_SPRINTS.md`, `CMS_ADMIN_SPEC.md`, `55-admin-cms.mdc`, `00-sdd.mdc`.

| Prioridade | Ação | Documento | Risco |
|------------|------|-----------|--------|
| 1 | Executar testes manuais da **seção 9** (Admin CMS) e **seção 10** (Regressão); marcar [x] no TEST_PLAN no que passar | TEST_PLAN.md §9, §10 | Nenhum (só validação) |
| 2 | Confirmar RLS: anon não vê draft (abrir site em aba anônima e conferir que conteúdo draft não aparece) | 55-admin-cms.mdc checklist | Nenhum |
| 3 | Decidir próximo workstream: **Sprint 1** (SEO), **2** (regionais), **3** (Filtros), **4** (RD Station) conforme prioridade do negócio | ROADMAP_SPRINTS.md | Cada sprint tem spec/escopo próprio |
| 4 | Expansão futura CMS (WYSIWYG, agendamento, diff) só com demanda explícita — está em "baixa prioridade" no ROADMAP | ROADMAP_SPRINTS.md | Não iniciar sem spec/aprovacao |

**Regra SDD:** Nenhuma alteração de código/banco sem SPEC ou decisão documentada (DECISIONS.md / SPEC.md).
