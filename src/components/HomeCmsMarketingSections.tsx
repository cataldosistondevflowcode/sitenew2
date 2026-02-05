/**
 * Componente: HomeCmsMarketingSections
 *
 * Renderiza secoes institucionais opcionais na Home publica,
 * a partir dos blocos publicados do CMS.
 *
 * Sprint CMS v11 — Home publica CMS-driven
 */

import React from 'react';
import { useCmsPublishedBlocks } from '@/hooks/useCmsPublishedBlocks';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';

function getValue(block: any): string | null {
  const v = block?.content_published?.value;
  return typeof v === 'string' && v.trim() ? v : null;
}

export function HomeCmsMarketingSections() {
  const { blocksByKey, loading, error } = useCmsPublishedBlocks('leilao-rj', [
    'highlight_section_title',
    'highlight_cards',
    'how_it_works_title',
    'how_it_works_desc',
    'how_it_works_steps',
    'about_section_title',
    'about_section_desc',
    'about_section_image',
    'final_cta_title',
    'final_cta_desc',
    'final_cta_button',
  ]);

  // Fallback seguro: se nao carregar, nao renderiza secoes extras
  if (loading || error) return null;

  const highlightTitle = getValue(blocksByKey.highlight_section_title);
  const howTitle = getValue(blocksByKey.how_it_works_title);
  const howDescHtml = getValue(blocksByKey.how_it_works_desc);
  const aboutTitle = getValue(blocksByKey.about_section_title);
  const aboutDescHtml = getValue(blocksByKey.about_section_desc);
  const finalTitle = getValue(blocksByKey.final_cta_title);
  const finalDescHtml = getValue(blocksByKey.final_cta_desc);

  const highlightCards = blocksByKey.highlight_cards;
  const howSteps = blocksByKey.how_it_works_steps;
  const aboutImage = blocksByKey.about_section_image;
  const finalButton = blocksByKey.final_cta_button;

  const hasAny =
    highlightTitle ||
    highlightCards ||
    howTitle ||
    howDescHtml ||
    howSteps ||
    aboutTitle ||
    aboutDescHtml ||
    aboutImage ||
    finalTitle ||
    finalDescHtml ||
    finalButton;

  if (!hasAny) return null;

  return (
    <>
      {/* Highlights */}
      {(highlightTitle || highlightCards) && (
        <section className="py-12 bg-background">
          <div className="container">
            {highlightTitle && (
              <h2
                className="text-[#191919] font-medium text-2xl md:text-3xl text-center mb-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {highlightTitle}
              </h2>
            )}
            {highlightCards && <CmsBlockRenderer block={highlightCards as any} />}
          </div>
        </section>
      )}

      {/* Como Funciona */}
      {(howTitle || howDescHtml || howSteps) && (
        <section className="py-12 bg-[#f7f6f4]">
          <div className="container">
            {howTitle && (
              <h2
                className="text-[#191919] font-medium text-2xl md:text-3xl text-center mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {howTitle}
              </h2>
            )}
            {howDescHtml && (
              <div
                className="max-w-3xl mx-auto text-center text-[#191919] mb-10"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: howDescHtml }}
              />
            )}
            {howSteps && <CmsBlockRenderer block={howSteps as any} />}
          </div>
        </section>
      )}

      {/* Sobre */}
      {(aboutTitle || aboutDescHtml || aboutImage) && (
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                {aboutTitle && (
                  <h2
                    className="text-[#191919] font-medium text-2xl md:text-3xl mb-4"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {aboutTitle}
                  </h2>
                )}
                {aboutDescHtml && (
                  <div
                    className="text-[#191919] leading-relaxed"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: aboutDescHtml }}
                  />
                )}
              </div>
              <div>{aboutImage && <CmsBlockRenderer block={aboutImage as any} />}</div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      {(finalTitle || finalDescHtml || finalButton) && (
        <section className="py-14 bg-[#191919] text-white">
          <div className="container text-center max-w-3xl">
            {finalTitle && (
              <h2
                className="font-medium text-2xl md:text-3xl mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {finalTitle}
              </h2>
            )}
            {finalDescHtml && (
              <div
                className="text-white/90 mb-8"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: finalDescHtml }}
              />
            )}
            {finalButton && <CmsBlockRenderer block={finalButton as any} />}
          </div>
        </section>
      )}
    </>
  );
}

