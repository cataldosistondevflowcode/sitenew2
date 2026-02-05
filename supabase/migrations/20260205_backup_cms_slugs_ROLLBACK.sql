-- ============================================================
-- BACKUP/ROLLBACK: Estado dos slugs CMS em 2026-02-05
-- ============================================================
-- Este arquivo documenta o estado ANTES da migração de slugs.
-- Use estes comandos para REVERTER caso algo dê errado.
-- ============================================================

-- ESTADO ATUAL (ANTES DA MIGRAÇÃO):
-- | ID | Slug Atual           | Title                  | Status    |
-- |----|----------------------|------------------------|-----------|
-- | 1  | home                 | Página Inicial         | published |
-- | 3  | quem-somos           | Quem Somos             | published |
-- | 4  | assessoria           | Assessoria em Leilões  | published |
-- | 5  | direito-imobiliario  | Direito Imobiliário    | published |
-- | 6  | casos-reais          | Casos Reais            | published |
-- | 7  | blog                 | Blog                   | published |
-- | 8  | contato              | Contato                | published |
-- | 9  | teste-banner         | Página Teste Banner    | draft     |
-- | 10 | regional-copacabana  | Regional: Copacabana   | published |

-- ============================================================
-- COMANDOS DE ROLLBACK (executar se precisar reverter)
-- ============================================================

-- Reverter slug 'leilao-rj' → 'home'
-- UPDATE cms_pages SET slug = 'home' WHERE id = 1;

-- Reverter slug 'catalogo-copacabana' → 'regional-copacabana'
-- UPDATE cms_pages SET slug = 'regional-copacabana' WHERE id = 10;

-- ============================================================
-- ARQUIVOS DE CÓDIGO QUE PRECISAM SER REVERTIDOS:
-- ============================================================
-- 1. src/components/HeroSectionWithCms.tsx
--    Reverter: useCmsPublishedBlocks('leilao-rj', ...) → useCmsPublishedBlocks('home', ...)
--
-- 2. src/components/HomeCmsMarketingSections.tsx
--    Reverter: useCmsPublishedBlocks('leilao-rj', ...) → useCmsPublishedBlocks('home', ...)
--
-- 3. src/hooks/useRegionalCmsContent.ts
--    Reverter: prefixo 'catalogo-' → 'regional-'
-- ============================================================
