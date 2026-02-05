-- ============================================================================
-- Migration: Populate CMS Home Content Complete
-- Date: 2026-02-05
-- Sprint: CMS v18 — Conteúdo Completo da Home
-- Purpose: Popular todos os blocos da Home (leilao-rj) com conteúdo real
-- 
-- REGRA CRÍTICA: NÃO alterar tabela imoveis ou seo_pages
-- DECISÃO DEC-ADM-002: Alterações consultadas com usuário antes de executar
-- ============================================================================

-- ============================================================================
-- 1. GARANTIR QUE A PÁGINA leilao-rj EXISTA E ESTEJA PUBLICADA
-- ============================================================================
UPDATE cms_pages 
SET status = 'published',
    published_at = COALESCE(published_at, NOW()),
    updated_at = NOW()
WHERE slug = 'leilao-rj';

-- ============================================================================
-- 2. POPULAR BLOCOS DA HOME (leilao-rj)
-- ============================================================================

DO $$
DECLARE
  v_page_id BIGINT;
BEGIN
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'leilao-rj' LIMIT 1;
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página leilao-rj não encontrada. Execute a migração de renomeação de slugs primeiro.';
  END IF;

  -- ========================================
  -- HERO SECTION BLOCKS
  -- ========================================
  
  -- hero_title (já deve existir, mas garantimos conteúdo correto)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'hero_title', 'text', 1,
    '{"value": "Imóveis em Leilão\nno Rio de Janeiro"}',
    '{"value": "Imóveis em Leilão\nno Rio de Janeiro"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- hero_subtitle
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'hero_subtitle', 'richtext', 2,
    '{"value": "Receba oportunidades de leilões personalizadas, de acordo com o seu perfil.", "format": "text"}',
    '{"value": "Receba oportunidades de leilões personalizadas, de acordo com o seu perfil.", "format": "text"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- hero_image
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'hero_image', 'image', 3,
    '{"url": "/visao-panoramica-rio-janeiro.jpg", "alt": "Vista panorâmica do Rio de Janeiro com destaque para a orla"}',
    '{"url": "/visao-panoramica-rio-janeiro.jpg", "alt": "Vista panorâmica do Rio de Janeiro com destaque para a orla"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- hero_cta_primary
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'hero_cta_primary', 'cta', 4,
    '{"text": "Quero receber novas oportunidades", "url": "https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/", "style": "primary", "target": "_blank"}',
    '{"text": "Quero receber novas oportunidades", "url": "https://leilaodeimoveis-cataldosiston.com/contato-advogados-imobiliarios/", "style": "primary", "target": "_blank"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- hero_cta_secondary
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'hero_cta_secondary', 'cta', 5,
    '{"text": "Fale Conosco", "url": "https://wa.me/5521977294848", "style": "secondary", "target": "_blank"}',
    '{"text": "Fale Conosco", "url": "https://wa.me/5521977294848", "style": "secondary", "target": "_blank"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- ========================================
  -- HIGHLIGHT SECTION BLOCKS (Por que comprar em leilão)
  -- ========================================
  
  -- highlight_section_title
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'highlight_section_title', 'text', 10,
    '{"value": "Por que comprar imóveis em leilão?"}',
    '{"value": "Por que comprar imóveis em leilão?"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- highlight_cards (lista composta)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'highlight_cards', 'list', 11,
    '{
      "items": [
        {
          "title": "Economia de até 50%",
          "description": "Imóveis em leilão podem ser arrematados por valores significativamente abaixo do mercado, representando excelentes oportunidades de investimento.",
          "icon": "percent"
        },
        {
          "title": "Segurança Jurídica",
          "description": "Com assessoria especializada, o processo de arrematação é seguro e transparente, com análise prévia de toda documentação e riscos.",
          "icon": "shield"
        },
        {
          "title": "Diversidade de Imóveis",
          "description": "Apartamentos, casas, terrenos e imóveis comerciais em diversas regiões do Rio de Janeiro e São Paulo.",
          "icon": "home"
        },
        {
          "title": "Acompanhamento Completo",
          "description": "Nossa equipe acompanha todo o processo: desde a análise do edital até a posse do imóvel, garantindo tranquilidade.",
          "icon": "users"
        }
      ]
    }',
    '{
      "items": [
        {
          "title": "Economia de até 50%",
          "description": "Imóveis em leilão podem ser arrematados por valores significativamente abaixo do mercado, representando excelentes oportunidades de investimento.",
          "icon": "percent"
        },
        {
          "title": "Segurança Jurídica",
          "description": "Com assessoria especializada, o processo de arrematação é seguro e transparente, com análise prévia de toda documentação e riscos.",
          "icon": "shield"
        },
        {
          "title": "Diversidade de Imóveis",
          "description": "Apartamentos, casas, terrenos e imóveis comerciais em diversas regiões do Rio de Janeiro e São Paulo.",
          "icon": "home"
        },
        {
          "title": "Acompanhamento Completo",
          "description": "Nossa equipe acompanha todo o processo: desde a análise do edital até a posse do imóvel, garantindo tranquilidade.",
          "icon": "users"
        }
      ]
    }'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- ========================================
  -- HOW IT WORKS SECTION BLOCKS
  -- ========================================
  
  -- how_it_works_title
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'how_it_works_title', 'text', 20,
    '{"value": "Como funciona nossa assessoria?"}',
    '{"value": "Como funciona nossa assessoria?"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- how_it_works_desc
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'how_it_works_desc', 'richtext', 21,
    '{"value": "<p>Oferecemos assessoria jurídica completa para quem deseja comprar imóveis em leilão. Com mais de 20 anos de experiência, nossa equipe de advogados especializados garante segurança em todas as etapas.</p>", "format": "html"}',
    '{"value": "<p>Oferecemos assessoria jurídica completa para quem deseja comprar imóveis em leilão. Com mais de 20 anos de experiência, nossa equipe de advogados especializados garante segurança em todas as etapas.</p>", "format": "html"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- how_it_works_steps (lista composta)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'how_it_works_steps', 'list', 22,
    '{
      "items": [
        {
          "number": 1,
          "title": "Análise de Viabilidade",
          "description": "Realizamos estudo jurídico completo do processo, verificando documentação, débitos pendentes e possíveis riscos."
        },
        {
          "number": 2,
          "title": "Acompanhamento do Leilão",
          "description": "Nossa equipe acompanha o leilão presencialmente ou online, orientando sobre lances e estratégias."
        },
        {
          "number": 3,
          "title": "Pós-Arrematação",
          "description": "Cuidamos de toda a documentação, registro do imóvel e, se necessário, processo de desocupação."
        }
      ]
    }',
    '{
      "items": [
        {
          "number": 1,
          "title": "Análise de Viabilidade",
          "description": "Realizamos estudo jurídico completo do processo, verificando documentação, débitos pendentes e possíveis riscos."
        },
        {
          "number": 2,
          "title": "Acompanhamento do Leilão",
          "description": "Nossa equipe acompanha o leilão presencialmente ou online, orientando sobre lances e estratégias."
        },
        {
          "number": 3,
          "title": "Pós-Arrematação",
          "description": "Cuidamos de toda a documentação, registro do imóvel e, se necessário, processo de desocupação."
        }
      ]
    }'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- ========================================
  -- ABOUT SECTION BLOCKS
  -- ========================================
  
  -- about_section_title
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'about_section_title', 'text', 30,
    '{"value": "Cataldo & Siston Advogados"}',
    '{"value": "Cataldo & Siston Advogados"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- about_section_desc
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'about_section_desc', 'richtext', 31,
    '{"value": "<p>Somos um escritório especializado em leilões de imóveis e direito imobiliário, com <strong>mais de 20 anos de experiência</strong> no mercado.</p><p>Nossa equipe de advogados e especialistas analisa cada oportunidade de leilão, verificando a documentação, identificando riscos e acompanhando você em todo o processo de arrematação.</p><p>Já ajudamos <strong>centenas de clientes</strong> a realizar o sonho de comprar um imóvel com economia de até 50% em relação ao valor de mercado.</p>", "format": "html"}',
    '{"value": "<p>Somos um escritório especializado em leilões de imóveis e direito imobiliário, com <strong>mais de 20 anos de experiência</strong> no mercado.</p><p>Nossa equipe de advogados e especialistas analisa cada oportunidade de leilão, verificando a documentação, identificando riscos e acompanhando você em todo o processo de arrematação.</p><p>Já ajudamos <strong>centenas de clientes</strong> a realizar o sonho de comprar um imóvel com economia de até 50% em relação ao valor de mercado.</p>", "format": "html"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- about_section_image
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'about_section_image', 'image', 32,
    '{"url": "/team-cataldo-siston.jpg", "alt": "Equipe Cataldo & Siston Advogados especialistas em leilão de imóveis"}',
    '{"url": "/team-cataldo-siston.jpg", "alt": "Equipe Cataldo & Siston Advogados especialistas em leilão de imóveis"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- ========================================
  -- FINAL CTA SECTION BLOCKS
  -- ========================================
  
  -- final_cta_title
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'final_cta_title', 'text', 40,
    '{"value": "Pronto para encontrar seu imóvel?"}',
    '{"value": "Pronto para encontrar seu imóvel?"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- final_cta_desc
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'final_cta_desc', 'richtext', 41,
    '{"value": "<p>Entre em contato com nossa equipe e receba uma análise personalizada das oportunidades disponíveis. Sem compromisso.</p>", "format": "html"}',
    '{"value": "<p>Entre em contato com nossa equipe e receba uma análise personalizada das oportunidades disponíveis. Sem compromisso.</p>", "format": "html"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  -- final_cta_button
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (v_page_id, 'final_cta_button', 'cta', 42,
    '{"text": "Falar com Especialista", "url": "https://wa.me/5521977294848?text=Olá! Gostaria de saber mais sobre oportunidades de imóveis em leilão.", "style": "primary", "target": "_blank"}',
    '{"text": "Falar com Especialista", "url": "https://wa.me/5521977294848?text=Olá! Gostaria de saber mais sobre oportunidades de imóveis em leilão.", "style": "primary", "target": "_blank"}'::jsonb, true)
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft, 
    content_published = EXCLUDED.content_published, 
    updated_at = NOW();

  RAISE NOTICE 'CMS Home (leilao-rj): todos os blocos criados/atualizados com sucesso';
END $$;

-- ============================================================================
-- 3. LOG DE AUDITORIA
-- ============================================================================
INSERT INTO cms_audit_log (actor_id, actor_email, action, entity_type, entity_name, details)
VALUES (
  NULL,
  'sistema@cataldosiston.com',
  'update',
  'page',
  'leilao-rj',
  '{
    "migration": "20260205110000_cms_home_content_complete.sql",
    "blocks_updated": [
      "hero_title", "hero_subtitle", "hero_image", "hero_cta_primary", "hero_cta_secondary",
      "highlight_section_title", "highlight_cards",
      "how_it_works_title", "how_it_works_desc", "how_it_works_steps",
      "about_section_title", "about_section_desc", "about_section_image",
      "final_cta_title", "final_cta_desc", "final_cta_button"
    ],
    "total_blocks": 16
  }'::jsonb
);

-- ============================================================================
-- END OF MIGRATION
-- Sprint CMS v18 — Conteúdo Completo da Home
-- ============================================================================
