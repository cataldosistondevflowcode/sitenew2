/**
 * Componente: HeroSectionWithCms
 * 
 * Renderiza o HeroSection com título carregado do CMS
 * Se o CMS falhar, usa fallback ao conteúdo padrão
 * Sprint CMS v0
 */

import React, { useEffect, useState } from 'react';
import { HeroSection } from './HeroSection';
import { supabase } from '@/integrations/supabase/client';

interface HeroSectionWithCmsProps {
  onOpportunityClick?: () => void;
}

interface HeroBlock {
  content_published?: {
    value?: string;
  };
}

export const HeroSectionWithCms = ({ onOpportunityClick }: HeroSectionWithCmsProps) => {
  const [heroTitle, setHeroTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroTitle = async () => {
      try {
        setLoading(true);

        // 1. Obter página home
        const { data: pageData, error: pageError } = await supabase
          .from('cms_pages')
          .select('id')
          .eq('slug', 'home')
          .single();

        if (pageError || !pageData) {
          console.warn('CMS Home page não encontrada');
          return;
        }

        // 2. Obter bloco hero_title
        const { data: blockData, error: blockError } = await supabase
          .from('cms_blocks')
          .select('content_published')
          .eq('page_id', pageData.id)
          .eq('block_key', 'hero_title')
          .single();

        if (blockError || !blockData) {
          console.warn('CMS hero_title bloco não encontrado');
          return;
        }

        const block = blockData as HeroBlock;
        if (block.content_published?.value) {
          setHeroTitle(block.content_published.value);
        }
      } catch (error) {
        console.warn('Erro ao carregar hero title do CMS:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroTitle();
  }, []);

  // Por enquanto, renderizar apenas o HeroSection padrão
  // Quando implementar editor de hero customizado, usar heroTitle aqui
  return <HeroSection onOpportunityClick={onOpportunityClick} />;
};
