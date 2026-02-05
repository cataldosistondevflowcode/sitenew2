# CMS_ADMIN_SPEC.md — Admin CMS do Site (tipo WordPress)
_Versão: 1.3 | Data: 2026-02-05_  
_Status: Implementado | Sprints v19-v22 Planejadas_  
_Última atualização: Planejamento Sprints v19-v22 (Funcionalidades Avançadas)_

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
- [x] Login com email/senha funciona
- [x] Usuário sem role "admin" é redirecionado
- [x] Logout funciona corretamente

> **Nota Sprint v16:** Auth via localStorage/frontend funciona. Sessão não expira automaticamente (gap menor). RLS backend protege via `is_cms_admin()`.

---

### FR-ADM-002 — Proteção de Rotas /admin/*
**Descrição:** Todas as rotas `/admin/*` devem ser protegidas e inacessíveis para usuários não autenticados ou não-admin.

**Regras:**
1. Middleware/guard de rota verifica autenticação
2. Retorna 403 ou redirect para login se não autorizado
3. URLs de preview também devem ser protegidas ou usar token temporário

**Critérios de aceite:**
- [x] Acesso direto a `/admin` sem auth redireciona para `/admin/login`
- [x] Usuário comum (não-admin) recebe 403
- [ ] Headers de cache impedem vazamento de conteúdo admin

> **Nota Sprint v16:** Proteção via frontend (useEffect + Navigate). Headers de cache não implementados explicitamente (gap menor, SPA protege via JS).

---

### FR-ADM-003 — Listar Páginas Editáveis
**Descrição:** O admin deve ver uma lista de todas as páginas do site que podem ser editadas.

**Regras:**
1. Exibir nome da página, status (draft/published), última atualização
2. Permitir filtrar por status
3. Indicar visualmente se há alterações não publicadas

**Critérios de aceite:**
- [x] Lista mostra todas as páginas configuradas
- [x] Status draft/published visível
- [x] Data de última atualização exibida
- [x] Click navega para edição

> **Nota Sprint v16:** Funcional. Falta filtro por status e indicador de alterações não publicadas em página já publicada (gaps menores, backlog).

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
- [x] Blocos da página são listados
- [x] Cada tipo de bloco tem editor apropriado
- [x] Alterações são refletidas no preview
- [x] Validação básica de campos obrigatórios

> **Nota Sprint v16:** Editores implementados para text, richtext, image, cta, list, faq. Banner sem editor dedicado (reservado). Validação básica OK.

---

### FR-ADM-005 — Salvar Alterações como Draft
**Descrição:** Ao editar, as alterações são salvas como draft (rascunho) e não afetam o site público.

**Regras:**
1. Botão "Salvar" grava alterações com `status = 'draft'`
2. Conteúdo draft é visível apenas no admin e preview
3. Site público continua exibindo versão `published`
4. Draft é persistente (não perde ao navegar)

**Critérios de aceite:**
- [x] Botão "Salvar" funciona sem erros
- [x] Draft é persistido no banco
- [x] Site público não mostra draft
- [x] Posso sair e voltar sem perder alterações salvas

> **Nota Sprint v16:** Totalmente funcional. Draft persiste em `content_draft`. RLS protege conteúdo.

---

### FR-ADM-006 — Pré-visualizar Draft
**Descrição:** O admin pode visualizar como o draft ficará antes de publicar.

**Regras:**
1. Modo preview renderiza a página com conteúdo draft
2. Preview usa rota segura (`/preview/[slug]?token=xxx` ou similar)
3. Banner ou indicador visual mostra que é preview (não público)
4. Preview não indexável (noindex, nofollow)

**Critérios de aceite:**
- [x] Botão "Pré-visualizar" abre página em modo preview
- [x] Conteúdo draft é renderizado
- [x] Indicador visual de "modo preview" presente
- [x] Usuário público não consegue acessar preview sem token/auth

