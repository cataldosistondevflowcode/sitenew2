# CMS_ADMIN_SPEC.md — Admin CMS do Site (tipo WordPress)
_Versão: 1.0 | Data: 2026-02-03_  
_Status: Draft | Aprovação pendente_

---

## 1. Objetivo

Criar um portal administrativo autenticado onde o cliente pode editar conteúdo do site (textos, imagens, blocos, CTAs, FAQs, banners) com pré-visualização antes de publicar — funcionando como um "WordPress" interno para gerenciamento de conteúdo.

### 1.1 Escopo

**INCLUSO:**
- Editar conteúdo de páginas do site (Home, Quem Somos, Assessoria, Direito Imobiliário, Casos Reais, Blog, Contato)
- Editar conteúdo das páginas regionais (quando aplicável)
- Sistema draft → preview → publish
- Versionamento simples com rollback (mínimo 1 nível)
- Biblioteca de mídia para imagens
- Audit log básico

**EXCLUÍDO (fora do escopo):**
- Alterar layout/design do site
- Modificar funcionalidades core (busca, filtros, listagem de imóveis)
- Alterar páginas RJ/SP ou lógica de SEO
- Alterar tabela `imoveis` ou dados de imóveis

### 1.2 Decisão de Arquitetura

> **DECISÃO FIXA:** Implementar Admin próprio via Supabase (não usar Webflow CMS).
> Ver `DECISIONS.md` — DEC-ADM-001

---

## 2. Requisitos Funcionais (FR)

### FR-ADM-001 — Autenticação de Admin
**Descrição:** O portal admin deve exigir autenticação (login/senha) para acesso.

**Regras:**
1. Usar sistema de auth existente (`useAuth`)
2. Apenas usuários com role "admin" podem acessar
3. Sessão deve expirar após período de inatividade

**Critérios de aceite:**
- [ ] Login com email/senha funciona
- [ ] Usuário sem role "admin" é redirecionado
- [ ] Logout funciona corretamente

---

### FR-ADM-002 — Proteção de Rotas /admin/*
**Descrição:** Todas as rotas `/admin/*` devem ser protegidas e inacessíveis para usuários não autenticados ou não-admin.

**Regras:**
1. Middleware/guard de rota verifica autenticação
2. Retorna 403 ou redirect para login se não autorizado
3. URLs de preview também devem ser protegidas ou usar token temporário

**Critérios de aceite:**
- [ ] Acesso direto a `/admin` sem auth redireciona para `/admin/login`
- [ ] Usuário comum (não-admin) recebe 403
- [ ] Headers de cache impedem vazamento de conteúdo admin

---

### FR-ADM-003 — Listar Páginas Editáveis
**Descrição:** O admin deve ver uma lista de todas as páginas do site que podem ser editadas.

**Regras:**
1. Exibir nome da página, status (draft/published), última atualização
2. Permitir filtrar por status
3. Indicar visualmente se há alterações não publicadas

**Critérios de aceite:**
- [ ] Lista mostra todas as páginas configuradas
- [ ] Status draft/published visível
- [ ] Data de última atualização exibida
- [ ] Click navega para edição

---

### FR-ADM-004 — Editar Conteúdo por Blocos
**Descrição:** Para cada página, o admin pode editar blocos de conteúdo (texto, imagem, CTA, lista, FAQ, etc.).

**Regras:**
1. Cada página tem N blocos identificados por `block_key`
2. Cada bloco tem tipo (text, richtext, image, cta, list, faq)
3. Editor apropriado para cada tipo:
   - text/richtext: textarea ou editor WYSIWYG simples
   - image: upload ou seleção da biblioteca
   - cta: texto + link + estilo
   - list: array de itens
   - faq: array de pergunta/resposta
4. Não alterar estrutura da página, apenas conteúdo dos blocos

**Critérios de aceite:**
- [ ] Blocos da página são listados
- [ ] Cada tipo de bloco tem editor apropriado
- [ ] Alterações são refletidas no preview
- [ ] Validação básica de campos obrigatórios

