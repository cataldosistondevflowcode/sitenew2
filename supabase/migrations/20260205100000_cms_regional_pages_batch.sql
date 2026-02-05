-- ============================================================================
-- Migration: CMS Regional Pages - Batch Creation
-- Date: 2026-02-05
-- Sprint: CMS v18 — Páginas Regionais Prioritárias
-- Purpose: Criar páginas CMS para regiões de alto tráfego (Zona Sul RJ)
-- 
-- REGRA CRÍTICA: NÃO alterar tabela imoveis ou seo_pages
-- CONVENÇÃO: slugs CMS = 'catalogo-{bairro-normalizado}'
-- ============================================================================

-- ============================================================================
-- 1. CORRIGIR SLUG DA PÁGINA COPACABANA (DEC-ADM-003)
-- ============================================================================
-- A página existente usa 'regional-copacabana', mas a convenção é 'catalogo-copacabana'
UPDATE cms_pages 
SET slug = 'catalogo-copacabana',
    updated_at = NOW()
WHERE slug = 'regional-copacabana';

-- ============================================================================
-- 2. CREATE CMS PAGES: Regionais Prioritárias
-- ============================================================================

-- 2.1 Ipanema
INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'catalogo-ipanema',
  'Regional: Ipanema',
  'Conteúdo editável da página de imóveis em leilão em Ipanema - Zona Sul do Rio de Janeiro',
  'published',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2.2 Leblon
INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'catalogo-leblon',
  'Regional: Leblon',
  'Conteúdo editável da página de imóveis em leilão no Leblon - Zona Sul do Rio de Janeiro',
  'published',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2.3 Barra da Tijuca
INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'catalogo-barra-tijuca',
  'Regional: Barra da Tijuca',
  'Conteúdo editável da página de imóveis em leilão na Barra da Tijuca - Zona Oeste do Rio de Janeiro',
  'published',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2.4 Botafogo
INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'catalogo-botafogo',
  'Regional: Botafogo',
  'Conteúdo editável da página de imóveis em leilão em Botafogo - Zona Sul do Rio de Janeiro',
  'published',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2.5 Flamengo
INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'catalogo-flamengo',
  'Regional: Flamengo',
  'Conteúdo editável da página de imóveis em leilão no Flamengo - Zona Sul do Rio de Janeiro',
  'published',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2.6 Zona Sul RJ (Geral)
