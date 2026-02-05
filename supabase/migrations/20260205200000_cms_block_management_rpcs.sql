-- ============================================================
-- Sprint CMS v20 — Criar/Excluir Blocos Dinamicamente
-- Data: 2026-02-05
-- 
-- RPCs para gerenciar blocos CMS de forma segura:
-- - create_block_safe: Cria novo bloco com validação
-- - delete_block_safe: Remove bloco com backup no audit log
-- ============================================================

-- ============================================================
-- RPC: create_block_safe
-- Cria um novo bloco com validação de permissões e unicidade
-- ============================================================
CREATE OR REPLACE FUNCTION create_block_safe(
  p_page_id BIGINT,
  p_block_key TEXT,
  p_block_type TEXT,
  p_position INT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_new_id BIGINT;
  v_order INT;
  v_user_email TEXT;
  v_page_slug TEXT;
BEGIN
  -- Validar que usuário é admin
  IF NOT is_cms_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autorizado');
  END IF;

  -- Obter email do usuário para audit
  v_user_email := auth.jwt() ->> 'email';

  -- Validar página existe
  SELECT slug INTO v_page_slug FROM cms_pages WHERE id = p_page_id;
  IF v_page_slug IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Página não encontrada');
  END IF;

  -- Validar block_key: formato correto (letras minúsculas, números, underscore)
  IF NOT (p_block_key ~ '^[a-z][a-z0-9_]{2,49}$') THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'block_key inválido. Use 3-50 caracteres: letras minúsculas, números e underscore. Deve começar com letra.'
    );
  END IF;

  -- Validar block_key único na página
  IF EXISTS (SELECT 1 FROM cms_blocks WHERE page_id = p_page_id AND block_key = p_block_key) THEN
    RETURN jsonb_build_object('success', false, 'error', 'block_key já existe nesta página');
  END IF;

  -- Validar block_type
  IF p_block_type NOT IN ('text', 'richtext', 'image', 'cta', 'list', 'faq', 'banner') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tipo de bloco inválido');
  END IF;

  -- Calcular display_order
  IF p_position IS NULL THEN
    -- Adicionar no final
    SELECT COALESCE(MAX(display_order), 0) + 1 INTO v_order 
    FROM cms_blocks 
    WHERE page_id = p_page_id;
  ELSE
    -- Adicionar na posição especificada
    v_order := p_position;
    -- Shift blocos existentes para abrir espaço
    UPDATE cms_blocks 
    SET display_order = display_order + 1,
        updated_at = NOW()
    WHERE page_id = p_page_id 
    AND display_order >= p_position;
  END IF;

  -- Inserir bloco
  INSERT INTO cms_blocks (
    page_id, 
    block_key, 
    block_type, 
    display_order, 
    content_draft, 
    content_published, 
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    p_page_id, 
    p_block_key, 
    p_block_type, 
    v_order, 
    '{}'::jsonb, 
    '{}'::jsonb, 
    true,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_id;

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
    'block',
    v_new_id,
    p_block_key,
    jsonb_build_object(
      'page_id', p_page_id,
      'page_slug', v_page_slug,
      'block_type', p_block_type,
      'display_order', v_order
    ),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true, 
    'block_id', v_new_id,
    'display_order', v_order
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_block_safe IS 'Cria novo bloco CMS com validação de permissões, unicidade e posição';

-- ============================================================
-- RPC: delete_block_safe
-- Remove bloco com backup do conteúdo no audit log
-- ============================================================
CREATE OR REPLACE FUNCTION delete_block_safe(p_block_id BIGINT) RETURNS JSONB AS $$
DECLARE
  v_block RECORD;
  v_user_email TEXT;
  v_page_slug TEXT;
BEGIN
  -- Validar que usuário é admin
  IF NOT is_cms_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autorizado');
  END IF;

  -- Obter email do usuário para audit
  v_user_email := auth.jwt() ->> 'email';

  -- Obter dados do bloco para audit e validação
  SELECT b.*, p.slug as page_slug 
  INTO v_block 
  FROM cms_blocks b
  JOIN cms_pages p ON p.id = b.page_id
  WHERE b.id = p_block_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Bloco não encontrado');
  END IF;

  -- Excluir bloco
  DELETE FROM cms_blocks WHERE id = p_block_id;

  -- Reordenar blocos restantes para fechar gap
  UPDATE cms_blocks 
  SET display_order = display_order - 1,
      updated_at = NOW()
  WHERE page_id = v_block.page_id 
  AND display_order > v_block.display_order;

  -- Audit log com backup do conteúdo
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
    'delete',
    'block',
    p_block_id,
    v_block.block_key,
    jsonb_build_object(
      'page_id', v_block.page_id,
      'page_slug', v_block.page_slug,
      'block_type', v_block.block_type,
      'display_order', v_block.display_order,
      'content_draft_backup', v_block.content_draft,
      'content_published_backup', v_block.content_published,
      'deleted_at', NOW()
    ),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'deleted_block_key', v_block.block_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION delete_block_safe IS 'Remove bloco CMS com backup do conteúdo no audit log';

-- ============================================================
-- Garantir que as funções têm permissões corretas
-- ============================================================
GRANT EXECUTE ON FUNCTION create_block_safe TO authenticated;
GRANT EXECUTE ON FUNCTION delete_block_safe TO authenticated;