---

### FR-ADM-005 — Salvar Alterações como Draft
**Descrição:** Ao editar, as alterações são salvas como draft (rascunho) e não afetam o site público.

**Regras:**
1. Botão "Salvar" grava alterações com `status = 'draft'`
2. Conteúdo draft é visível apenas no admin e preview
3. Site público continua exibindo versão `published`
4. Draft é persistente (não perde ao navegar)

**Critérios de aceite:**
- [ ] Botão "Salvar" funciona sem erros
- [ ] Draft é persistido no banco
- [ ] Site público não mostra draft
- [ ] Posso sair e voltar sem perder alterações salvas

---

### FR-ADM-006 — Pré-visualizar Draft
**Descrição:** O admin pode visualizar como o draft ficará antes de publicar.

**Regras:**
1. Modo preview renderiza a página com conteúdo draft
2. Preview usa rota segura (`/preview/[slug]?token=xxx` ou similar)
3. Banner ou indicador visual mostra que é preview (não público)
4. Preview não indexável (noindex, nofollow)

**Critérios de aceite:**
- [ ] Botão "Pré-visualizar" abre página em modo preview
- [ ] Conteúdo draft é renderizado
- [ ] Indicador visual de "modo preview" presente
- [ ] Usuário público não consegue acessar preview sem token/auth

---

### FR-ADM-007 — Publicar Alterações
**Descrição:** O admin pode publicar o draft, tornando-o visível no site público.

**Regras:**
1. Botão "Publicar" promove draft → published
2. Antes de publicar, salvar versão anterior para rollback
3. Publicação é atômica (não deixa estado inconsistente)
4. Registrar no audit log

**Critérios de aceite:**
- [ ] Botão "Publicar" funciona
- [ ] Conteúdo publicado aparece no site público
- [ ] Versão anterior é salva para rollback
- [ ] Audit log registra a publicação

---

### FR-ADM-008 — Histórico de Versões + Rollback
**Descrição:** O admin pode ver histórico de versões e reverter para versão anterior.

**Regras:**
1. Manter no mínimo 1 versão anterior (published anterior ao atual)
2. Exibir lista de versões com data e autor
3. Botão "Reverter" restaura versão selecionada como novo draft
4. Para restaurar como published, ainda precisa publicar

**Critérios de aceite:**
- [ ] Lista de versões é exibida
- [ ] Posso visualizar conteúdo de versão anterior
- [ ] Botão "Reverter" restaura como draft
- [ ] Após reverter, posso publicar normalmente

---

### FR-ADM-009 — Biblioteca de Mídia
**Descrição:** O admin pode fazer upload, visualizar e selecionar imagens de uma biblioteca centralizada.

**Regras:**
1. Upload de imagens (jpg, png, webp) com limite de tamanho
2. Armazenamento no Supabase Storage
3. Galeria com preview das imagens
4. Seletor de imagem integrado ao editor de blocos
5. Metadados: alt text, título, data de upload

**Critérios de aceite:**
- [ ] Upload de imagem funciona
- [ ] Imagens são listadas na biblioteca
- [ ] Posso selecionar imagem da biblioteca no editor
- [ ] Alt text é editável

---

### FR-ADM-010 — Audit Log
**Descrição:** Registrar todas as ações administrativas para auditoria.

**Regras:**
1. Registrar: quem, quando, o quê (ação), em qual entidade
2. Ações a logar: criar, editar, publicar, reverter, deletar
3. Log é append-only (não editável)
4. Visível apenas para admin

**Critérios de aceite:**
- [ ] Cada publicação gera registro no log
- [ ] Log mostra actor (email/id), timestamp, ação
- [ ] Log não pode ser alterado
- [ ] Interface para visualizar histórico de ações

---

## 3. Requisitos Não-Funcionais (NFR)