INSERT INTO cms_pages (slug, title, description, status, published_at, created_at, updated_at)
VALUES (
  'catalogo-zona-sul-rj',
  'Regional: Zona Sul RJ',
  'Conteúdo editável da página de imóveis em leilão na Zona Sul do Rio de Janeiro',
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
-- 3. CREATE CMS BLOCKS para cada regional
-- ============================================================================

DO $$
DECLARE
  v_page_id BIGINT;
BEGIN
  -- ========================================
  -- IPANEMA
  -- ========================================
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'catalogo-ipanema' LIMIT 1;
  
  IF v_page_id IS NOT NULL THEN
    -- Block 1: region_hero_title
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_title', 'text', 1,
      '{"value": "Imóveis em Leilão em Ipanema"}',
      '{"value": "Imóveis em Leilão em Ipanema"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 2: region_hero_desc
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_desc', 'richtext', 2,
      '{"value": "<p>Ipanema é sinônimo de sofisticação e qualidade de vida no Rio de Janeiro. Famosa pela praia imortalizada em canção, o bairro oferece as melhores lojas, restaurantes e uma atmosfera cosmopolita única. Encontre oportunidades exclusivas de imóveis em leilão com a Cataldo & Siston.</p>", "format": "html"}',
      '{"value": "<p>Ipanema é sinônimo de sofisticação e qualidade de vida no Rio de Janeiro. Famosa pela praia imortalizada em canção, o bairro oferece as melhores lojas, restaurantes e uma atmosfera cosmopolita única. Encontre oportunidades exclusivas de imóveis em leilão com a Cataldo & Siston.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 3: region_intro_text
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_intro_text', 'richtext', 3,
      '{"value": "<p>Ipanema é considerado um dos metros quadrados mais valorizados do Brasil. O bairro possui ruas arborizadas, forte comércio de luxo na Rua Garcia DÁvila e Visconde de Pirajá, além de praças charmosas. Ideal para quem busca qualidade de vida e investimento seguro.</p>", "format": "html"}',
      '{"value": "<p>Ipanema é considerado um dos metros quadrados mais valorizados do Brasil. O bairro possui ruas arborizadas, forte comércio de luxo na Rua Garcia DÁvila e Visconde de Pirajá, além de praças charmosas. Ideal para quem busca qualidade de vida e investimento seguro.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 4: region_content_neighborhoods
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_neighborhoods', 'list', 4,
      '{"items": ["Ipanema", "Arpoador", "Lagoa"]}',
      '{"items": ["Ipanema", "Arpoador", "Lagoa"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 5: region_content_attractions
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_attractions', 'list', 5,
      '{"items": ["Praia de Ipanema", "Pedra do Arpoador", "Praça Nossa Senhora da Paz", "Feira Hippie", "Pôr do Sol no Arpoador"]}',
      '{"items": ["Praia de Ipanema", "Pedra do Arpoador", "Praça Nossa Senhora da Paz", "Feira Hippie", "Pôr do Sol no Arpoador"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 6: region_content_infrastructure
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_infrastructure', 'list', 6,
      '{"items": ["Metrô General Osório", "Hospital São Lucas", "Colégio Andrews", "Shopping Leblon", "Rua Garcia DÁvila (comércio de luxo)"]}',
      '{"items": ["Metrô General Osório", "Hospital São Lucas", "Colégio Andrews", "Shopping Leblon", "Rua Garcia DÁvila (comércio de luxo)"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 7: region_content_highlights
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_highlights', 'list', 7,
      '{"items": ["Metro quadrado entre os mais valorizados do Brasil", "Pôr do sol icônico no Arpoador", "Proximidade com a Lagoa Rodrigo de Freitas", "Ambiente cosmopolita e seguro", "Gastronomia de alto nível"]}',
      '{"items": ["Metro quadrado entre os mais valorizados do Brasil", "Pôr do sol icônico no Arpoador", "Proximidade com a Lagoa Rodrigo de Freitas", "Ambiente cosmopolita e seguro", "Gastronomia de alto nível"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 8: region_about_title
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_title', 'text', 8,
      '{"value": "Por que comprar imóvel em leilão em Ipanema com a Cataldo & Siston?"}',
      '{"value": "Por que comprar imóvel em leilão em Ipanema com a Cataldo & Siston?"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 9: region_about_desc
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_desc', 'richtext', 9,
      '{"value": "<p>Somos especialistas em leilões de imóveis de alto padrão com mais de 20 anos de experiência. Em Ipanema, já ajudamos dezenas de clientes a adquirir apartamentos de frente para o mar com economia significativa em relação ao valor de mercado.</p><p>Nossa equipe de advogados especializados analisa cada oportunidade, verifica a documentação e acompanha você em todo o processo de arrematação.</p>", "format": "html"}',
      '{"value": "<p>Somos especialistas em leilões de imóveis de alto padrão com mais de 20 anos de experiência. Em Ipanema, já ajudamos dezenas de clientes a adquirir apartamentos de frente para o mar com economia significativa em relação ao valor de mercado.</p><p>Nossa equipe de advogados especializados analisa cada oportunidade, verifica a documentação e acompanha você em todo o processo de arrematação.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    -- Block 10: region_final_cta
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_final_cta', 'cta', 10,
      '{"text": "Fale com um Especialista em Ipanema", "url": "/contato?regiao=ipanema", "style": "primary", "target": "_self"}',
      '{"text": "Fale com um Especialista em Ipanema", "url": "/contato?regiao=ipanema", "style": "primary", "target": "_self"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    RAISE NOTICE 'CMS Regional Ipanema: página e blocos criados com sucesso';
  END IF;

  -- ========================================
  -- LEBLON
  -- ========================================
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'catalogo-leblon' LIMIT 1;
  
  IF v_page_id IS NOT NULL THEN
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_title', 'text', 1,
      '{"value": "Imóveis em Leilão no Leblon"}',
      '{"value": "Imóveis em Leilão no Leblon"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_desc', 'richtext', 2,
      '{"value": "<p>O Leblon é o bairro mais exclusivo do Rio de Janeiro, com o metro quadrado mais valorizado da cidade. Oferece segurança, tranquilidade e sofisticação em um ambiente familiar. Encontre oportunidades únicas de imóveis em leilão com assessoria especializada.</p>", "format": "html"}',
      '{"value": "<p>O Leblon é o bairro mais exclusivo do Rio de Janeiro, com o metro quadrado mais valorizado da cidade. Oferece segurança, tranquilidade e sofisticação em um ambiente familiar. Encontre oportunidades únicas de imóveis em leilão com assessoria especializada.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_intro_text', 'richtext', 3,
      '{"value": "<p>O Leblon combina a beleza natural da praia com uma infraestrutura completa de serviços premium. Ruas arborizadas, restaurantes renomados, o Shopping Leblon e escolas tradicionais fazem do bairro a escolha preferida de famílias de alto padrão.</p>", "format": "html"}',
      '{"value": "<p>O Leblon combina a beleza natural da praia com uma infraestrutura completa de serviços premium. Ruas arborizadas, restaurantes renomados, o Shopping Leblon e escolas tradicionais fazem do bairro a escolha preferida de famílias de alto padrão.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_neighborhoods', 'list', 4,
      '{"items": ["Leblon", "Gávea", "Jardim Botânico"]}',
      '{"items": ["Leblon", "Gávea", "Jardim Botânico"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_attractions', 'list', 5,
      '{"items": ["Praia do Leblon", "Baixo Leblon", "Mirante do Leblon", "Shopping Leblon", "Jardim de Alah"]}',
      '{"items": ["Praia do Leblon", "Baixo Leblon", "Mirante do Leblon", "Shopping Leblon", "Jardim de Alah"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_infrastructure', 'list', 6,
      '{"items": ["Metrô Antero de Quental", "Metrô Jardim de Alah", "Colégio Santo Agostinho", "Shopping Leblon", "Restaurantes renomados"]}',
      '{"items": ["Metrô Antero de Quental", "Metrô Jardim de Alah", "Colégio Santo Agostinho", "Shopping Leblon", "Restaurantes renomados"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_highlights', 'list', 7,
      '{"items": ["Metro quadrado mais caro do Rio de Janeiro", "Ambiente familiar e seguro", "Baixa criminalidade", "Proximidade com PUC-Rio e Gávea", "Praia tranquila e menos movimentada"]}',
      '{"items": ["Metro quadrado mais caro do Rio de Janeiro", "Ambiente familiar e seguro", "Baixa criminalidade", "Proximidade com PUC-Rio e Gávea", "Praia tranquila e menos movimentada"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_title', 'text', 8,
      '{"value": "Por que comprar imóvel em leilão no Leblon com a Cataldo & Siston?"}',
      '{"value": "Por que comprar imóvel em leilão no Leblon com a Cataldo & Siston?"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_desc', 'richtext', 9,
      '{"value": "<p>Imóveis no Leblon raramente aparecem em leilão, e quando aparecem, representam oportunidades excepcionais. Nossa equipe tem expertise em identificar e analisar essas oportunidades únicas.</p><p>Com mais de 20 anos de experiência em leilões de imóveis de luxo, garantimos segurança jurídica e acompanhamento completo do processo.</p>", "format": "html"}',
      '{"value": "<p>Imóveis no Leblon raramente aparecem em leilão, e quando aparecem, representam oportunidades excepcionais. Nossa equipe tem expertise em identificar e analisar essas oportunidades únicas.</p><p>Com mais de 20 anos de experiência em leilões de imóveis de luxo, garantimos segurança jurídica e acompanhamento completo do processo.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_final_cta', 'cta', 10,
      '{"text": "Fale com um Especialista no Leblon", "url": "/contato?regiao=leblon", "style": "primary", "target": "_self"}',
      '{"text": "Fale com um Especialista no Leblon", "url": "/contato?regiao=leblon", "style": "primary", "target": "_self"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    RAISE NOTICE 'CMS Regional Leblon: página e blocos criados com sucesso';
  END IF;

  -- ========================================
  -- BARRA DA TIJUCA
  -- ========================================
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'catalogo-barra-tijuca' LIMIT 1;
  
  IF v_page_id IS NOT NULL THEN
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_title', 'text', 1,
      '{"value": "Imóveis em Leilão na Barra da Tijuca"}',
      '{"value": "Imóveis em Leilão na Barra da Tijuca"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_desc', 'richtext', 2,
      '{"value": "<p>A Barra da Tijuca é o bairro que mais cresce no Rio de Janeiro, com infraestrutura moderna, condomínios de alto padrão e a maior praia urbana da cidade com 18km de extensão. Encontre oportunidades de leilão com a Cataldo & Siston.</p>", "format": "html"}',
      '{"value": "<p>A Barra da Tijuca é o bairro que mais cresce no Rio de Janeiro, com infraestrutura moderna, condomínios de alto padrão e a maior praia urbana da cidade com 18km de extensão. Encontre oportunidades de leilão com a Cataldo & Siston.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_intro_text', 'richtext', 3,
      '{"value": "<p>A Barra da Tijuca é conhecida por seus grandes condomínios, shoppings de primeira linha e qualidade de vida. O bairro oferece opções para todos os perfis, desde apartamentos compactos até mansões em condomínios fechados.</p>", "format": "html"}',
      '{"value": "<p>A Barra da Tijuca é conhecida por seus grandes condomínios, shoppings de primeira linha e qualidade de vida. O bairro oferece opções para todos os perfis, desde apartamentos compactos até mansões em condomínios fechados.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_neighborhoods', 'list', 4,
      '{"items": ["Barra da Tijuca", "Recreio dos Bandeirantes", "Itanhangá", "São Conrado", "Joá"]}',
      '{"items": ["Barra da Tijuca", "Recreio dos Bandeirantes", "Itanhangá", "São Conrado", "Joá"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_attractions', 'list', 5,
      '{"items": ["Praia da Barra (18km)", "Barra Shopping", "Village Mall", "Parque Olímpico", "Bosque da Barra"]}',
      '{"items": ["Praia da Barra (18km)", "Barra Shopping", "Village Mall", "Parque Olímpico", "Bosque da Barra"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_infrastructure', 'list', 6,
      '{"items": ["BRT TransOeste", "Hospital Barra DÓr", "Colégios particulares (Eleva, Escola Americana)", "Village Mall", "Cidade das Artes"]}',
      '{"items": ["BRT TransOeste", "Hospital Barra DÓr", "Colégios particulares (Eleva, Escola Americana)", "Village Mall", "Cidade das Artes"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_highlights', 'list', 7,
      '{"items": ["18km de praia", "Condomínios com infraestrutura completa", "Sede dos Jogos Olímpicos 2016", "Maior polo de shoppings do Rio", "Área em constante valorização"]}',
      '{"items": ["18km de praia", "Condomínios com infraestrutura completa", "Sede dos Jogos Olímpicos 2016", "Maior polo de shoppings do Rio", "Área em constante valorização"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_title', 'text', 8,
      '{"value": "Por que comprar imóvel em leilão na Barra da Tijuca com a Cataldo & Siston?"}',
      '{"value": "Por que comprar imóvel em leilão na Barra da Tijuca com a Cataldo & Siston?"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_desc', 'richtext', 9,
      '{"value": "<p>A Barra da Tijuca oferece grande volume de imóveis em leilão, especialmente em condomínios de alto padrão. Nossa equipe conhece profundamente a região e pode identificar as melhores oportunidades.</p><p>Oferecemos análise jurídica completa e acompanhamento em todo o processo de arrematação.</p>", "format": "html"}',
      '{"value": "<p>A Barra da Tijuca oferece grande volume de imóveis em leilão, especialmente em condomínios de alto padrão. Nossa equipe conhece profundamente a região e pode identificar as melhores oportunidades.</p><p>Oferecemos análise jurídica completa e acompanhamento em todo o processo de arrematação.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_final_cta', 'cta', 10,
      '{"text": "Fale com um Especialista na Barra", "url": "/contato?regiao=barra-tijuca", "style": "primary", "target": "_self"}',
      '{"text": "Fale com um Especialista na Barra", "url": "/contato?regiao=barra-tijuca", "style": "primary", "target": "_self"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    RAISE NOTICE 'CMS Regional Barra da Tijuca: página e blocos criados com sucesso';
  END IF;

  -- ========================================
  -- BOTAFOGO
  -- ========================================
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'catalogo-botafogo' LIMIT 1;
  
  IF v_page_id IS NOT NULL THEN
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_title', 'text', 1,
      '{"value": "Imóveis em Leilão em Botafogo"}',
      '{"value": "Imóveis em Leilão em Botafogo"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_desc', 'richtext', 2,
      '{"value": "<p>Botafogo é um bairro tradicional da Zona Sul com vista privilegiada para o Pão de Açúcar e a Baía de Guanabara. Combina história, cultura e praticidade em uma localização estratégica. Encontre oportunidades de leilão com a Cataldo & Siston.</p>", "format": "html"}',
      '{"value": "<p>Botafogo é um bairro tradicional da Zona Sul com vista privilegiada para o Pão de Açúcar e a Baía de Guanabara. Combina história, cultura e praticidade em uma localização estratégica. Encontre oportunidades de leilão com a Cataldo & Siston.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_intro_text', 'richtext', 3,
      '{"value": "<p>Botafogo oferece uma mistura única de prédios históricos e modernos, com forte comércio, vida cultural intensa e fácil acesso a toda cidade pelo metrô. O bairro abriga shoppings, universidades e está próximo ao Aterro do Flamengo.</p>", "format": "html"}',
      '{"value": "<p>Botafogo oferece uma mistura única de prédios históricos e modernos, com forte comércio, vida cultural intensa e fácil acesso a toda cidade pelo metrô. O bairro abriga shoppings, universidades e está próximo ao Aterro do Flamengo.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_neighborhoods', 'list', 4,
      '{"items": ["Botafogo", "Humaitá", "Urca"]}',
      '{"items": ["Botafogo", "Humaitá", "Urca"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_attractions', 'list', 5,
      '{"items": ["Praia de Botafogo", "Bondinho do Pão de Açúcar", "Botafogo Praia Shopping", "Cobal do Humaitá", "Aterro do Flamengo"]}',
      '{"items": ["Praia de Botafogo", "Bondinho do Pão de Açúcar", "Botafogo Praia Shopping", "Cobal do Humaitá", "Aterro do Flamengo"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_infrastructure', 'list', 6,
      '{"items": ["Metrô Botafogo (integração linhas 1 e 2)", "Hospital Samaritano", "Colégio São Vicente", "Botafogo Praia Shopping", "Universidades (PUC, UNIRIO)"]}',
      '{"items": ["Metrô Botafogo (integração linhas 1 e 2)", "Hospital Samaritano", "Colégio São Vicente", "Botafogo Praia Shopping", "Universidades (PUC, UNIRIO)"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_highlights', 'list', 7,
      '{"items": ["Vista para o Pão de Açúcar e Baía de Guanabara", "Estação de metrô com integração de linhas", "Vida cultural intensa", "Gastronomia variada", "Fácil acesso a toda cidade"]}',
      '{"items": ["Vista para o Pão de Açúcar e Baía de Guanabara", "Estação de metrô com integração de linhas", "Vida cultural intensa", "Gastronomia variada", "Fácil acesso a toda cidade"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_title', 'text', 8,
      '{"value": "Por que comprar imóvel em leilão em Botafogo com a Cataldo & Siston?"}',
      '{"value": "Por que comprar imóvel em leilão em Botafogo com a Cataldo & Siston?"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_desc', 'richtext', 9,
      '{"value": "<p>Botafogo é um dos bairros mais procurados por jovens profissionais e famílias que trabalham no Centro ou na Zona Sul. Imóveis em leilão na região oferecem excelente custo-benefício.</p><p>Nossa equipe de advogados especializados garante segurança em todo o processo de arrematação.</p>", "format": "html"}',
      '{"value": "<p>Botafogo é um dos bairros mais procurados por jovens profissionais e famílias que trabalham no Centro ou na Zona Sul. Imóveis em leilão na região oferecem excelente custo-benefício.</p><p>Nossa equipe de advogados especializados garante segurança em todo o processo de arrematação.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_final_cta', 'cta', 10,
      '{"text": "Fale com um Especialista em Botafogo", "url": "/contato?regiao=botafogo", "style": "primary", "target": "_self"}',
      '{"text": "Fale com um Especialista em Botafogo", "url": "/contato?regiao=botafogo", "style": "primary", "target": "_self"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    RAISE NOTICE 'CMS Regional Botafogo: página e blocos criados com sucesso';
  END IF;

  -- ========================================
  -- FLAMENGO
  -- ========================================
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'catalogo-flamengo' LIMIT 1;
  
  IF v_page_id IS NOT NULL THEN
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_title', 'text', 1,
      '{"value": "Imóveis em Leilão no Flamengo"}',
      '{"value": "Imóveis em Leilão no Flamengo"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_desc', 'richtext', 2,
      '{"value": "<p>O Flamengo é um dos bairros mais tradicionais do Rio de Janeiro, com vista para a Baía de Guanabara, o maior parque urbano da cidade e excelente infraestrutura de transporte. Encontre oportunidades de leilão com a Cataldo & Siston.</p>", "format": "html"}',
      '{"value": "<p>O Flamengo é um dos bairros mais tradicionais do Rio de Janeiro, com vista para a Baía de Guanabara, o maior parque urbano da cidade e excelente infraestrutura de transporte. Encontre oportunidades de leilão com a Cataldo & Siston.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_intro_text', 'richtext', 3,
      '{"value": "<p>O Flamengo oferece qualidade de vida com o Aterro do Flamengo à porta, prédios históricos, forte comércio e fácil acesso ao Centro e Zona Sul. Ideal para quem trabalha no Centro e busca qualidade de vida.</p>", "format": "html"}',
      '{"value": "<p>O Flamengo oferece qualidade de vida com o Aterro do Flamengo à porta, prédios históricos, forte comércio e fácil acesso ao Centro e Zona Sul. Ideal para quem trabalha no Centro e busca qualidade de vida.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_neighborhoods', 'list', 4,
      '{"items": ["Flamengo", "Catete", "Laranjeiras", "Glória"]}',
      '{"items": ["Flamengo", "Catete", "Laranjeiras", "Glória"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_attractions', 'list', 5,
      '{"items": ["Aterro do Flamengo", "Marina da Glória", "Museu de Arte Moderna (MAM)", "Praia do Flamengo", "Largo do Machado"]}',
      '{"items": ["Aterro do Flamengo", "Marina da Glória", "Museu de Arte Moderna (MAM)", "Praia do Flamengo", "Largo do Machado"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_infrastructure', 'list', 6,
      '{"items": ["Metrô Flamengo", "Metrô Largo do Machado", "Hospital Federal", "Colégio Pedro II", "Supermercados e comércio local"]}',
      '{"items": ["Metrô Flamengo", "Metrô Largo do Machado", "Hospital Federal", "Colégio Pedro II", "Supermercados e comércio local"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_highlights', 'list', 7,
      '{"items": ["Aterro do Flamengo (maior parque urbano)", "Vista para a Baía de Guanabara", "Arquitetura art déco preservada", "Fácil acesso ao Centro", "Prédios espaçosos com bom custo-benefício"]}',
      '{"items": ["Aterro do Flamengo (maior parque urbano)", "Vista para a Baía de Guanabara", "Arquitetura art déco preservada", "Fácil acesso ao Centro", "Prédios espaçosos com bom custo-benefício"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_title', 'text', 8,
      '{"value": "Por que comprar imóvel em leilão no Flamengo com a Cataldo & Siston?"}',
      '{"value": "Por que comprar imóvel em leilão no Flamengo com a Cataldo & Siston?"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_desc', 'richtext', 9,
      '{"value": "<p>O Flamengo oferece apartamentos espaçosos a preços mais acessíveis que Copacabana e Ipanema, mantendo a qualidade de vida da Zona Sul. Imóveis em leilão na região representam excelentes oportunidades.</p><p>Nossa equipe de advogados especializados garante segurança em todo o processo de arrematação.</p>", "format": "html"}',
      '{"value": "<p>O Flamengo oferece apartamentos espaçosos a preços mais acessíveis que Copacabana e Ipanema, mantendo a qualidade de vida da Zona Sul. Imóveis em leilão na região representam excelentes oportunidades.</p><p>Nossa equipe de advogados especializados garante segurança em todo o processo de arrematação.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_final_cta', 'cta', 10,
      '{"text": "Fale com um Especialista no Flamengo", "url": "/contato?regiao=flamengo", "style": "primary", "target": "_self"}',
      '{"text": "Fale com um Especialista no Flamengo", "url": "/contato?regiao=flamengo", "style": "primary", "target": "_self"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    RAISE NOTICE 'CMS Regional Flamengo: página e blocos criados com sucesso';
  END IF;

  -- ========================================
  -- ZONA SUL RJ (Geral)
  -- ========================================
  SELECT id INTO v_page_id FROM cms_pages WHERE slug = 'catalogo-zona-sul-rj' LIMIT 1;
  
  IF v_page_id IS NOT NULL THEN
    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_title', 'text', 1,
      '{"value": "Imóveis em Leilão na Zona Sul do Rio de Janeiro"}',
      '{"value": "Imóveis em Leilão na Zona Sul do Rio de Janeiro"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_hero_desc', 'richtext', 2,
      '{"value": "<p>A Zona Sul do Rio de Janeiro concentra os bairros mais valorizados da cidade, incluindo Copacabana, Ipanema, Leblon, Botafogo e Flamengo. Região de alto padrão com as melhores praias urbanas do mundo e infraestrutura completa.</p>", "format": "html"}',
      '{"value": "<p>A Zona Sul do Rio de Janeiro concentra os bairros mais valorizados da cidade, incluindo Copacabana, Ipanema, Leblon, Botafogo e Flamengo. Região de alto padrão com as melhores praias urbanas do mundo e infraestrutura completa.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_intro_text', 'richtext', 3,
      '{"value": "<p>A Zona Sul carioca é sinônimo de qualidade de vida, com praias famosas, parques, metrô, hospitais de excelência e as melhores escolas. Os imóveis da região são muito procurados tanto para moradia quanto para investimento.</p>", "format": "html"}',
      '{"value": "<p>A Zona Sul carioca é sinônimo de qualidade de vida, com praias famosas, parques, metrô, hospitais de excelência e as melhores escolas. Os imóveis da região são muito procurados tanto para moradia quanto para investimento.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_neighborhoods', 'list', 4,
      '{"items": ["Copacabana", "Ipanema", "Leblon", "Botafogo", "Flamengo", "Laranjeiras", "Humaitá", "Lagoa", "Gávea", "Jardim Botânico", "Urca", "Leme", "Catete"]}',
      '{"items": ["Copacabana", "Ipanema", "Leblon", "Botafogo", "Flamengo", "Laranjeiras", "Humaitá", "Lagoa", "Gávea", "Jardim Botânico", "Urca", "Leme", "Catete"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_attractions', 'list', 5,
      '{"items": ["Praias (Copacabana, Ipanema, Leblon, Arpoador)", "Lagoa Rodrigo de Freitas", "Jardim Botânico", "Cristo Redentor", "Pão de Açúcar", "Aterro do Flamengo"]}',
      '{"items": ["Praias (Copacabana, Ipanema, Leblon, Arpoador)", "Lagoa Rodrigo de Freitas", "Jardim Botânico", "Cristo Redentor", "Pão de Açúcar", "Aterro do Flamengo"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_infrastructure', 'list', 6,
      '{"items": ["Metrô Linhas 1 e 2", "Hospitais renomados (Copa Star, Samaritano)", "Escolas tradicionais", "Shoppings (Leblon, Rio Sul)", "Universidades (PUC, UFRJ)"]}',
      '{"items": ["Metrô Linhas 1 e 2", "Hospitais renomados (Copa Star, Samaritano)", "Escolas tradicionais", "Shoppings (Leblon, Rio Sul)", "Universidades (PUC, UFRJ)"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_content_highlights', 'list', 7,
      '{"items": ["Praias mundialmente famosas", "Alta valorização imobiliária", "Infraestrutura completa de transporte", "Segurança e qualidade de vida", "Opções para todos os perfis"]}',
      '{"items": ["Praias mundialmente famosas", "Alta valorização imobiliária", "Infraestrutura completa de transporte", "Segurança e qualidade de vida", "Opções para todos os perfis"]}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_title', 'text', 8,
      '{"value": "Por que comprar imóvel em leilão na Zona Sul com a Cataldo & Siston?"}',
      '{"value": "Por que comprar imóvel em leilão na Zona Sul com a Cataldo & Siston?"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_about_desc', 'richtext', 9,
      '{"value": "<p>A Zona Sul concentra os imóveis mais desejados do Rio de Janeiro. Em leilão, é possível encontrar apartamentos com desconto significativo em relação ao valor de mercado.</p><p>Somos especialistas em leilões de imóveis na Zona Sul com mais de 20 anos de experiência. Nossa equipe de advogados garante segurança jurídica em todo o processo.</p>", "format": "html"}',
      '{"value": "<p>A Zona Sul concentra os imóveis mais desejados do Rio de Janeiro. Em leilão, é possível encontrar apartamentos com desconto significativo em relação ao valor de mercado.</p><p>Somos especialistas em leilões de imóveis na Zona Sul com mais de 20 anos de experiência. Nossa equipe de advogados garante segurança jurídica em todo o processo.</p>", "format": "html"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    INSERT INTO cms_blocks (page_id, block_key, block_type, display_order, content_draft, content_published, is_active)
    VALUES (v_page_id, 'region_final_cta', 'cta', 10,
      '{"text": "Fale com um Especialista na Zona Sul", "url": "/contato?regiao=zona-sul", "style": "primary", "target": "_self"}',
      '{"text": "Fale com um Especialista na Zona Sul", "url": "/contato?regiao=zona-sul", "style": "primary", "target": "_self"}'::jsonb, true)
    ON CONFLICT (page_id, block_key) DO UPDATE SET
      content_draft = EXCLUDED.content_draft, content_published = EXCLUDED.content_published, updated_at = NOW();

    RAISE NOTICE 'CMS Regional Zona Sul RJ: página e blocos criados com sucesso';
  END IF;

END $$;

-- ============================================================================
-- 4. LOG DE AUDITORIA
-- ============================================================================
INSERT INTO cms_audit_log (actor_id, actor_email, action, entity_type, entity_name, details)
VALUES (
  NULL,
  'sistema@cataldosiston.com',
  'create',
  'page',
  'regional_pages_batch',
  '{"pages": ["catalogo-ipanema", "catalogo-leblon", "catalogo-barra-tijuca", "catalogo-botafogo", "catalogo-flamengo", "catalogo-zona-sul-rj"], "blocks_per_page": 10, "migration": "20260205100000_cms_regional_pages_batch.sql"}'::jsonb
);

-- ============================================================================
-- END OF MIGRATION
-- Sprint CMS v18 — Páginas Regionais Prioritárias
-- ============================================================================
