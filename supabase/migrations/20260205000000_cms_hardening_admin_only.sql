-- ================================================
-- Migration: CMS Hardening - Admin-only write access
-- Sprint: CMS v15
-- Data: 2026-02-05
-- 
-- Objetivo: Restringir escrita no CMS apenas para admins
-- Leitura pública mantida para conteúdo publicado
-- ================================================

-- ================================================
-- 1. CRIAR TABELA admin_users
-- ================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'system'
);

-- Comentário da tabela
COMMENT ON TABLE admin_users IS 'Lista de emails autorizados a editar conteúdo do CMS';

-- RLS: tabela invisível para anon/authenticated (apenas service_role)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- Sem policies = ninguém pode ler via client

-- ================================================
-- 2. SEED: Admins iniciais
-- ================================================
INSERT INTO admin_users (email, name, created_by)
VALUES 
  ('adm@hotmail.com', 'Admin Demo', 'migration'),
  ('contato@cataldosiston-adv.com.br', 'Cataldo Siston', 'migration')
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- 3. CRIAR FUNÇÃO is_cms_admin()
-- ================================================
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

-- ================================================
-- 4. ÍNDICE para performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ================================================
-- 5. ATUALIZAR POLICIES de cms_pages
-- ================================================

-- Remover policy antiga
DROP POLICY IF EXISTS cms_pages_authenticated_write ON cms_pages;

-- Criar policy nova (admin-only)
CREATE POLICY cms_pages_admin_write ON cms_pages
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- ================================================
-- 6. ATUALIZAR POLICIES de cms_blocks
-- ================================================

-- Remover policy antiga
DROP POLICY IF EXISTS cms_blocks_authenticated_write ON cms_blocks;

-- Criar policy nova (admin-only)
CREATE POLICY cms_blocks_admin_write ON cms_blocks
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- ================================================
-- 7. ATUALIZAR POLICIES de cms_assets
-- ================================================

-- Remover policy antiga
DROP POLICY IF EXISTS cms_assets_authenticated_write ON cms_assets;

-- Criar policy nova (admin-only)
CREATE POLICY cms_assets_admin_write ON cms_assets
  FOR ALL TO authenticated
  USING (is_cms_admin())
  WITH CHECK (is_cms_admin());

-- ================================================
-- 8. ATUALIZAR POLICIES de cms_preview_tokens
-- ================================================

-- Remover policies antigas
DROP POLICY IF EXISTS "Authenticated can insert tokens" ON cms_preview_tokens;
DROP POLICY IF EXISTS "Authenticated can delete tokens" ON cms_preview_tokens;

-- Criar policies novas (admin-only)
CREATE POLICY cms_preview_tokens_admin_insert ON cms_preview_tokens
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());

CREATE POLICY cms_preview_tokens_admin_delete ON cms_preview_tokens
  FOR DELETE TO authenticated
  USING (is_cms_admin());

-- ================================================
-- 9. ATUALIZAR POLICIES de cms_audit_log
-- ================================================

-- Remover policies antigas
DROP POLICY IF EXISTS cms_audit_log_authenticated_insert ON cms_audit_log;
DROP POLICY IF EXISTS cms_audit_log_authenticated_read ON cms_audit_log;

-- Criar policies novas (admin-only)
-- Audit log é append-only: apenas INSERT e SELECT, sem UPDATE/DELETE
CREATE POLICY cms_audit_log_admin_insert ON cms_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());

CREATE POLICY cms_audit_log_admin_read ON cms_audit_log
  FOR SELECT TO authenticated
  USING (is_cms_admin());

-- ================================================
-- 10. ATUALIZAR POLICIES de cms_versions
-- ================================================

-- Remover policies antigas
DROP POLICY IF EXISTS cms_versions_authenticated_insert ON cms_versions;
DROP POLICY IF EXISTS cms_versions_authenticated_read ON cms_versions;

-- Criar policies novas (admin-only)
CREATE POLICY cms_versions_admin_insert ON cms_versions
  FOR INSERT TO authenticated
  WITH CHECK (is_cms_admin());

CREATE POLICY cms_versions_admin_read ON cms_versions
  FOR SELECT TO authenticated
  USING (is_cms_admin());

-- ================================================
-- 11. VERIFICAÇÃO (não altera nada, apenas confirma)
-- ================================================
-- As seguintes policies de LEITURA PÚBLICA são mantidas (não alteradas):
-- - cms_pages_anon_read: SELECT onde status='published'
-- - cms_pages_authenticated_read: SELECT all (para admin ver drafts)
-- - cms_blocks_anon_read: SELECT onde página é published
-- - cms_blocks_authenticated_read: SELECT all (para admin ver drafts)
-- - cms_assets_anon_read: SELECT all (imagens públicas)
-- - "Anyone can read tokens": SELECT all (tokens de preview)

-- ================================================
-- RESUMO DAS POLICIES APÓS MIGRATION
-- ================================================
-- | Tabela             | Operação    | Role          | Condição        |
-- |--------------------|-------------|---------------|-----------------|
-- | cms_pages          | ALL (write) | authenticated | is_cms_admin()  |
-- | cms_pages          | SELECT      | anon          | status=published|
-- | cms_pages          | SELECT      | authenticated | true            |
-- | cms_blocks         | ALL (write) | authenticated | is_cms_admin()  |
-- | cms_blocks         | SELECT      | anon          | page published  |
-- | cms_blocks         | SELECT      | authenticated | true            |
-- | cms_assets         | ALL (write) | authenticated | is_cms_admin()  |
-- | cms_assets         | SELECT      | anon          | true            |
-- | cms_preview_tokens | INSERT/DEL  | authenticated | is_cms_admin()  |
-- | cms_preview_tokens | SELECT      | public        | true            |
-- | cms_audit_log      | INSERT/SEL  | authenticated | is_cms_admin()  |
-- | cms_versions       | INSERT/SEL  | authenticated | is_cms_admin()  |
-- | admin_users        | (nenhuma)   | -             | RLS sem policy  |

-- ================================================
-- FIM DA MIGRATION
-- ================================================