### NFR-ADM-001 — Segurança
- RLS obrigatório em todas as tabelas CMS
- Público (anon) lê apenas `status = 'published'`
- Admin autenticado lê draft e published
- Somente admin pode INSERT/UPDATE/DELETE
- Audit log: somente admin escreve e lê
- Tokens de preview expiram em tempo configurável

### NFR-ADM-002 — Confiabilidade
- Publicação não pode quebrar SEO (metas, HTML)
- Conteúdo público deve ser consistente (sem estado parcial)
- Fallback seguro: se algo falhar, manter versão publicada anterior
- Não afetar performance das páginas públicas

### NFR-ADM-003 — Usabilidade
- Interface clara e objetiva
- Feedback visual de salvamento/publicação
- Confirmação antes de ações destrutivas
- Mensagens de erro compreensíveis

### NFR-ADM-004 — Integridade
- Validação de dados antes de salvar
- Não permitir publicar conteúdo inválido/vazio
- Versionamento garante que sempre há fallback
- Backup regular das tabelas CMS

---

## 4. Modelo de Dados (Schema CMS no Supabase)

> **IMPORTANTE:** Antes de criar estas tabelas, consultar schema atual via MCP do Supabase para evitar colisões.
> **PROIBIÇÃO:** Não alterar tabela `imoveis` sob nenhuma circunstância.

### 4.1 Tabela `cms_pages`

Representa uma página editável do site.

```sql
CREATE TABLE cms_pages (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,        -- ex: 'home', 'quem-somos', 'assessoria'
  title VARCHAR(255) NOT NULL,               -- Nome amigável: "Página Inicial"
  description TEXT,                          -- Descrição interna
  status VARCHAR(20) DEFAULT 'draft'         -- 'draft' | 'published'
    CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,                  -- Última publicação
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE cms_pages IS 'Páginas editáveis do site via Admin CMS';
```

### 4.2 Tabela `cms_blocks`

Blocos de conteúdo dentro de cada página.

```sql
CREATE TABLE cms_blocks (
  id BIGSERIAL PRIMARY KEY,
  page_id BIGINT NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  block_key VARCHAR(100) NOT NULL,           -- ex: 'hero_title', 'hero_image', 'cta_text'
  block_type VARCHAR(50) NOT NULL            -- 'text' | 'richtext' | 'image' | 'cta' | 'list' | 'faq'
    CHECK (block_type IN ('text', 'richtext', 'image', 'cta', 'list', 'faq', 'banner')),
  content_draft JSONB DEFAULT '{}'::jsonb,   -- Conteúdo em edição (draft)
  content_published JSONB DEFAULT '{}'::jsonb, -- Conteúdo publicado
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(page_id, block_key)
);

COMMENT ON TABLE cms_blocks IS 'Blocos de conteúdo editáveis por página';
COMMENT ON COLUMN cms_blocks.content_draft IS 'Conteúdo sendo editado (não público)';
COMMENT ON COLUMN cms_blocks.content_published IS 'Conteúdo visível no site público';
```

**Estrutura do content_json por tipo:**

```jsonc
// text
{ "value": "Texto simples aqui" }

// richtext
{ "value": "<p>HTML permitido</p>", "format": "html" }

// image
{ "url": "https://...", "alt": "Descrição", "asset_id": 123 }

// cta
{ "text": "Entre em Contato", "url": "/contato", "style": "primary" }

// list
{ "items": ["Item 1", "Item 2", "Item 3"] }

// faq
{ "items": [
  { "question": "Pergunta 1?", "answer": "Resposta 1" },
  { "question": "Pergunta 2?", "answer": "Resposta 2" }
]}
```

### 4.3 Tabela `cms_assets`

Biblioteca de mídia (imagens, arquivos).

```sql
CREATE TABLE cms_assets (
  id BIGSERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  storage_path TEXT NOT NULL,                -- Path no Supabase Storage
  url TEXT NOT NULL,                         -- URL pública
  mime_type VARCHAR(100),
  file_size BIGINT,                          -- em bytes
  alt_text VARCHAR(255),
  title VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,        -- width, height, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE cms_assets IS 'Biblioteca de mídia do CMS';
```

