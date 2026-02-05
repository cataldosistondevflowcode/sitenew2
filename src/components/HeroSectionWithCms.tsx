/**
 * Componente: HeroSectionWithCms
 * 
 * Renderiza o HeroSection com conteúdo carregado do CMS (público).
 * Se o CMS falhar ou não tiver conteúdo, usa fallback ao conteúdo padrão.
 * 
 * Sprint CMS v11 — Home pública CMS-driven
 * Reabilitado em 2026-02-05 após correção do conteúdo no CMS
 */

import React from 'react';
import { HeroSection } from './HeroSection';
import { useCmsPublishedBlocks } from '@/hooks/useCmsPublishedBlocks';

interface HeroSectionWithCmsProps {
  onOpportunityClick?: () => void;
}

export const HeroSectionWithCms = ({ onOpportunityClick }: HeroSectionWithCmsProps) => {
  const { blocksByKey, loading, error } = useCmsPublishedBlocks('leilao-rj', [
    'hero_title',
    'hero_subtitle',
    'hero_image',
    'hero_cta_primary',
    'hero_cta_secondary',
  ]);

  // Extrair valores do CMS (com fallback para undefined, que HeroSection trata)
  const heroTitle = blocksByKey.hero_title?.content_published?.value as string | undefined;
  const heroSubtitleHtml = blocksByKey.hero_subtitle?.content_published?.value as string | undefined;
  const heroImageUrl = blocksByKey.hero_image?.content_published?.url as string | undefined;

  const primaryCta = blocksByKey.hero_cta_primary?.content_published as
    | { text?: string; url?: string }
    | undefined;
  const secondaryCta = blocksByKey.hero_cta_secondary?.content_published as
    | { text?: string; url?: string }
    | undefined;

  // Se CMS falhar ou estiver carregando, usa fallbacks do HeroSection
  // O HeroSection já tem valores padrão, então passamos undefined para usar fallback
  if (error) {
    console.warn('[HeroSectionWithCms] Erro ao carregar CMS, usando fallback:', error);
  }

  return (
    <HeroSection
      onOpportunityClick={onOpportunityClick}
      title={heroTitle}
      subtitleHtml={heroSubtitleHtml}
      backgroundImageUrl={heroImageUrl}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta || { text: 'Fale Conosco', url: 'https://wa.me/5521977294848' }}
    />
  );
};