> **Nota Sprint v16:** Preview completo com header azul. Suporta auth admin OU token temporário. Falta meta noindex explícito (gap menor).

---

### FR-ADM-007 — Publicar Alterações
**Descrição:** O admin pode publicar o draft, tornando-o visível no site público.

**Regras:**
1. Botão "Publicar" promove draft → published
2. Antes de publicar, salvar versão anterior para rollback
3. Publicação é atômica (não deixa estado inconsistente)
4. Registrar no audit log

**Critérios de aceite:**
- [x] Botão "Publicar" funciona
- [x] Conteúdo publicado aparece no site público
- [x] Versão anterior é salva para rollback
- [x] Audit log registra a publicação

> **Nota Sprint v16:** RPC `publish_block_atomic` implementado. Publicação atômica com versionamento e audit log completo.

---

### FR-ADM-008 — Histórico de Versões + Rollback
**Descrição:** O admin pode ver histórico de versões e reverter para versão anterior.

**Regras:**
1. Manter no mínimo 1 versão anterior (published anterior ao atual)
2. Exibir lista de versões com data e autor
3. Botão "Reverter" restaura versão selecionada como novo draft
4. Para restaurar como published, ainda precisa publicar

**Critérios de aceite:**
- [x] Lista de versões é exibida
- [x] Posso visualizar conteúdo de versão anterior
- [x] Botão "Reverter" restaura como draft
- [x] Após reverter, posso publicar normalmente

> **Nota Sprint v16:** `BlockVersionHistory` implementado. RPC `revert_block_to_version` funciona. Visualização de diff parcial.

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
- [x] Upload de imagem funciona
- [x] Imagens são listadas na biblioteca
- [x] Posso selecionar imagem da biblioteca no editor
- [x] Alt text é editável

> **Nota Sprint v16:** Biblioteca completa. Upload via Supabase Storage. AssetSelector integrado. Falta busca/filtro e metadados width/height (gaps menores).

---

### FR-ADM-010 — Audit Log
**Descrição:** Registrar todas as ações administrativas para auditoria.

**Regras:**
1. Registrar: quem, quando, o quê (ação), em qual entidade
2. Ações a logar: criar, editar, publicar, reverter, deletar
3. Log é append-only (não editável)
4. Visível apenas para admin

**Critérios de aceite:**
- [x] Cada publicação gera registro no log
- [x] Log mostra actor (email/id), timestamp, ação
- [x] Log não pode ser alterado
- [x] Interface para visualizar histórico de ações

> **Nota Sprint v16:** `/admin/cms/audit-log` funcional. Append-only via RLS. Mostra ação, entidade, timestamp, actor. Falta ip_address/user_agent (opcional).

---

### FR-ADM-011 — Undo/Redo Global (Sprint v19) ✅
**Descrição:** O admin pode desfazer e refazer ações mesmo após salvar, usando Ctrl+Z e Ctrl+Shift+Z.

**Regras:**
1. Stack de estados mantém até 50 versões
2. Undo restaura estado anterior (blocos, conteúdo)
3. Redo restaura estado desfeito
4. Stack é limpo ao navegar para outra página
5. Atalhos de teclado funcionam globalmente no editor

**Critérios de aceite:**
- [x] Ctrl+Z desfaz última alteração (mesmo após salvar draft)
- [x] Ctrl+Shift+Z refaz alteração desfeita
- [x] Botões Undo/Redo visíveis na status bar
- [x] Stack limitado a 50 estados

> **Status:** ✅ IMPLEMENTADO (Sprint CMS v19 — 2026-02-05)

**Implementação:**
- Hook `useUndoRedo.ts` com stack de estados, debounce e limite de 50 entradas
- Botões Undo/Redo com tooltips na `EnhancedEditorStatusBar`
- Atalhos Ctrl+Z e Ctrl+Shift+Z funcionando fora de inputs/textareas
- Integração completa no `AdminCmsPageEdit.tsx`

