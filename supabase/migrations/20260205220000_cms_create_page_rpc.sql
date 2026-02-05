-- ============================================================
-- Sprint CMS v22 — Criar Novas Páginas pelo Admin
-- Data: 2026-02-05
-- 
-- RPC para criar página CMS de forma segura
-- ============================================================

-- ============================================================
-- RPC: create_page_safe
-- Cria uma nova página CMS com validação
-- ============================================================
CREATE OR REPLACE FUNCTION create_page_safe(
  p_title TEXT,
  p_slug TEXT,
  p_description TEXT DEFAULT '',
  p_create_default_blocks BOOLEAN DEFAULT true
) RETURNS JSONB AS $$
DECLARE
  v_new_page_id BIGINT;
  v_user_email TEXT;
  v_block_id BIGINT;
BEGIN
  -- Validar que usuário é admin
  IF NOT is_cms_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autorizado');
  END IF;

  -- Obter email do usuário para audit
  v_user_email := auth.jwt() ->> 'email';

  -- Validar título
  IF p_title IS NULL OR TRIM(p_title) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Título é obrigatório');
  END IF;

  -- Validar slug: formato correto
  IF NOT (p_slug ~ '^[a-z][a-z0-9-]*[a-z0-9]$' OR p_slug ~ '^[a-z][a-z0-9]?$') THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Slug inválido. Use letras minúsculas, números e hífens. Deve começar e terminar com letra/número.'
    );
  END IF;

  -- Validar slug único
  IF EXISTS (SELECT 1 FROM cms_pages WHERE slug = p_slug) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Slug já existe');
  END IF;

  -- Inserir página
  INSERT INTO cms_pages (
    slug, 
    title, 
    description,
    status,
    created_at,
    updated_at
  )
  VALUES (
    p_slug, 
    TRIM(p_title), 
    COALESCE(TRIM(p_description), ''),
    'draft',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_page_id;

  -- Criar blocos padrão se solicitado
  IF p_create_default_blocks THEN
    -- Bloco de título
    INSERT INTO cms_blocks (
      page_id, block_key, block_type, display_order, 
      content_draft, content_published, is_active, created_at, updated_at
    ) VALUES (
      v_new_page_id, 'hero_title', 'text', 1,
      jsonb_build_object('text', TRIM(p_title)),
      '{}'::jsonb, true, NOW(), NOW()
    );

    -- Bloco de subtítulo
    INSERT INTO cms_blocks (
      page_id, block_key, block_type, display_order, 
      content_draft, content_published, is_active, created_at, updated_at
    ) VALUES (
      v_new_page_id, 'hero_subtitle', 'text', 2,
      jsonb_build_object('text', COALESCE(TRIM(p_description), 'Subtítulo da página')),
      '{}'::jsonb, true, NOW(), NOW()
    );

    -- Bloco de conteúdo principal
    INSERT INTO cms_blocks (
      page_id, block_key, block_type, display_order, 
      content_draft, content_published, is_active, created_at, updated_at
    ) VALUES (
      v_new_page_id, 'main_content', 'richtext', 3,
      jsonb_build_object('html', '<p>Conteúdo principal da página. Edite este texto.</p>'),
      '{}'::jsonb, true, NOW(), NOW()
    );
  END IF;

  -- Audit log
  INSERT INTO cms_audit_log (
    actor_email, 
    action, 
    entity_type, 
    entity_id, 
    entity_name, 
    details,
    created_at
  )
  VALUES (
    v_user_email,
    'create',
    'page',
    v_new_page_id,
    p_slug,
    jsonb_build_object(
      'title', TRIM(p_title),
      'description', COALESCE(TRIM(p_description), ''),
      'created_default_blocks', p_create_default_blocks
    ),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true, 
    'page_id', v_new_page_id,
    'slug', p_slug
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_page_safe IS 'Cria nova página CMS com validação de permissões e unicidade';

-- Permissões
GRANT EXECUTE ON FUNCTION create_page_safe TO authenticated;
