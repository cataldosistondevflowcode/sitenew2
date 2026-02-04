-- Migration: CMS Publish Atomic + Revert (Sprint CMS v3/v4)
-- Date: 2026-02-03
-- Purpose: RPC publish_block_atomic (salva versão + audit) e revert_block_to_version para rollback

-- ============================================================================
-- 1. publish_block_atomic
-- Publica o draft do bloco de forma atômica: salva versão anterior, atualiza published, audit log.
-- ============================================================================

CREATE OR REPLACE FUNCTION publish_block_atomic(p_block_id BIGINT, p_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_block RECORD;
  v_next_version INT;
  v_page_id BIGINT;
BEGIN
  -- Obter bloco
  SELECT id, page_id, content_draft, content_published, block_key
  INTO v_block
  FROM cms_blocks
  WHERE id = p_block_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Bloco não encontrado');
  END IF;

  -- Próximo número de versão para este bloco
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM cms_versions
  WHERE entity_type = 'block' AND entity_id = p_block_id;

  -- 1) Salvar versão anterior (content_published atual) em cms_versions
  INSERT INTO cms_versions (entity_type, entity_id, version_number, data_snapshot, created_by)
  VALUES (
    'block',
    p_block_id,
    v_next_version,
    COALESCE(v_block.content_published, '{}'::jsonb),
    p_user_id
  );

  -- 2) Atualizar bloco: content_published = content_draft
  UPDATE cms_blocks
  SET
    content_published = COALESCE(v_block.content_draft, content_published),
    updated_at = NOW()
  WHERE id = p_block_id;

  v_page_id := v_block.page_id;

  -- 3) Marcar página como published
  UPDATE cms_pages
  SET status = 'published', published_at = NOW(), updated_at = NOW(), updated_by = p_user_id
  WHERE id = v_page_id;

  -- 4) Audit log
  INSERT INTO cms_audit_log (actor_id, action, entity_type, entity_id, entity_name, details)
  VALUES (
    p_user_id,
    'publish',
    'block',
    p_block_id,
    v_block.block_key,
    jsonb_build_object('version_number', v_next_version, 'timestamp', NOW())
  );

  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

COMMENT ON FUNCTION publish_block_atomic(BIGINT, UUID) IS 'Publicação atômica: salva versão em cms_versions, atualiza bloco e audit log (Sprint CMS v3/v4)';

-- ============================================================================
-- 2. revert_block_to_version
-- Restaura content_draft do bloco a partir de uma versão salva (rollback como draft).
-- ============================================================================

CREATE OR REPLACE FUNCTION revert_block_to_version(p_block_id BIGINT, p_version_id BIGINT, p_user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_version RECORD;
BEGIN
  SELECT id, entity_type, entity_id, data_snapshot
  INTO v_version
  FROM cms_versions
  WHERE id = p_version_id
    AND entity_type = 'block'
    AND entity_id = p_block_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Versão não encontrada ou não pertence a este bloco');
  END IF;

  -- Atualizar content_draft do bloco com o snapshot da versão
  UPDATE cms_blocks
  SET content_draft = v_version.data_snapshot, updated_at = NOW()
  WHERE id = p_block_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Bloco não encontrado');
  END IF;

  -- Audit log
  INSERT INTO cms_audit_log (actor_id, action, entity_type, entity_id, entity_name, details)
  VALUES (
    p_user_id,
    'revert',
    'block',
    p_block_id,
    NULL,
    jsonb_build_object('version_id', p_version_id, 'timestamp', NOW())
  );

  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

COMMENT ON FUNCTION revert_block_to_version(BIGINT, BIGINT, UUID) IS 'Rollback: restaura content_draft a partir de cms_versions (Sprint CMS v4)';
