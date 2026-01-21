import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/stringUtils';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { useFilterParams } from '@/hooks/useFilterParams';

// Componentes iguais à página /leilao-rj
import { SocialBar } from '@/components/SocialBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { TestimonialsSection } from '@/components/testimonials';
import { NewsletterBottomSection } from '@/components/NewsletterBottomSection';

// Sprint 6 - Regional page components (apenas os que não existem na página principal)
import {
  RegionContentSection,
  SupportCTA,
} from '@/components/regional';

interface Property {
  id: number;
  titulo_propriedade: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_leilao_1: string;
  data_leilao_2?: string;
  leilao_1: number;
  leilao_2?: number;
  imagem: string;
  descricao?: string;
  tipo_leilao?: string;
  tipo_propriedade?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
}

interface RegionContent {
  neighborhoods?: string[];
  attractions?: string[];
  infrastructure?: string[];
  highlights?: string[];
}

interface SEOPage {
  id: number;
  page_id: string;
  estado: string;
  regiao: string;
  keyword: string;
  url_slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  filter_type: 'bairro' | 'zona' | 'cidade';
  filter_value: string;
  is_active: boolean;
  view_count: number;
  last_viewed_at: string | null;
  created_at: string;
  updated_at: string;
  intro_text?: string | null;
  region_description?: string | null;
  region_content?: RegionContent | null;
  h1_title?: string | null;
}

// Imagens de fundo por região/estado
const getBackgroundImage = (estado: string): string => {
  const images: Record<string, string> = {
    'RJ': '/visao-panoramica-rio-janeiro.jpg',
    'SP': 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=1920&q=80',
  };
  return images[estado] || images['RJ'];
};