### 4.4 Tabela `cms_versions`

Histórico de versões para rollback.

```sql
CREATE TABLE cms_versions (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,          -- 'page' | 'block'
  entity_id BIGINT NOT NULL,
  version_number INT NOT NULL,
  data_snapshot JSONB NOT NULL,              -- Snapshot completo do conteúdo
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(entity_type, entity_id, version_number)
);

COMMENT ON TABLE cms_versions IS 'Histórico de versões para rollback';
```

### 4.5 Tabela `cms_audit_log`

Log de auditoria de todas as ações.

```sql
CREATE TABLE cms_audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id),
  actor_email VARCHAR(255),
  action VARCHAR(50) NOT NULL                -- 'create' | 'update' | 'publish' | 'revert' | 'delete'
    CHECK (action IN ('create', 'update', 'publish', 'revert', 'delete', 'upload')),
  entity_type VARCHAR(50) NOT NULL,          -- 'page' | 'block' | 'asset'
  entity_id BIGINT NOT NULL,
  entity_name VARCHAR(255),                  -- Nome legível (para histórico)
  details JSONB DEFAULT '{}'::jsonb,         -- Detalhes adicionais / diff resumido
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE cms_audit_log IS 'Log de auditoria do Admin CMS (append-only)';

-- Índices para consultas frequentes
CREATE INDEX idx_cms_audit_log_actor ON cms_audit_log(actor_id);
CREATE INDEX idx_cms_audit_log_entity ON cms_audit_log(entity_type, entity_id);
CREATE INDEX idx_cms_audit_log_created ON cms_audit_log(created_at DESC);
```

### 4.5.1 Extensões (Sprint v3/v4) — implementação

**Tabela `cms_preview_tokens`** (Sprint v3): armazena tokens temporários para compartilhar link de preview sem autenticação. Campos típicos: token, page_id, expires_at, created_by. RLS: apenas authenticated insere/deleta; anon pode SELECT para validar token. Não está no schema SQL acima; migration pode existir em outro arquivo ou ter sido aplicada manualmente.

**Funções RPC:**
- `publish_block_atomic(p_block_id, p_user_id)`: publica o bloco de forma atômica; grava versão anterior em `cms_versions`, atualiza `content_published`, insere em `cms_audit_log`.
- `revert_block_to_version(p_block_id, p_version_id, p_user_id)`: restaura `content_draft` do bloco a partir de uma versão em `cms_versions` e registra ação `revert` no audit log.

### 4.6 RLS (Row Level Security) — OBRIGATÓRIO

```sql
-- cms_pages
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- Público: lê apenas published (para renderização do site)
CREATE POLICY "cms_pages_public_read" ON cms_pages
  FOR SELECT TO anon
  USING (status = 'published');

-- Admin: lê tudo
CREATE POLICY "cms_pages_admin_read" ON cms_pages
  FOR SELECT TO authenticated
  USING (true);  -- TODO: verificar role admin

-- Admin: insere/atualiza/deleta
CREATE POLICY "cms_pages_admin_write" ON cms_pages
  FOR ALL TO authenticated
  USING (true)   -- TODO: verificar role admin
  WITH CHECK (true);

-- cms_blocks
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;

-- Público: lê apenas blocos de páginas published
CREATE POLICY "cms_blocks_public_read" ON cms_blocks
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages 
      WHERE cms_pages.id = cms_blocks.page_id 
      AND cms_pages.status = 'published'
    )
  );

-- Admin: lê tudo
CREATE POLICY "cms_blocks_admin_read" ON cms_blocks
  FOR SELECT TO authenticated
  USING (true);

-- Admin: escreve
CREATE POLICY "cms_blocks_admin_write" ON cms_blocks
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- cms_assets (biblioteca de mídia)
ALTER TABLE cms_assets ENABLE ROW LEVEL SECURITY;

-- Público: lê (imagens podem ser públicas)
CREATE POLICY "cms_assets_public_read" ON cms_assets
  FOR SELECT TO anon
  USING (true);

-- Admin: escreve
CREATE POLICY "cms_assets_admin_write" ON cms_assets
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- cms_versions (histórico)
ALTER TABLE cms_versions ENABLE ROW LEVEL SECURITY;

-- Apenas admin lê e escreve
CREATE POLICY "cms_versions_admin_only" ON cms_versions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- cms_audit_log (log de auditoria)
ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin: lê
CREATE POLICY "cms_audit_log_admin_read" ON cms_audit_log
  FOR SELECT TO authenticated
  USING (true);

-- Admin: insere (append-only, sem update/delete)
CREATE POLICY "cms_audit_log_admin_insert" ON cms_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (true);
```

