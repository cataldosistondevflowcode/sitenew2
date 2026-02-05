/**
 * Hook: useRegionalCmsContent
 * 
 * Carrega conteúdo CMS de páginas regionais para o site público.
 * Sprint CMS v14 — Regionais via CMS
 * 
 * Funcionalidades:
 * - Busca página CMS publicada por slug regional
 * - Carrega blocos associados (apenas content_published)
 * - Retorna dados estruturados para renderização
 * - Fallback seguro: retorna vazio se CMS não disponível
 * 
 * REGRA: Nunca altera imoveis ou seo_pages (apenas leitura do CMS)
 */

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interface para bloco CMS publicado
export interface RegionalCmsBlock {
  block_key: string;
  block_type: string;
  content_published: Record<string, any>;
  display_order: number;
}

// Interface para conteúdo estruturado da regional
export interface RegionalCmsContent {
  // Hero
  heroTitle?: string;
  heroDesc?: string;
  introText?: string;
  
  // Listas de conteúdo
  neighborhoods?: string[];
  attractions?: string[];
  infrastructure?: string[];
  highlights?: string[];
  
  // Sobre/CTA
  aboutTitle?: string;
  aboutDesc?: string;
  finalCta?: {
    text: string;
    url: string;
    style?: string;
    target?: string;
  };
}

// Interface de retorno do hook
export interface UseRegionalCmsContentResult {
  blocks: RegionalCmsBlock[];
  content: RegionalCmsContent;
  loading: boolean;
  error: string | null;
  hasContent: boolean;
  hasCmsPage: boolean;
}

/**
 * Extrai conteúdo estruturado dos blocos CMS
 */
function extractContent(blocks: RegionalCmsBlock[]): RegionalCmsContent {
  const content: RegionalCmsContent = {};
  
  for (const block of blocks) {
    const published = block.content_published;
    if (!published) continue;
    
    switch (block.block_key) {
      case 'region_hero_title':
        content.heroTitle = published.value;
        break;
      case 'region_hero_desc':
        content.heroDesc = published.value;
        break;
      case 'region_intro_text':
        content.introText = published.value;
        break;
      case 'region_content_neighborhoods':
        content.neighborhoods = published.items;
        break;
      case 'region_content_attractions':
        content.attractions = published.items;
        break;
      case 'region_content_infrastructure':
        content.infrastructure = published.items;
        break;
      case 'region_content_highlights':
        content.highlights = published.items;
        break;
      case 'region_about_title':
        content.aboutTitle = published.value;
        break;
      case 'region_about_desc':
        content.aboutDesc = published.value;
        break;
      case 'region_final_cta':
        content.finalCta = {
          text: published.text,
          url: published.url,
          style: published.style,
          target: published.target,
        };
        break;
    }
  }
  
  return content;
}

/**
 * Hook para carregar conteúdo CMS de páginas regionais
 * 
 * @param regionSlug - Slug da página regional (ex: 'copacabana', 'zona-sul-rj')
 *                     O hook adiciona o prefixo 'regional-' automaticamente
 * @returns Blocos CMS, conteúdo estruturado, estado de loading/erro
 * 
 * @example
 * const { content, hasContent, loading } = useRegionalCmsContent('copacabana');
 * if (hasContent) {
 *   // Renderizar do CMS
 * } else {
 *   // Fallback para seo_pages
 * }
 */
export function useRegionalCmsContent(regionSlug: string): UseRegionalCmsContentResult {
  const [blocks, setBlocks] = useState<RegionalCmsBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCmsPage, setHasCmsPage] = useState(false);

  // Slug completo com prefixo
  const fullSlug = regionSlug.startsWith('regional-') ? regionSlug : `regional-${regionSlug}`;

  useEffect(() => {
    const loadContent = async () => {
      // Se não tiver slug, não busca
      if (!regionSlug) {
        setLoading(false);
        setBlocks([]);
        setHasCmsPage(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Buscar página CMS publicada
        const { data: page, error: pageError } = await supabase
          .from('cms_pages')
          .select('id, status')
          .eq('slug', fullSlug)
          .eq('status', 'published')
          .maybeSingle();

        // Se não encontrou página ou erro, retorna vazio (fallback)
        if (pageError) {
          console.warn(`[useRegionalCmsContent] Erro ao buscar página ${fullSlug}:`, pageError.message);
          setBlocks([]);
          setHasCmsPage(false);
          return;
        }

        if (!page) {
          // Página CMS não existe para essa regional = fallback
          setBlocks([]);
          setHasCmsPage(false);
          return;
        }

        setHasCmsPage(true);

        // 2. Buscar blocos publicados da página
        const { data: blocksData, error: blocksError } = await supabase
          .from('cms_blocks')
          .select('block_key, block_type, content_published, display_order')
          .eq('page_id', page.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (blocksError) {
          console.warn(`[useRegionalCmsContent] Erro ao buscar blocos:`, blocksError.message);
          setBlocks([]);
          return;
        }

        // 3. Filtrar blocos com conteúdo válido
        const validBlocks = (blocksData || []).filter((block) => {
          const content = block.content_published;
          if (!content || typeof content !== 'object') return false;
          
          // Verificar se tem pelo menos um valor não-vazio
          if ('value' in content) {
            return content.value && String(content.value).trim() !== '';
          }
          if ('items' in content) {
            return Array.isArray(content.items) && content.items.length > 0;
          }
          if ('text' in content) {
            return content.text && String(content.text).trim() !== '';
          }
          
          return Object.keys(content).length > 0;
        });

        setBlocks(validBlocks as RegionalCmsBlock[]);
      } catch (err) {
        console.error('[useRegionalCmsContent] Erro inesperado:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setBlocks([]);
        setHasCmsPage(false);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [regionSlug, fullSlug]);

  // Extrair conteúdo estruturado dos blocos
  const content = useMemo(() => extractContent(blocks), [blocks]);

  // Verificar se tem conteúdo significativo
  const hasContent = useMemo(() => {
    return blocks.length > 0 && (
      !!content.heroTitle ||
      !!content.introText ||
      (content.neighborhoods && content.neighborhoods.length > 0) ||
      (content.attractions && content.attractions.length > 0) ||
      (content.infrastructure && content.infrastructure.length > 0) ||
      (content.highlights && content.highlights.length > 0)
    );
  }, [blocks, content]);

  return {
    blocks,
    content,
    loading,
    error,
    hasContent,
    hasCmsPage,
  };
}
