-- Migration: Create CMS page and blocks for Regional Copacabana
-- Date: 2026-02-04
-- Sprint: CMS v14 — Regionais via CMS
-- Purpose: Criar página e blocos CMS para conteúdo editável da regional Copacabana
-- 
-- REGRA CRÍTICA: NÃO alterar tabela imoveis ou seo_pages

-- ============================================================================
-- 1. CREATE CMS PAGE: regional-copacabana
-- ============================================================================

INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'regional-copacabana',
  'Regional: Copacabana',
  'Conteúdo editável da página de imóveis em leilão em Copacabana - Zona Sul do Rio de Janeiro',
  'published',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================================================
-- 2. CREATE CMS BLOCKS for regional-copacabana
-- ============================================================================

-- Variável para referenciar o page_id
DO $$
DECLARE
  v_page_id BIGINT;
BEGIN
  -- Obter ID da página
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'regional-copacabana' LIMIT 1;
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página regional-copacabana não encontrada';
  END IF;

  -- Block 1: region_hero_title (text)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_hero_title',
    'text',
    1,
    '{"value": "Imóveis em Leilão em Copacabana"}',
    '{"value": "Imóveis em Leilão em Copacabana"}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 2: region_hero_desc (richtext)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_hero_desc',
    'richtext',
    2,
    '{"value": "<p>Encontre as melhores oportunidades de imóveis em leilão em Copacabana, um dos bairros mais valorizados e desejados do Rio de Janeiro. Apartamentos com vista para o mar, excelente infraestrutura e localização privilegiada na Zona Sul.</p>", "format": "html"}',
    '{"value": "<p>Encontre as melhores oportunidades de imóveis em leilão em Copacabana, um dos bairros mais valorizados e desejados do Rio de Janeiro. Apartamentos com vista para o mar, excelente infraestrutura e localização privilegiada na Zona Sul.</p>", "format": "html"}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 3: region_intro_text (richtext)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_intro_text',
    'richtext',
    3,
    '{"value": "<p>Copacabana é sinônimo de qualidade de vida no Rio de Janeiro. Com sua famosa orla, calçadão icônico e infraestrutura completa, o bairro oferece tudo o que você precisa: praias, restaurantes, comércio, hospitais e transporte público de qualidade. Investir em um imóvel em Copacabana é garantir valorização e conforto.</p>", "format": "html"}',
    '{"value": "<p>Copacabana é sinônimo de qualidade de vida no Rio de Janeiro. Com sua famosa orla, calçadão icônico e infraestrutura completa, o bairro oferece tudo o que você precisa: praias, restaurantes, comércio, hospitais e transporte público de qualidade. Investir em um imóvel em Copacabana é garantir valorização e conforto.</p>", "format": "html"}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 4: region_content_neighborhoods (list)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_content_neighborhoods',
    'list',
    4,
    '{"items": ["Copacabana", "Leme", "Posto 1 ao Posto 6", "Área nobre próxima ao Forte"]}',
    '{"items": ["Copacabana", "Leme", "Posto 1 ao Posto 6", "Área nobre próxima ao Forte"]}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 5: region_content_attractions (list)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_content_attractions',
    'list',
    5,
    '{"items": ["Praia de Copacabana", "Forte de Copacabana", "Pedra do Arpoador", "Copacabana Palace", "Bip Bip (música ao vivo)", "Feira de Antiguidades"]}',
    '{"items": ["Praia de Copacabana", "Forte de Copacabana", "Pedra do Arpoador", "Copacabana Palace", "Bip Bip (música ao vivo)", "Feira de Antiguidades"]}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 6: region_content_infrastructure (list)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_content_infrastructure',
    'list',
    6,
    '{"items": ["Metrô (estações Cardeal Arcoverde, Siqueira Campos, Cantagalo)", "Hospital Copa Star", "Supermercados (Zona Sul, Pão de Açúcar)", "Escolas e universidades", "Bancos e serviços"]}',
    '{"items": ["Metrô (estações Cardeal Arcoverde, Siqueira Campos, Cantagalo)", "Hospital Copa Star", "Supermercados (Zona Sul, Pão de Açúcar)", "Escolas e universidades", "Bancos e serviços"]}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 7: region_content_highlights (list)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_content_highlights',
    'list',
    7,
    '{"items": ["Alta valorização imobiliária", "Vista para o mar em muitos imóveis", "Infraestrutura completa 24h", "Segurança com policiamento constante", "Fácil acesso a toda Zona Sul"]}',
    '{"items": ["Alta valorização imobiliária", "Vista para o mar em muitos imóveis", "Infraestrutura completa 24h", "Segurança com policiamento constante", "Fácil acesso a toda Zona Sul"]}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 8: region_about_title (text)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_about_title',
    'text',
    8,
    '{"value": "Por que comprar imóvel em leilão em Copacabana com a Cataldo & Siston?"}',
    '{"value": "Por que comprar imóvel em leilão em Copacabana com a Cataldo & Siston?"}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 9: region_about_desc (richtext)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_about_desc',
    'richtext',
    9,
    '{"value": "<p>Somos especialistas em leilões de imóveis com mais de 20 anos de experiência no mercado. Nossa equipe de advogados e especialistas analisa cada oportunidade, verifica a documentação e acompanha você em todo o processo de arrematação.</p><p>Em Copacabana, já ajudamos dezenas de clientes a realizar o sonho de morar na Zona Sul com economia de até 40% em relação ao valor de mercado.</p>", "format": "html"}',
    '{"value": "<p>Somos especialistas em leilões de imóveis com mais de 20 anos de experiência no mercado. Nossa equipe de advogados e especialistas analisa cada oportunidade, verifica a documentação e acompanha você em todo o processo de arrematação.</p><p>Em Copacabana, já ajudamos dezenas de clientes a realizar o sonho de morar na Zona Sul com economia de até 40% em relação ao valor de mercado.</p>", "format": "html"}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  -- Block 10: region_final_cta (cta)
  INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
  VALUES (
    v_page_id,
    'region_final_cta',
    'cta',
    10,
    '{"text": "Fale com um Especialista em Copacabana", "url": "/contato?regiao=copacabana", "style": "primary", "target": "_self"}',
    '{"text": "Fale com um Especialista em Copacabana", "url": "/contato?regiao=copacabana", "style": "primary", "target": "_self"}'::jsonb,
    true
  )
  ON CONFLICT (page_id, block_key) DO UPDATE SET
    content_draft = EXCLUDED.content_draft,
    content_published = EXCLUDED.content_published,
    updated_at = NOW();

  RAISE NOTICE 'CMS Regional Copacabana: página e 10 blocos criados/atualizados com sucesso';
END $$;

-- ============================================================================
-- 3. VERIFY
-- ============================================================================

-- Query para verificar os dados inseridos (pode ser removida em produção)
-- SELECT 
--   p.slug as page_slug,
--   p.title as page_title,
--   p.status as page_status,
--   b.block_key,
--   b.block_type,
--   b.display_order
-- FROM cms_pages p
-- JOIN cms_blocks b ON b.page_id = p.id
-- WHERE p.slug = 'regional-copacabana'
-- ORDER BY b.display_order;

-- ============================================================================
-- END OF MIGRATION
-- Sprint CMS v14 — TASK-002 e TASK-003
-- Próximo passo: Criar hook useRegionalCmsContent e componente RegionCmsContent
-- ============================================================================
