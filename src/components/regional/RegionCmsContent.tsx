/**
 * Componente: RegionCmsContent
 * 
 * Renderiza conteúdo regional editável via CMS.
 * Sprint CMS v14 — Regionais via CMS
 * 
 * Funcionalidades:
 * - Consome hook useRegionalCmsContent
 * - Renderiza listas (bairros, atrações, infraestrutura, highlights)
 * - Layout consistente com RegionContentSection existente
 * - Retorna null se CMS não tiver conteúdo (permite fallback)
 * 
 * REGRA: Não altera imoveis ou seo_pages
 */

import { MapPin, Landmark, Building2, Star } from 'lucide-react';
import { useRegionalCmsContent, RegionalCmsContent as CmsContentType } from '@/hooks/useRegionalCmsContent';

interface RegionCmsContentProps {
  /**
   * Slug da regional (ex: 'copacabana', 'zona-sul-rj')
   * Não precisa do prefixo 'regional-', o hook adiciona automaticamente
   */
  regionSlug: string;
  
  /**
   * Nome da região para exibição no título
   */
  regionName: string;
  
  /**
   * Callback quando CMS não tem conteúdo (para controle de fallback)
   */
  onNoCmsContent?: () => void;
}

/**
 * Componente interno para renderizar a seção de listas (bairros, atrações, etc.)
 */
function RegionListsSection({ 
  regionName, 
  content 
}: { 
  regionName: string; 
  content: CmsContentType;
}) {
  // Montar seções apenas se tiverem itens
  const sections = [
    {
      key: 'neighborhoods',
      title: 'Bairros da Região',
      icon: MapPin,
      items: content.neighborhoods,
    },
    {
      key: 'attractions',
      title: 'Atrações',
      icon: Landmark,
      items: content.attractions,
    },
    {
      key: 'infrastructure',
      title: 'Infraestrutura',
      icon: Building2,
      items: content.infrastructure,
    },
    {
      key: 'highlights',
      title: 'Diferenciais',
      icon: Star,
      items: content.highlights,
    },
  ].filter((section) => section.items && section.items.length > 0);

  // Se não tiver seções, não renderiza
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919] mb-10 text-center">
          Conheça mais sobre {regionName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.key}
                className="bg-[#f5f5f5] rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#191919] flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-medium text-[#191919]">
                    {section.title}
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {section.items?.map((item, index) => (
                    <li
                      key={index}
                      className="font-body text-[#333333] text-sm flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d68e08] mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Componente interno para renderizar seção "Sobre" / CTA
 */
function RegionAboutSection({ content }: { content: CmsContentType }) {
  // Se não tiver título ou descrição, não renderiza
  if (!content.aboutTitle && !content.aboutDesc) {
    return null;
  }

  return (
    <section className="bg-[#f9f9f9] py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {content.aboutTitle && (
          <h2 className="font-display text-2xl md:text-3xl font-medium text-[#191919] mb-6">
            {content.aboutTitle}
          </h2>
        )}
        
        {content.aboutDesc && (
          <div 
            className="prose prose-lg max-w-none text-[#333333] mb-8"
            dangerouslySetInnerHTML={{ __html: content.aboutDesc }}
          />
        )}
        
        {content.finalCta && (
          <a
            href={content.finalCta.url}
            target={content.finalCta.target === '_blank' ? '_blank' : undefined}
            rel={content.finalCta.target === '_blank' ? 'noopener noreferrer' : undefined}
            className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-md hover:shadow-lg ${
              content.finalCta.style === 'primary'
                ? 'bg-[#D68E08] text-white hover:bg-[#B87A07]'
                : content.finalCta.style === 'secondary'
                  ? 'border-2 border-[#D68E08] text-[#D68E08] hover:bg-[#D68E08] hover:text-white'
                  : 'bg-[#D68E08] text-white hover:bg-[#B87A07]'
            }`}
          >
            {content.finalCta.text}
          </a>
        )}
      </div>
    </section>
  );
}

/**
 * Componente interno para renderizar texto introdutório
 */
function RegionIntroSection({ content }: { content: CmsContentType }) {
  if (!content.introText) {
    return null;
  }

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <div 
          className="prose prose-lg max-w-none text-[#333333] text-center"
          dangerouslySetInnerHTML={{ __html: content.introText }}
        />
      </div>
    </section>
  );
}

/**
 * Componente principal: RegionCmsContent
 * 
 * Renderiza todo o conteúdo regional do CMS.
 * Retorna null se CMS não tiver conteúdo (permite fallback para RegionContentSection).
 */
export function RegionCmsContent({ 
  regionSlug, 
  regionName,
  onNoCmsContent,
}: RegionCmsContentProps) {
  const { content, loading, hasContent, hasCmsPage } = useRegionalCmsContent(regionSlug);

  // Enquanto carrega, não renderiza nada (evitar flash)
  if (loading) {
    return null;
  }

  // Se não tem página CMS ou não tem conteúdo, retorna null para fallback
  if (!hasCmsPage || !hasContent) {
    // Notificar que não há conteúdo CMS (para logging ou analytics)
    onNoCmsContent?.();
    return null;
  }

  // Renderizar conteúdo do CMS
  return (
    <div className="region-cms-content">
      {/* Texto introdutório */}
      <RegionIntroSection content={content} />
      
      {/* Listas: bairros, atrações, infraestrutura, highlights */}
      <RegionListsSection regionName={regionName} content={content} />
      
      {/* Seção Sobre + CTA */}
      <RegionAboutSection content={content} />
    </div>
  );
}

/**
 * Hook auxiliar para verificar se regional tem CMS
 * Útil para decidir qual componente renderizar
 */
export function useHasRegionalCms(regionSlug: string): { 
  hasCms: boolean; 
  loading: boolean;
} {
  const { hasCmsPage, loading } = useRegionalCmsContent(regionSlug);
  return { hasCms: hasCmsPage, loading };
}