export default function StaticCatalog() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { updateURL } = useFilterParams();
  const [seoPage, setSeoPage] = useState<SEOPage | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      fetchSEOPage(pageId);
    }
  }, [pageId]);

  useEffect(() => {
    if (seoPage && seoPage.filter_type && seoPage.filter_value) {
      applyFiltersAutomatically();
    }
  }, [seoPage]);

  const fetchSEOPage = async (pageId: string) => {
    try {
      setLoading(true);
      
      const { data: page, error: pageError } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .single();

      if (pageError) {
        if (pageError.code === 'PGRST116') {
          setError('Página não encontrada');
        } else {
          setError('Erro ao carregar página');
        }
        return;
      }

      if (!page) {
        setError('Página não encontrada');
        return;
      }

      await supabase
        .from('seo_pages')
        .update({ 
          view_count: (page.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', page.id);

      setSeoPage(page);
      await fetchPropertiesByFilter(page);

    } catch (error) {
      console.error('Erro ao buscar página SEO:', error);
      setError('Erro ao carregar página');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertiesByFilter = async (page: SEOPage) => {
    try {
      let query = supabase
        .from('imoveis')
        .select('*', { count: 'exact' })
        .eq('estado', page.estado)
        .gte('leilao_1', 75000);

      if (page.filter_type === 'bairro') {
        query = query.eq('bairro', page.filter_value);
      } else if (page.filter_type === 'zona') {
        query = query.ilike('bairro', `%${page.filter_value}%`);
      } else if (page.filter_type === 'cidade') {
        query = query.eq('cidade', page.filter_value);
      }

      const { data, error: queryError } = await query
        .order('data_leilao_1', { ascending: true, nullsFirst: false })
        .limit(100);

      if (queryError) {
        console.error('Erro ao buscar imóveis:', queryError);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const applyFiltersAutomatically = () => {
    if (!seoPage) return;

    const filters: any = {};

    if (seoPage.filter_type === 'bairro') {
      filters.neighborhood = seoPage.filter_value;
    } else if (seoPage.filter_type === 'zona') {
      filters.zone = seoPage.filter_value;
    } else if (seoPage.filter_type === 'cidade') {
      filters.city = seoPage.filter_value;
    }

    updateURL(filters);
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = '5521977294848';
    const message = encodeURIComponent(
      seoPage 
        ? `Olá! Tenho interesse em imóveis em leilão em ${seoPage.regiao}/${seoPage.estado}. Gostaria de mais informações.`
        : 'Olá! Gostaria de mais informações sobre imóveis em leilão.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleOpportunityClick = () => {
    handleWhatsAppClick();
  };

  const getCanonicalUrl = () => {
    if (!seoPage) return '';
    return `https://imoveis.leilaodeimoveis-cataldosiston.com/catalogo/${seoPage.page_id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d68e08] mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error || !seoPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 font-body mb-6">{error || 'Esta página não existe ou foi removida.'}</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2 bg-[#d68e08] hover:bg-[#b87a07]">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const stateName = seoPage.estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo';
  const title = seoPage.h1_title || `Imóveis em Leilão em ${seoPage.regiao}`;
  const introText = seoPage.intro_text || `Receba oportunidades de leilões personalizadas, de acordo com o seu perfil.`;
  const backgroundImage = getBackgroundImage(seoPage.estado);

  return (
    <>
      <SEO 
        title={seoPage.meta_title}
        description={seoPage.meta_description}
        keywords={seoPage.meta_keywords || ''}
        canonicalUrl={getCanonicalUrl()}
      />
      
      {/* ============================================
          BARRA SUPERIOR DE CONTATO (igual /leilao-rj)
          ============================================ */}
      <SocialBar onWhatsAppClick={handleWhatsAppClick} />
      
      {/* ============================================
          HEADER COM LOGO E MENU (igual /leilao-rj)
          ============================================ */}
      <Header />
      
      <main className="min-h-screen">
        {/* ============================================
            HERO SECTION (igual /leilao-rj)
            ============================================ */}
        <section className="relative">
          <div 
            className="bg-cover bg-center bg-no-repeat h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] relative"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          >
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/15"></div>
            
            {/* Conteúdo */}
            <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-4">
              <div className="max-w-[960px] w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                <div className="flex-1 max-w-[512px] text-center lg:text-left lg:ml-[100px]">
                  <div className="mb-4 sm:mb-6">
                    <h1 
                      className="text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-tight lg:leading-[52.8px] mb-4" 
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {title}
                    </h1>
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    <p 
                      className="text-white font-bold text-base sm:text-lg md:text-xl leading-relaxed" 
                      style={{ fontFamily: "Quicksand, sans-serif" }}
                    >
                      {introText}
                    </p>
                  </div>
                  
                  <div className="flex justify-center lg:justify-start">
                    <button
                      onClick={handleOpportunityClick}
                      className="inline-flex items-center justify-center bg-gradient-to-r from-[#6d4403] via-[#b57309] to-[#d48d07] text-white rounded-full px-4 sm:px-6 md:px-7 py-3 sm:py-4 font-normal text-sm sm:text-base md:text-[19.8px] leading-relaxed hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ fontFamily: "Quicksand, sans-serif" }}
                    >
                      <span className="text-center">Quero receber novas oportunidades</span>
                      <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-7 flex-shrink-0" />
                    </button>
                  </div>
                </div>
                
                <div className="w-[383px] hidden xl:block"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SEÇÃO DE VÍDEO + TÍTULOS (igual /leilao-rj)
            ============================================ */}
        <section className="relative -mt-16 sm:-mt-20 pt-16 sm:pt-20">
          <div 
            className="bg-cover bg-center bg-no-repeat min-h-[400px] sm:min-h-[450px] md:min-h-[506px] relative"
            style={{ backgroundImage: "url('/fundo-marmore-1-webp.png')" }}
          >
            <div className="container mx-auto relative z-10 py-8 sm:py-10 md:py-12 px-4">
              <div className="max-w-[1170px] mx-auto">
                {/* Player de vídeo */}
                <div className="mb-6 sm:mb-8 flex justify-center">
                  <div className="relative w-full max-w-[560px] aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/G8Wp2ju3CaU"
                      title="Como funciona nossa assessoria em leilões de imóveis"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                    
                    <div className="absolute bottom-0 left-0 bg-black/80 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-tr-md">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm">Assistir no</span>
                        <svg className="w-12 sm:w-16 h-3 sm:h-4" viewBox="0 0 72 16" fill="white">
                          <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35042 27.9727 3.12324Z" />
                          <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="black"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Títulos das oportunidades */}
                <div className="max-w-[960px] mx-auto">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden md:flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        
                        <h2 
                          className="text-[#191919] font-medium text-lg sm:text-xl md:text-2xl text-center px-4"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          OPORTUNIDADES DE IMÓVEIS EM LEILÃO
                        </h2>
                        
                        <div className="hidden md:flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 
                      className="text-[#191919] font-medium text-xl sm:text-2xl md:text-3xl lg:text-[40px] text-center mb-8 sm:mb-10 md:mb-12 px-4"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Imóveis até 50% abaixo da sua avaliação
                    </h3>
                    
                    <div className="px-4 sm:px-6">
                      <p 
                        className="text-[#191919] font-normal text-sm sm:text-base md:text-[17.6px] leading-relaxed text-center max-w-4xl mx-auto"
                        style={{ fontFamily: "Quicksand, sans-serif" }}
                      >
                        Os imóveis em leilão abaixo não foram objeto de análise jurídica prévia. 
                        Entenda como funciona o nosso{" "}
                        <span className="font-bold">estudo de viabilidade jurídica</span>{" "}
                        clicando{" "}
                        <a href="https://leilaodeimoveis-cataldosiston.com/leilao-de-imoveis-importancia-analise-juridica/" className="text-[#d48d07] font-bold hover:underline" target="_blank" rel="noopener noreferrer">
                          aqui
                        </a>{" "}
                        ou entre em contato conosco
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            2. CORPO DA PÁGINA - Descrição da Região
            (Ponto 2 do briefing)
            ============================================ */}
        {seoPage.region_description && (
          <section className="bg-white py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 
                  className="text-[#191919] font-medium text-xl sm:text-2xl md:text-3xl text-center mb-6"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Sobre {seoPage.regiao}
                </h2>
                <p 
                  className="text-[#333333] text-base md:text-lg leading-relaxed text-center"
                  style={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  {seoPage.region_description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ============================================
            LISTA DE IMÓVEIS (igual /leilao-rj)
            ============================================ */}
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Contador de imóveis */}
            <div className="mb-6">
              <p 
                className="text-[#d68e08] font-bold text-lg"
                style={{ fontFamily: "Quicksand, sans-serif" }}
              >
                {properties.length} oportunidades encontradas
              </p>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <h3 className="font-display text-xl font-medium text-[#191919] mb-2">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-[#333333] font-body mb-6 max-w-md mx-auto">
                  Não encontramos imóveis em leilão para {seoPage.regiao} no momento. 
                  Novos imóveis são adicionados frequentemente.
                </p>
                <Button 
                  onClick={() => navigate(`/leilao-${seoPage.estado.toLowerCase()}`)} 
                  className="bg-[#d68e08] hover:bg-[#b87a07]"
                >
                  Ver todos os imóveis em {seoPage.estado}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    image={property.imagem || ''}
                    title={property.titulo_propriedade || 'Imóvel em Leilão'}
                    location={`${property.bairro || ''}, ${property.cidade || ''}, ${property.estado || ''}`}
                    firstAuctionDate={property.data_leilao_1 || ''}
                    firstAuctionValue={property.leilao_1 ? formatCurrency(property.leilao_1) : 'Consulte'}
                    secondAuctionDate={property.data_leilao_2 || ''}
                    secondAuctionValue={property.leilao_2 ? formatCurrency(property.leilao_2) : 'Consulte'}
                    tipoLeilao={property.tipo_leilao}
                    fgts={property.fgts}
                    financiamento={property.financiamento}
                    parcelamento={property.parcelamento}
                    rawPropertyData={property}
                    onContactClick={handleWhatsAppClick}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============================================
            3. CTA DE APOIO
            "Não encontrou o que estava procurando?"
            ============================================ */}
        <SupportCTA estado={seoPage.estado} />

        {/* ============================================
            4. CONTEÚDO COMPLEMENTAR DA REGIÃO
            (Ponto 4 do briefing: Bairros, Atrações, Infraestrutura, Diferenciais)
            ============================================ */}
        {seoPage.region_content && (
          <RegionContentSection
            regionName={seoPage.regiao}
            content={typeof seoPage.region_content === 'string' 
              ? JSON.parse(seoPage.region_content) 
              : seoPage.region_content}
          />
        )}

        {/* ============================================
            6. PROVA SOCIAL - Depoimentos (igual /leilao-rj)
            ============================================ */}
        <TestimonialsSection />

        {/* ============================================
            7. CTA FINAL - Newsletter (igual /leilao-rj)
            ============================================ */}
        <NewsletterBottomSection />
      </main>
      
      <Footer />
    </>
  );
}
