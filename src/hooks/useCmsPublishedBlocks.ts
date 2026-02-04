/**
 * Hook: useCmsPublishedBlocks
 *
 * Leitura publica (anon) de blocos CMS publicados.
 * - Respeita RLS: anon so enxerga cms_pages.status='published'
 * - Retorna blocos ordenados + mapa por block_key
 *
 * Sprint CMS v11 — Home publica CMS-driven + paginas institucionais
 */

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CmsBlockType = 'text' | 'richtext' | 'image' | 'cta' | 'list' | 'faq' | 'banner';

export type CmsPublishedBlock = {
  id: number;
  block_key: string;
  block_type: CmsBlockType;
  content_published: Record<string, any> | null;
  display_order: number;
};

export function useCmsPublishedBlocks(pageSlug: string, keys?: string[]) {
  const [blocks, setBlocks] = useState<CmsPublishedBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const { data: pageData, error: pageError } = await supabase
          .from('cms_pages')
          .select('id, slug, status')
          .eq('slug', pageSlug)
          .single();

        if (pageError || !pageData) {
          throw new Error('Pagina CMS nao encontrada ou nao publicada');
        }

        // Se RLS estiver ok, anon so ve published. Ainda assim, garantimos por seguranca.
        if (pageData.status !== 'published') {
          throw new Error('Pagina CMS nao publicada');
        }

        let query = supabase
          .from('cms_blocks')
          .select('id, block_key, block_type, content_published, display_order')
          .eq('page_id', pageData.id)
          .order('display_order', { ascending: true });

        if (keys && keys.length > 0) {
          // @ts-expect-error supabase typings are permissive but TS may not infer .in well
          query = query.in('block_key', keys);
        }

        const { data: blocksData, error: blocksError } = await query;
        if (blocksError) throw blocksError;

        if (!cancelled) {
          setBlocks((blocksData || []) as CmsPublishedBlock[]);
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Erro ao carregar CMS';
          setError(msg);
          setBlocks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pageSlug, JSON.stringify(keys || [])]);

  const blocksByKey = useMemo(() => {
    const map: Record<string, CmsPublishedBlock> = {};
    for (const b of blocks) map[b.block_key] = b;
    return map;
  }, [blocks]);

  return { blocks, blocksByKey, loading, error };
}