---

## 5. Rotas e UI (Admin)

### 5.1 Rotas Mínimas

> **Nota:** A implementação usa o prefixo `/admin/cms` para rotas do CMS.

| Rota | Descrição |
|------|-----------|
| `/admin/login` | Página de login |
| `/admin` | Dashboard / home do admin |
| `/admin/cms` | Lista de páginas editáveis |
| `/admin/cms/pages/[slug]/edit` | Editor de página |
| `/admin/cms/assets` | Biblioteca de mídia |
| `/admin/cms/audit-log` | Histórico de auditoria |
| `/preview/[slug]` | Preview (protegido; aceita `?token=` para link compartilhado) |

### 5.2 Fluxo de Edição

```
┌─────────────────┐
│  Admin Login    │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Lista Páginas  │  ◀──── Ver status draft/published
└────────┬────────┘
         ▼
┌─────────────────┐
│  Editar Página  │  ◀──── Editar blocos
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌──────────┐
│ Salvar│  │Pré-visual│
│ Draft │  │   izar   │
└───┬───┘  └────┬─────┘
    │           │
    └─────┬─────┘
          ▼
   ┌─────────────┐
   │  Publicar   │
   └──────┬──────┘
          ▼
   ┌─────────────┐
   │Site Público │
   │ Atualizado  │
   └─────────────┘
```

### 5.3 Componentes de UI

**Editor de Blocos (BlockEditorFactory):**
- `TextBlockEditor` — Editor de texto simples
- `RichTextBlockEditor` — Editor WYSIWYG
- `ImageBlockEditor` — Seletor de imagem (usa AssetSelector)
- `CtaBlockEditor` — Editor de CTA
- `ListBlockEditor` — Editor de lista
- `FAQBlockEditor` — Editor de FAQ
- Tipo `banner` está no schema mas sem editor dedicado (reservado).

**UX (Sprint v8):**
- `LivePreview` — Preview em tempo real lado a lado
- `BlockStatusIndicator` — Status visual do bloco (tipo, draft/published)
- `ValidationFeedback` — Feedback de validação (error/success/warning)
- `useKeyboardShortcuts` — Atalhos Ctrl+S (salvar), Ctrl+P (publicar)

**Preview compartilhado (Sprint v3):**
- `SharePreviewButton` — Gera link de preview com token temporário
- Hook `usePreviewToken` — Cria/valida tokens em `cms_preview_tokens`

**Histórico/Rollback (Sprint v4):**
- `BlockVersionHistory` — Lista versões do bloco e botão Reverter
- Hook `useCmsVersions` — Lista versões e chama RPC `revert_block_to_version`

**Biblioteca de Mídia:**
- `AssetLibrary` — Grid de imagens
- `AssetUploader` — Upload de arquivos
- `AssetSelector` — Modal de seleção de imagem para bloco

---

## 6. Critérios de Aceite Globais (AC)

### 6.1 Funcionalidade Core

