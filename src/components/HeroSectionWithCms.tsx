/**
 * Componente: HeroSectionWithCms
 * 
 * Renderiza o HeroSection com conteudo carregado do CMS (publico)
 * Se o CMS falhar, usa fallback ao conteúdo padrão
 * Sprint CMS v11 — Home publica CMS-driven
 */

import React from 'react';
import { HeroSection } from './HeroSection';
import { useCmsPublishedBlocks } from '@/hooks/useCmsPublishedBlocks';

interface HeroSectionWithCmsProps {
  onOpportunityClick?: () => void;
}

export const HeroSectionWithCms = ({ onOpportunityClick }: HeroSectionWithCmsProps) => {
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

  return (
    <HeroSection
      onOpportunityClick={onOpportunityClick}
      title={heroTitle}
      subtitleHtml={heroSubtitleHtml}
      backgroundImageUrl={heroImageUrl}
      primaryCta={
        primaryCta?.text && primaryCta?.url ? { text: primaryCta.text, url: primaryCta.url } : undefined
      }
      secondaryCta={
        secondaryCta?.text && secondaryCta?.url ? { text: secondaryCta.text, url: secondaryCta.url } : undefined
      }
    />
  );
};
