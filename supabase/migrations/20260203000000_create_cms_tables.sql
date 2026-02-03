-- Migration: Create CMS tables for Admin CMS feature
-- Date: 2026-02-03
-- Purpose: Create tabelas CMS para gerenciamento de conteúdo do site (tipo WordPress)
-- Status: Sprint CMS v0 — MVP mínimo

-- ============================================================================
-- 1. CREATE TABLE cms_pages
-- Representa páginas editáveis do site (Home, Quem Somos, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_pages (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT cms_pages_status CHECK (status IN ('draft', 'published'))
);

COMMENT ON TABLE cms_pages IS 'Páginas editáveis do site via Admin CMS (RF-ADM-003)';
COMMENT ON COLUMN cms_pages.slug IS 'Identificador único da página (ex: home, quem-somos)';
COMMENT ON COLUMN cms_pages.status IS 'draft = não publicado, published = visível ao público';
COMMENT ON COLUMN cms_pages.published_at IS 'Timestamp da última publicação';

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);

-- ============================================================================
-- 2. CREATE TABLE cms_blocks
-- Blocos de conteúdo dentro de cada página
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_blocks (
  id BIGSERIAL PRIMARY KEY,
  page_id BIGINT NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  block_key VARCHAR(100) NOT NULL,
  block_type VARCHAR(50) NOT NULL,
  content_draft JSONB DEFAULT '{}'::jsonb,
  content_published JSONB DEFAULT '{}'::jsonb,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(page_id, block_key),
  CONSTRAINT cms_blocks_type CHECK (block_type IN ('text', 'richtext', 'image', 'cta', 'list', 'faq', 'banner'))
);

COMMENT ON TABLE cms_blocks IS 'Blocos de conteúdo editáveis por página (RF-ADM-004)';
COMMENT ON COLUMN cms_blocks.block_key IS 'Identificador único do bloco por página (ex: hero_title, hero_image)';
COMMENT ON COLUMN cms_blocks.block_type IS 'Tipo de bloco: text, richtext, image, cta, list, faq, banner';
COMMENT ON COLUMN cms_blocks.content_draft IS 'Conteúdo em edição (não visível ao público) — RF-ADM-005';
COMMENT ON COLUMN cms_blocks.content_published IS 'Conteúdo publicado (visível ao público)';

CREATE INDEX idx_cms_blocks_page ON cms_blocks(page_id);
CREATE INDEX idx_cms_blocks_key ON cms_blocks(page_id, block_key);