- [ ] **AC-ADM-001:** Consigo fazer login no admin com email/senha
- [ ] **AC-ADM-002:** Consigo ver lista de páginas editáveis
- [ ] **AC-ADM-003:** Consigo editar o texto do hero da Home e salvar como draft
- [ ] **AC-ADM-004:** Consigo pré-visualizar o draft sem afetar usuários públicos
- [ ] **AC-ADM-005:** Ao publicar, o conteúdo público muda sem quebrar layout
- [ ] **AC-ADM-006:** Consigo fazer upload de imagem na biblioteca
- [ ] **AC-ADM-007:** Consigo selecionar imagem da biblioteca para um bloco

### 6.2 Segurança

- [ ] **AC-ADM-008:** Usuário não-admin recebe 403/redirect ao acessar /admin
- [ ] **AC-ADM-009:** Conteúdo draft não aparece para usuários comuns
- [ ] **AC-ADM-010:** Conteúdo draft não aparece em rotas públicas
- [ ] **AC-ADM-011:** Preview só funciona com autenticação ou token válido

### 6.3 Integridade

- [ ] **AC-ADM-012:** SEO (metas/HTML) e renderização não degradam após publicação
- [ ] **AC-ADM-013:** Existe rollback mínimo (1 nível) para conteúdo publicado
- [ ] **AC-ADM-014:** Cada publish gera registro no audit log
- [ ] **AC-ADM-015:** Posso reverter para versão anterior sem quebrar o site

### 6.4 Usabilidade

- [ ] **AC-ADM-016:** Interface é clara e não requer treinamento extenso
- [ ] **AC-ADM-017:** Feedback visual indica salvamento e publicação
- [ ] **AC-ADM-018:** Erros são exibidos de forma compreensível

---

## 7. Plano de Entrega (Ralph Wiggum — Incrementos Mínimos)

> **Princípio:** Entregar em incrementos mínimos e testáveis, sempre mantendo o site estável.

### Sprint CMS v0 — MVP Mínimo
**Objetivo:** Editar 1 texto do Home e publicar.

**Entregáveis:**
- [ ] Tabelas `cms_pages` e `cms_blocks` criadas
- [ ] RLS básico configurado
- [ ] Rota `/admin/pages/home/edit` funcional
- [ ] Edição de 1 bloco de texto (hero_title)
- [ ] Salvar draft funciona
- [ ] Publicar funciona
- [ ] Home renderiza conteúdo do CMS

**Critérios de aceite:**
- Edito título do hero da Home
- Salvo como draft (site público não muda)
- Publico (site público atualiza)

**Testes:**
- [ ] Smoke test: editar → salvar → preview → publicar
- [ ] Verificar RLS: público não vê draft

**Rollback:** Se falhar, remover feature flag e usar conteúdo hardcoded.

---

### Sprint CMS v1 — Blocos por Página
**Objetivo:** Editar múltiplos blocos de uma página específica.

**Entregáveis:**
- [ ] Lista de páginas editáveis
- [ ] Editor de múltiplos blocos por página
- [ ] Tipos de bloco: text, richtext, image (URL manual)
- [ ] Preview funcional

**Critérios de aceite:**
- Listo todas as páginas configuradas
- Edito vários blocos de uma página
- Preview mostra alterações antes de publicar

**Testes:**
- [ ] Editar 3 blocos diferentes
- [ ] Preview funciona
- [ ] Publicar atualiza todos os blocos

---

### Sprint CMS v2 — Biblioteca de Mídia
**Objetivo:** Upload e seleção de imagens.

**Entregáveis:**
- [ ] Tabela `cms_assets`
- [ ] Supabase Storage configurado
- [ ] UI de upload de imagens
- [ ] Galeria de imagens
- [ ] Seletor de imagem no editor

**Critérios de aceite:**
- Faço upload de imagem
- Vejo imagens na biblioteca
- Seleciono imagem para bloco

**Testes:**
- [ ] Upload de jpg, png, webp
- [ ] Limite de tamanho funciona
- [ ] Imagem aparece na biblioteca

---

### Sprint CMS v3 — Preview Completo + Publish Robusto ✅
**Objetivo:** Preview em todas as páginas, publish atômico.