---

### FR-ADM-012 — Criar/Excluir Blocos Dinamicamente (Sprint v20) ✅
**Descrição:** O admin pode criar novos blocos e excluir blocos existentes diretamente pela UI.

**Regras:**
1. Modal permite escolher tipo de bloco e identificador (block_key)
2. block_key deve ser único na página
3. Exclusão requer confirmação
4. Exclusão registra backup do conteúdo no audit log
5. display_order é atualizado automaticamente

**Critérios de aceite:**
- [x] Botão "Adicionar Bloco" visível no editor
- [x] Modal permite escolher tipo e block_key
- [x] Novo bloco aparece na lista após criação
- [x] Botão "Excluir" visível em cada bloco
- [x] Confirmação antes de excluir
- [x] Audit log registra criação e exclusão

> **Status:** ✅ IMPLEMENTADO (Sprint CMS v20 — 2026-02-05)

**Implementação:**
- Modal `AddBlockModal` com 7 tipos de bloco (text, richtext, image, cta, list, faq, banner)
- Validação de block_key (formato e unicidade)
- RPCs `create_block_safe` e `delete_block_safe` com SECURITY DEFINER
- Backup automático do conteúdo no audit log antes de excluir
- Integração com undo/redo (Sprint v19)

---

### FR-ADM-013 — Reordenar Blocos com Drag-and-Drop (Sprint v21) ✅
**Descrição:** O admin pode reordenar blocos arrastando e soltando.

**Regras:**
1. Handle de drag (≡) visível em cada bloco
2. Feedback visual durante arrasto (ghost, placeholder)
3. Preview atualiza em tempo real durante arrasto
4. Ordem é persistida no banco após soltar
5. Reordenação via teclado para acessibilidade

**Critérios de aceite:**
- [x] Arrastar bloco mostra ghost/placeholder
- [x] Soltar bloco atualiza ordem visual imediatamente
- [x] Audit log registra reordenação
- [x] Acessibilidade: reordenar via teclado (Tab + Space + Arrows)

> **Status:** ✅ IMPLEMENTADO (Sprint CMS v21 — 2026-02-05)

**Implementação:**
- `@dnd-kit` para funcionalidade de drag-and-drop
- Componentes `SortableBlockList` e `SortableBlockItem`
- RPC `reorder_blocks_batch` para persistência atômica
- Optimistic update para feedback imediato
- Suporte a reordenação via teclado (acessibilidade)

---

### FR-ADM-014 — Criar Novas Páginas pelo Admin (Sprint v22) ✅
**Descrição:** O admin pode criar novas páginas CMS diretamente pela UI, sem necessidade de SQL.

**Regras:**
1. Modal permite inserir título, slug e descrição
2. Slug deve ser único e válido (letras minúsculas, números, hífens)
3. Opção de criar com blocos iniciais automáticos
4. Página criada inicia como draft
5. Navega para editor após criação

**Critérios de aceite:**
- [x] Botão "Nova Página" visível na lista de páginas
- [x] Validação de slug (formato e unicidade)
- [x] Página criada aparece na lista (status: Rascunho)
- [x] Blocos iniciais criados automaticamente (se selecionados)
- [x] Audit log registra criação

> **Status:** ✅ IMPLEMENTADO (Sprint CMS v22 — 2026-02-05)

**Implementação:**
- Modal `CreatePageModal` com auto-geração de slug
- Validação de formato e unicidade do slug
- RPC `create_page_safe` com blocos padrão opcionais
- Navegação automática para editor após criação
- Registro no audit log

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

### 4.6 Tabela `admin_users` (Sprint v15 — Hardening)

Lista de emails autorizados a editar conteúdo do CMS. **Adicionada na Sprint v15 para substituir a verificação permissiva de `authenticated`.**

