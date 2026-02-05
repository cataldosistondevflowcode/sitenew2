-- ============================================================
-- Sprint CMS v21 — Reordenar Blocos com Drag-and-Drop
-- Data: 2026-02-05
-- 
-- RPC para reordenar blocos de forma atômica
-- ============================================================

-- ============================================================
-- RPC: reorder_blocks_batch
-- Reordena blocos de uma página em uma única transação
-- ============================================================
CREATE OR REPLACE FUNCTION reorder_blocks_batch(
  p_page_id BIGINT,
  p_block_orders JSONB -- Array de {id: number, order: number}
) RETURNS JSONB AS $$
DECLARE
  v_item JSONB;
  v_user_email TEXT;
  v_page_slug TEXT;
  v_old_orders JSONB;
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

  -- Salvar ordens antigas para audit
  SELECT jsonb_agg(
    jsonb_build_object('id', id, 'block_key', block_key, 'order', display_order)
    ORDER BY display_order
  )
  INTO v_old_orders
  FROM cms_blocks
  WHERE page_id = p_page_id;

  -- Atualizar cada bloco
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_block_orders)
  LOOP
    UPDATE cms_blocks
    SET display_order = (v_item->>'order')::INT,
        updated_at = NOW()
    WHERE id = (v_item->>'id')::BIGINT
    AND page_id = p_page_id;
  END LOOP;

  -- Registrar no audit log
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
    'reorder',
    'page',
    p_page_id,
    v_page_slug,
    jsonb_build_object(
      'old_orders', v_old_orders,
      'new_orders', p_block_orders,
      'reordered_at', NOW()
    ),
    NOW()
  );

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reorder_blocks_batch IS 'Reordena blocos de uma página CMS em uma única transação';

-- Permissões
GRANT EXECUTE ON FUNCTION reorder_blocks_batch TO authenticated;