-- ============================================================================
-- 3. CREATE TABLE cms_assets
-- Biblioteca de mídia (imagens, arquivos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_assets (
  id BIGSERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type VARCHAR(100),
  file_size BIGINT,
  alt_text VARCHAR(255),
  title VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE cms_assets IS 'Biblioteca de mídia do CMS (RF-ADM-009)';
COMMENT ON COLUMN cms_assets.storage_path IS 'Caminho no Supabase Storage (cms/assets/...)';
COMMENT ON COLUMN cms_assets.metadata IS 'JSON com width, height, e outros metadados';

CREATE INDEX idx_cms_assets_created ON cms_assets(created_at DESC);

-- ============================================================================
-- 4. CREATE TABLE cms_versions
-- Histórico de versões para rollback
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_versions (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  version_number INT NOT NULL,
  data_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  UNIQUE(entity_type, entity_id, version_number),
  CONSTRAINT cms_versions_type CHECK (entity_type IN ('page', 'block'))
);

COMMENT ON TABLE cms_versions IS 'Histórico de versões para rollback (RF-ADM-008)';
COMMENT ON COLUMN cms_versions.entity_type IS 'Tipo de entidade: page ou block';
COMMENT ON COLUMN cms_versions.version_number IS 'Número sequencial da versão';
COMMENT ON COLUMN cms_versions.data_snapshot IS 'Snapshot completo do conteúdo naquele momento';

CREATE INDEX idx_cms_versions_entity ON cms_versions(entity_type, entity_id);
CREATE INDEX idx_cms_versions_created ON cms_versions(created_at DESC);

-- ============================================================================
-- 5. CREATE TABLE cms_audit_log
-- Log de auditoria (append-only)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email VARCHAR(255),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  entity_name VARCHAR(255),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT cms_audit_log_action CHECK (action IN ('create', 'update', 'publish', 'revert', 'delete', 'upload'))
);

COMMENT ON TABLE cms_audit_log IS 'Log de auditoria do Admin CMS (append-only) (RF-ADM-010)';
COMMENT ON COLUMN cms_audit_log.action IS 'Ação realizada: create, update, publish, revert, delete, upload';
COMMENT ON COLUMN cms_audit_log.details IS 'JSON com detalhes adicionais ou diff resumido';

CREATE INDEX idx_cms_audit_log_actor ON cms_audit_log(actor_id);
CREATE INDEX idx_cms_audit_log_entity ON cms_audit_log(entity_type, entity_id);
CREATE INDEX idx_cms_audit_log_created ON cms_audit_log(created_at DESC);

-- ============================================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- Implementar políticas de segurança conforme mandato no CMS_ADMIN_SPEC.md
-- ============================================================================

-- Enable RLS on all CMS tables
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6.1 cms_pages RLS Policies
-- ============================================================================

-- Política: Público (anon) lê apenas published
CREATE POLICY "cms_pages_anon_read" ON cms_pages
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Política: Admin (authenticated) lê tudo
CREATE POLICY "cms_pages_authenticated_read" ON cms_pages
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Admin (authenticated) escreve
CREATE POLICY "cms_pages_authenticated_write" ON cms_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 6.2 cms_blocks RLS Policies
-- ============================================================================

-- Política: Público (anon) lê apenas blocos de páginas published
CREATE POLICY "cms_blocks_anon_read" ON cms_blocks
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_blocks.page_id
      AND cms_pages.status = 'published'
    )
  );

-- Política: Admin (authenticated) lê tudo
CREATE POLICY "cms_blocks_authenticated_read" ON cms_blocks
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Admin (authenticated) escreve
CREATE POLICY "cms_blocks_authenticated_write" ON cms_blocks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 6.3 cms_assets RLS Policies
-- ============================================================================

-- Política: Público (anon) lê (imagens são públicas)
CREATE POLICY "cms_assets_anon_read" ON cms_assets
  FOR SELECT
  TO anon
  USING (true);

-- Política: Admin (authenticated) escreve
CREATE POLICY "cms_assets_authenticated_write" ON cms_assets
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 6.4 cms_versions RLS Policies (admin only)
-- ============================================================================

-- Política: Admin (authenticated) lê
CREATE POLICY "cms_versions_authenticated_read" ON cms_versions
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Admin (authenticated) insere
CREATE POLICY "cms_versions_authenticated_insert" ON cms_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- 6.5 cms_audit_log RLS Policies (admin only)
-- ============================================================================

-- Política: Admin (authenticated) lê
CREATE POLICY "cms_audit_log_authenticated_read" ON cms_audit_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Admin (authenticated) insere (append-only)
CREATE POLICY "cms_audit_log_authenticated_insert" ON cms_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- 7. SEED DATA (Sprint CMS v0)
-- Criar página "Home" com bloco "hero_title" para MVP
-- ============================================================================

INSERT INTO cms_pages (slug, title, description, status)
VALUES ('home', 'Página Inicial', 'Home do site', 'draft')
ON CONFLICT (slug) DO NOTHING;

-- Obter ID da página home
INSERT INTO cms_blocks (page_id, block_key, block_type, content_draft, content_published, display_order)
SELECT
  (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1),
  'hero_title',
  'text',
  '{"value": "Advogados especialistas em leilão de imóveis e direito imobiliário"}',
  '{"value": "Advogados especialistas em leilão de imóveis e direito imobiliário"}',
  0
WHERE NOT EXISTS (
  SELECT 1 FROM cms_blocks
  WHERE page_id = (SELECT id FROM cms_pages WHERE slug = 'home' LIMIT 1)
  AND block_key = 'hero_title'
);

-- ============================================================================
-- END OF MIGRATION
-- Status: Tables criadas com RLS habilitado e seed data inicial
-- Próximo passo: Implementar rotas /admin/* e componentes React
-- ============================================================================