```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'system'
);

-- RLS: tabela invisível para anon/authenticated (apenas service_role)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- Sem policies = ninguém pode ler via client, apenas via função SECURITY DEFINER

COMMENT ON TABLE admin_users IS 'Lista de emails autorizados a editar conteúdo do CMS';
```

**Admins iniciais (seed):**
- `adm@hotmail.com` — Admin Demo
- `contato@cataldosiston-adv.com.br` — Cataldo Siston

### 4.7 Função `is_cms_admin()` (Sprint v15 — Hardening)

Função que verifica se o usuário atual é administrador do CMS.

```sql
CREATE OR REPLACE FUNCTION is_cms_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Retorna TRUE se o email do usuário logado está em admin_users
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = (auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_cms_admin() IS 'Verifica se o usuário atual é administrador do CMS';

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
```

**Importante:**
- `SECURITY DEFINER`: A função executa com permissões do owner (postgres), permitindo ler `admin_users` mesmo sem policy para `authenticated`.
- `STABLE`: Marcada como estável para otimização de queries.
- Usada em todas as policies de write das tabelas CMS.

### 4.8 RLS (Row Level Security) — OBRIGATÓRIO

> **ATUALIZADO Sprint v15:** Todas as policies de write agora usam `is_cms_admin()` em vez de apenas `authenticated`.

```sql
-- ==================================================
-- cms_pages
-- ==================================================
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- Público: lê apenas published (para renderização do site)
CREATE POLICY "cms_pages_anon_read" ON cms_pages
  FOR SELECT TO anon
  USING (status = 'published');

-- Authenticated: lê tudo (para admin ver drafts)
CREATE POLICY "cms_pages_authenticated_read" ON cms_pages
  FOR SELECT TO authenticated
  USING (true);

-- Admin: escreve (apenas admins autorizados)
CREATE POLICY "cms_pages_admin_write" ON cms_pages
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- ==================================================
-- cms_blocks
-- ==================================================
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;

-- Público: lê apenas blocos de páginas published
CREATE POLICY "cms_blocks_anon_read" ON cms_blocks
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages 
      WHERE cms_pages.id = cms_blocks.page_id 
      AND cms_pages.status = 'published'
    )
  );

-- Authenticated: lê tudo (para admin ver drafts)
CREATE POLICY "cms_blocks_authenticated_read" ON cms_blocks
  FOR SELECT TO authenticated
  USING (true);

-- Admin: escreve (apenas admins autorizados)
CREATE POLICY "cms_blocks_admin_write" ON cms_blocks
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- ==================================================
-- cms_assets (biblioteca de mídia)
-- ==================================================
ALTER TABLE cms_assets ENABLE ROW LEVEL SECURITY;

-- Público: lê (imagens podem ser públicas)
CREATE POLICY "cms_assets_anon_read" ON cms_assets
  FOR SELECT TO anon
  USING (true);

-- Admin: escreve (apenas admins autorizados)
CREATE POLICY "cms_assets_admin_write" ON cms_assets
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- ==================================================
-- cms_preview_tokens
-- ==================================================
ALTER TABLE cms_preview_tokens ENABLE ROW LEVEL SECURITY;

-- Público: lê (para validar token)
CREATE POLICY "Anyone can read tokens" ON cms_preview_tokens
  FOR SELECT TO public
  USING (true);

-- Admin: insere (apenas admins autorizados)
CREATE POLICY "cms_preview_tokens_admin_insert" ON cms_preview_tokens
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());

-- Admin: deleta (apenas admins autorizados)
CREATE POLICY "cms_preview_tokens_admin_delete" ON cms_preview_tokens
  FOR DELETE TO authenticated
  USING (is_cms_admin());

-- ==================================================
-- cms_versions (histórico)
-- ==================================================
ALTER TABLE cms_versions ENABLE ROW LEVEL SECURITY;

-- Admin: lê (apenas admins autorizados)
CREATE POLICY "cms_versions_admin_read" ON cms_versions
  FOR SELECT TO authenticated
  USING (is_cms_admin());

-- Admin: insere (apenas admins autorizados)
CREATE POLICY "cms_versions_admin_insert" ON cms_versions
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());

-- ==================================================
-- cms_audit_log (log de auditoria)
-- ==================================================
ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin: lê (apenas admins autorizados)
CREATE POLICY "cms_audit_log_admin_read" ON cms_audit_log
  FOR SELECT TO authenticated
  USING (is_cms_admin());

-- Admin: insere (append-only, sem update/delete)
CREATE POLICY "cms_audit_log_admin_insert" ON cms_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());

-- ==================================================
-- admin_users
-- ==================================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- Sem policies = ninguém pode ler via client
-- A função is_cms_admin() usa SECURITY DEFINER para ler
```

