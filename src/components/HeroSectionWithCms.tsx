/**
 * Componente: HeroSectionWithCms
 * 
 * Renderiza o HeroSection com conteudo carregado do CMS (publico)
 * Se o CMS falhar, usa fallback ao conteúdo padrão
 * Sprint CMS v11 — Home publica CMS-driven
 * 
 * TEMPORARIAMENTE DESABILITADO: CMS desabilitado para o Hero
 * Motivo: Conteúdo incorreto no CMS ("Teste v8")
 * Para reabilitar: remover o comentário e usar o código original
 */

import React from 'react';
import { HeroSection } from './HeroSection';
// import { useCmsPublishedBlocks } from '@/hooks/useCmsPublishedBlocks';

interface HeroSectionWithCmsProps {
  onOpportunityClick?: () => void;
}

export const HeroSectionWithCms = ({ onOpportunityClick }: HeroSectionWithCmsProps) => {
  // CMS TEMPORARIAMENTE DESABILITADO - usando valores padrão hardcoded
  // Para reabilitar, descomentar o código abaixo e remover os valores undefined
  
  /*
  const { blocksByKey } = useCmsPublishedBlocks('home', [
    'hero_title',
    'hero_subtitle',
    'hero_image',
    'hero_cta_primary',
    'hero_cta_secondary',
  ]);

  const heroTitle = blocksByKey.hero_title?.content_published?.value as string | undefined;
  const heroSubtitleHtml = blocksByKey.hero_subtitle?.content_published?.value as string | undefined;
  const heroImageUrl = blocksByKey.hero_image?.content_published?.url as string | undefined;

  const primaryCta = blocksByKey.hero_cta_primary?.content_published as
    | { text?: string; url?: string }
    | undefined;
  const secondaryCta = blocksByKey.hero_cta_secondary?.content_published as
    | { text?: string; url?: string }
    | undefined;
  */

  return (
    <HeroSection
      onOpportunityClick={onOpportunityClick}
      // Usando valores padrão definidos no HeroSection.tsx
      title={undefined}
      subtitleHtml={undefined}
      backgroundImageUrl={undefined}
      primaryCta={undefined}
      secondaryCta={{ text: 'Fale Conosco', url: 'https://wa.me/5521977294848' }}
    />
  );
};