**Entregáveis:**
- [x] Preview funciona para qualquer página
- [x] Indicador visual de modo preview
- [x] Token de preview com expiração
- [x] Publish atômico (tudo ou nada)
- [x] Validação antes de publicar

**Critérios de aceite:** Concluídos (ver ROADMAP_SPRINTS.md).

**Testes:**
- [ ] Preview em 5 páginas diferentes (manual)
- [ ] Simular erro no meio do publish (deve reverter) (manual)

---

### Sprint CMS v4 — Histórico/Rollback + Audit Log ✅
**Objetivo:** Versionamento e auditoria completos.

**Entregáveis:**
- [x] Tabela `cms_versions` (já existia; RPC grava ao publicar)
- [x] Tabela `cms_audit_log` (já existia)
- [x] UI de histórico de versões (BlockVersionHistory por bloco)
- [x] Botão "Reverter" funcional (restaura como draft)
- [x] UI de audit log (`/admin/cms/audit-log`)

**Critérios de aceite:** Concluídos (ver ROADMAP_SPRINTS.md).

**Testes:**
- [ ] Publicar 3 vezes, reverter para versão 1 (manual)
- [ ] Verificar audit log completo (manual)

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar SEO ao publicar | Média | Alto | Validação de metas antes de publish; rollback automático se detectar problema |
| Performance degradar com CMS | Baixa | Médio | Cache de conteúdo published; queries otimizadas |
| Usuário publicar conteúdo quebrado | Média | Médio | Validação robusta; preview obrigatório; rollback fácil |
| Complexidade de UI do editor | Alta | Médio | Começar simples (v0); iterar com feedback |
| Conflitos de edição simultânea | Baixa | Baixo | Apenas 1 admin inicialmente; locking futuro se necessário |

---

## 9. Dependências

- Sistema de auth existente (`useAuth`) funcionando
- Supabase Storage configurado para uploads
- Rotas `/admin/*` não conflitam com existentes
- Design System do projeto para UI do admin

---

## 11. Sprint CMS v9 — Análise + Componentes Prontos ⭐ NOVO

**Status:** Pronto para implementação (2026-02-04)

**Documentação Completa:**
1. `CMS_RASTREAMENTO_COMPLETO.md` — Mapa de 145 campos por página
2. `CMS_RESUMO_EXECUTIVO.md` — Executivo + ROI (60% tempo)
3. `CMS_GUIA_IMPLEMENTACAO_UX.md` — Passo a passo (Fase 1-3)
4. `CMS_VISUALIZACAO_UX.md` — Fluxo interações
5. `CMS_INDICE_ARQUIVOS.md` — Navegação por papel
6. `README_CMS_COMPLETO.md` — Visão geral

**Componentes Prontos:**
- `SyncedLivePreview.tsx` — Auto-scroll + highlight
- `useSyncedBlockEditor.ts` — Hook sincronização
- `EnhancedEditorStatusBar.tsx` — Status bar
- `CtaFieldEditor.tsx` — Editor composto

**Roadmap 4 Sprints:**
- v9: UX sync → 2%+UX ✅
- v10: Home → 25%
- v11: Quem Somos → 50%
- v12: Regionais → 100%

---

## 12. Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-04 | 1.1 | Sprint CMS v9 integrada (UX + 145 campos + roadmap 100%) |
| 2026-02-03 | 1.0 | Criação do documento |

---

_Documento criado seguindo SDD._
_Sprint CMS v9 pronta para implementação imediata._

## 10. Referências

- `DECISIONS.md` — DEC-ADM-001 (decisão de usar Supabase)
- `SPEC.md` — Contexto geral do projeto
- `DESIGN_SYSTEM.md` — Padrões visuais
- `25-supabase-mcp-safety.mdc` — Regras de segurança de banco

---

## 11. Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2026-02-03 | 1.0 | Criação do documento |

---

_Documento criado seguindo SDD (Spec-Driven Development)._
_Aguardando aprovação antes de implementação._
