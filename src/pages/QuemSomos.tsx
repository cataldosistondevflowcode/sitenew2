import React from 'react';
import { SEO } from '@/components/SEO';
import { CookieBar } from '@/components/CookieBar';
import { SocialBar } from '@/components/SocialBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { useCmsPublishedBlocks } from '@/hooks/useCmsPublishedBlocks';

export default function QuemSomos() {
  const { blocksByKey, loading, error } = useCmsPublishedBlocks('quem-somos');

  const heroTitle = blocksByKey.quem_somos_hero_title?.content_published?.value as string | undefined;
  const heroSubtitle = blocksByKey.quem_somos_hero_subtitle?.content_published?.value as string | undefined;
  const heroImage = blocksByKey.quem_somos_hero_image;

  const contentTitle = blocksByKey.quem_somos_content_title?.content_published?.value as string | undefined;
  const para1 = blocksByKey.quem_somos_para1;
  const para2 = blocksByKey.quem_somos_para2;
  const para3 = blocksByKey.quem_somos_para3;

  const valuesTitle = blocksByKey.values_title?.content_published?.value as string | undefined;
  const valuesCards = blocksByKey.values_cards;

  const finalTitle = blocksByKey.quem_somos_final_cta_title?.content_published?.value as string | undefined;
  const finalText = blocksByKey.quem_somos_final_cta_text?.content_published?.value as string | undefined;
  const finalButton = blocksByKey.quem_somos_final_cta_button;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Quem Somos | Cataldo Siston"
        description="Conheca a Cataldo Siston e nossa experiencia em leiloes de imoveis e advocacia imobiliaria."
        canonicalUrl="https://imoveis.leilaodeimoveis-cataldosiston.com/quem-somos"
      />

      <CookieBar />
      <SocialBar />
      <Header />

      {/* Hero */}
      <section className="relative">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1
                className="text-[#191919] font-medium text-3xl md:text-5xl mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {heroTitle || 'Quem Somos'}
              </h1>
              {heroSubtitle ? (
                <div
                  className="text-[#191919] text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                />
              ) : (
                <p
                  className="text-[#191919] text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {loading
                    ? 'Carregando...'
                    : error
                      ? 'Conteudo indisponivel no momento.'
                      : 'Conheca nossa historia e nossos valores.'}
                </p>
              )}
            </div>
            <div>{heroImage ? <CmsBlockRenderer block={heroImage as any} /> : null}</div>
          </div>
        </div>
      </section>

      {/* Conteudo */}
      <section className="py-12 bg-[#f7f6f4]">
        <div className="container max-w-4xl">
          {contentTitle && (
            <h2
              className="text-[#191919] font-medium text-2xl md:text-3xl mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {contentTitle}
            </h2>
          )}

          <div className="prose prose-sm max-w-none">
            {para1 ? <CmsBlockRenderer block={para1 as any} /> : null}
            {para2 ? <CmsBlockRenderer block={para2 as any} /> : null}
            {para3 ? <CmsBlockRenderer block={para3 as any} /> : null}
          </div>
        </div>
      </section>

      {/* Valores */}
      {(valuesTitle || valuesCards) && (
        <section className="py-12 bg-background">
          <div className="container">
            {valuesTitle && (
              <h2
                className="text-[#191919] font-medium text-2xl md:text-3xl text-center mb-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {valuesTitle}
              </h2>
            )}
            {valuesCards ? <CmsBlockRenderer block={valuesCards as any} /> : null}
          </div>
        </section>
      )}

      {/* CTA Final */}
      {(finalTitle || finalText || finalButton) && (
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
            {finalText && (
              <div
                className="text-white/90 mb-8"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: finalText }}
              />
            )}
            {finalButton ? <CmsBlockRenderer block={finalButton as any} /> : null}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

