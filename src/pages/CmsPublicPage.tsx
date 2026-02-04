import React from 'react';
import { SEO } from '@/components/SEO';
import { CookieBar } from '@/components/CookieBar';
import { SocialBar } from '@/components/SocialBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CmsBlockRenderer } from '@/components/CmsBlockRenderer';
import { useCmsPublishedBlocks } from '@/hooks/useCmsPublishedBlocks';

type CmsPublicPageProps = {
  slug: string;
  title: string;
  description: string;
  canonicalUrl: string;
};

export default function CmsPublicPage({ slug, title, description, canonicalUrl }: CmsPublicPageProps) {
  const { blocks, loading, error } = useCmsPublishedBlocks(slug);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={title} description={description} canonicalUrl={canonicalUrl} />

      <CookieBar />
      <SocialBar />
      <Header />

      <main className="container py-10 md:py-14">
        <header className="mb-10">
          <h1
            className="text-[#191919] font-medium text-3xl md:text-5xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </h1>
          <p
            className="text-[#191919] mt-4 max-w-3xl leading-relaxed"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            {description}
          </p>
        </header>

        {loading && (
          <div className="text-sm text-gray-600" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Carregando conteudo...
          </div>
        )}

        {!loading && (error || blocks.length === 0) && (
          <div
            className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-700"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Conteudo indisponivel no momento.
          </div>
        )}

        {!loading && !error && blocks.length > 0 && (
          <div className="space-y-6">
            {blocks.map((block) => (
              <CmsBlockRenderer key={block.id} block={block as any} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