### 4.9 Resumo de Permissões por Tabela

| Tabela | anon | authenticated | is_cms_admin() |
|--------|------|---------------|----------------|
| `cms_pages` | SELECT (published) | SELECT (all) | INSERT/UPDATE/DELETE |
| `cms_blocks` | SELECT (page published) | SELECT (all) | INSERT/UPDATE/DELETE |
| `cms_assets` | SELECT | SELECT | INSERT/UPDATE/DELETE |
| `cms_preview_tokens` | SELECT | SELECT | INSERT/DELETE |
| `cms_versions` | ❌ | ❌ | SELECT/INSERT |
| `cms_audit_log` | ❌ | ❌ | SELECT/INSERT |
| `admin_users` | ❌ | ❌ | ❌ (só SECURITY DEFINER) |

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

> **Atualizado Sprint v16:** Critérios validados contra implementação atual.

### 6.1 Funcionalidade Core

- [x] **AC-ADM-001:** Consigo fazer login no admin com email/senha
- [x] **AC-ADM-002:** Consigo ver lista de páginas editáveis
- [x] **AC-ADM-003:** Consigo editar o texto do hero da Home e salvar como draft
- [x] **AC-ADM-004:** Consigo pré-visualizar o draft sem afetar usuários públicos
- [x] **AC-ADM-005:** Ao publicar, o conteúdo público muda sem quebrar layout
- [x] **AC-ADM-006:** Consigo fazer upload de imagem na biblioteca
- [x] **AC-ADM-007:** Consigo selecionar imagem da biblioteca para um bloco

### 6.2 Segurança

- [x] **AC-ADM-008:** Usuário não-admin recebe 403/redirect ao acessar /admin
- [x] **AC-ADM-009:** Conteúdo draft não aparece para usuários comuns
- [x] **AC-ADM-010:** Conteúdo draft não aparece em rotas públicas
- [x] **AC-ADM-011:** Preview só funciona com autenticação ou token válido

### 6.3 Integridade

- [x] **AC-ADM-012:** SEO (metas/HTML) e renderização não degradam após publicação
- [x] **AC-ADM-013:** Existe rollback mínimo (1 nível) para conteúdo publicado
- [x] **AC-ADM-014:** Cada publish gera registro no audit log
- [x] **AC-ADM-015:** Posso reverter para versão anterior sem quebrar o site

### 6.4 Usabilidade

- [x] **AC-ADM-016:** Interface é clara e não requer treinamento extenso
- [x] **AC-ADM-017:** Feedback visual indica salvamento e publicação
- [x] **AC-ADM-018:** Erros são exibidos de forma compreensível

> **Resultado Sprint v16:** 18/18 critérios de aceite globais passam (100%).

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
| 2026-02-05 | 1.3 | Adicionados FR-ADM-011 a FR-ADM-014 (Sprints v19-v22: Undo/Redo, Criar/Excluir Blocos, Drag-Drop, Criar Páginas) |
| 2026-02-05 | 1.2 | Sprint CMS v16 — Alinhamento final: todos ACs atualizados, 18/18 passam |
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
