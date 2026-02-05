/**
 * Componente: RegionContentWithFallback
 * 
 * Renderiza conteúdo regional com prioridade para CMS e fallback para seo_pages.
 * Sprint CMS v14 — Regionais via CMS
 * 
 * Lógica:
 * 1. Tenta carregar do CMS
 * 2. Se CMS tem conteúdo → renderiza do CMS
 * 3. Se CMS não tem conteúdo → renderiza fallback de seo_pages
 * 
 * REGRA: Nunca duplica conteúdo (ou CMS ou fallback, não ambos)
 */

import { useRegionalCmsContent } from '@/hooks/useRegionalCmsContent';
import { RegionCmsContent } from './RegionCmsContent';
import { RegionContentSection } from './RegionContentSection';

interface RegionContent {
  neighborhoods?: string[];
  attractions?: string[];
  infrastructure?: string[];
  highlights?: string[];
}

interface RegionContentWithFallbackProps {
  /**
   * Slug da regional normalizado (ex: 'copacabana', 'zona-sul')
   * Será usado para buscar página CMS 'regional-{slug}'
   */
  regionSlug: string;
  
  /**
   * Nome da região para exibição
   */
  regionName: string;
  
  /**
   * Conteúdo de fallback (vem da tabela seo_pages)
   */
  fallbackContent?: RegionContent | null;
}

/**
 * Normaliza string para slug (remove acentos, lowercase, hífens)
 */
export function normalizeToSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '');         // Remove hífens no início/fim
}

/**
 * Componente que gerencia CMS vs fallback automaticamente
 */
export function RegionContentWithFallback({
  regionSlug,
  regionName,
  fallbackContent,
}: RegionContentWithFallbackProps) {
  const { hasContent: hasCmsContent, loading } = useRegionalCmsContent(regionSlug);

  // Enquanto carrega, não mostrar nada (evita flash de conteúdo)
  if (loading) {
    return null;
  }

  // Se CMS tem conteúdo, renderiza do CMS
  if (hasCmsContent) {
    return (
      <RegionCmsContent
        regionSlug={regionSlug}
        regionName={regionName}
      />
    );
  }

  // Fallback: renderiza do seo_pages se tiver conteúdo
  if (fallbackContent) {
    const hasAnyContent = 
      (fallbackContent.neighborhoods && fallbackContent.neighborhoods.length > 0) ||
      (fallbackContent.attractions && fallbackContent.attractions.length > 0) ||
      (fallbackContent.infrastructure && fallbackContent.infrastructure.length > 0) ||
      (fallbackContent.highlights && fallbackContent.highlights.length > 0);

    if (hasAnyContent) {
      return (
        <RegionContentSection
          regionName={regionName}
          content={fallbackContent}
        />
      );
    }
  }

  // Sem conteúdo em nenhuma fonte
  return null;
}
