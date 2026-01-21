import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/stringUtils';
import { ExternalLink, MapPin, Calendar, ArrowLeft, Eye, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadMapbox, geocodeAddress, createMapboxMap } from '@/integrations/mapbox/client';
import { formatPropertyAddress } from '@/utils/addressFormatter';
import { SEO } from '@/components/SEO';
import { useFilterParams } from '@/hooks/useFilterParams';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Sprint 6 - Regional page components
import {
  RegionIntroSection,
  RegionDescriptionSection,
  RegionContentSection,
  RelatedPropertiesCarousel,
  SupportCTA,
  AboutCompanySection,
  SuccessCasesSection,
  BlogPostsCarousel,
  FinalCTA
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
  // Sprint 6 - New fields
  intro_text?: string | null;
  region_description?: string | null;
  region_content?: RegionContent | null;
  h1_title?: string | null;
}

// Componente para o mapa de uma propriedade
const PropertyMap = ({ property }: { property: Property }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    initializeMap();
  }, []);

  const getFullAddress = () => {
    return formatPropertyAddress(
      property.endereco || '',
      property.bairro || '',
      property.cidade || '',
      property.estado || ''
    );
  };

  const initializeMap = async () => {
    if (!mapRef.current || mapLoaded) return;
    
    try {
      await loadMapbox();
      const address = getFullAddress();

      const coordinates = await geocodeAddress(address);
      
      if (coordinates && mapRef.current) {
        const mapInstance = createMapboxMap(mapRef.current, coordinates, {
          zoom: 15,
          interactive: true,
          title: property.titulo_propriedade,
        });

        setMapLoaded(true);
      }
    } catch (error) {
      console.error('Error loading Mapbox:', error);
    }
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-200 min-h-[200px]"
    />
  );
};

// Componente para image/map com estado próprio
const PropertyImageOrMap = ({ property }: { property: Property }) => {
  const isImageNotFound = !property.imagem || 
                          property.imagem === '' || 
                          property.imagem.includes('/not-found') ||
                          property.imagem.includes('imovel_sao_goncalo.jpeg') ||
                          property.imagem.includes('placeholder');
  
  const [imageError, setImageError] = useState(isImageNotFound);
  
  if (imageError || isImageNotFound) {
    return <PropertyMap property={property} />;
  }
  
  return (
    <img
      src={property.imagem}
      alt={property.titulo_propriedade || 'Imóvel'}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
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

  // Aplicar filtros automaticamente quando a página carregar
  useEffect(() => {
    if (seoPage && seoPage.filter_type && seoPage.filter_value) {
      applyFiltersAutomatically();
    }
  }, [seoPage]);

  const fetchSEOPage = async (pageId: string) => {
    try {
      setLoading(true);
      
      // Buscar página SEO
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

      // Incrementar contador de visualizações
      await supabase
        .from('seo_pages')
        .update({ 
          view_count: (page.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', page.id);

      setSeoPage(page);

      // Buscar imóveis baseado no filtro
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
        .gte('leilao_1', 75000); // Valor mínimo padrão

      // Aplicar filtro baseado no tipo
      if (page.filter_type === 'bairro') {
        query = query.eq('bairro', page.filter_value);
      } else if (page.filter_type === 'zona') {
        // Para zonas, buscar via tabela zonasrio ou zonas relacionadas
        // Por enquanto, buscar por bairros conhecidos da zona
        // TODO: Melhorar lógica de zonas no Sprint 3
        query = query.ilike('bairro', `%${page.filter_value}%`);
      } else if (page.filter_type === 'cidade') {
        query = query.eq('cidade', page.filter_value);
      }

      const { data, error: queryError, count } = await query
        .order('data_leilao_1', { ascending: true, nullsFirst: false })
        .limit(100); // Limitar a 100 imóveis por página

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

    // Aplicar filtros na URL para que a página de listagem mostre os resultados
    const filters: any = {};

    if (seoPage.filter_type === 'bairro') {
      filters.neighborhood = seoPage.filter_value;
    } else if (seoPage.filter_type === 'zona') {
      filters.zone = seoPage.filter_value;
    } else if (seoPage.filter_type === 'cidade') {
      filters.city = seoPage.filter_value;
    }

    // Atualizar URL com filtros (sem navegar, apenas atualizar query params)
    // Isso permite que o usuário veja os filtros aplicados
    updateURL(filters);
  };

  const shareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  const createPropertyUrl = (property: Property) => {
    const slug = property.titulo_propriedade
      ?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'imovel';
    
    return `/imovel/${property.id}/${slug}`;
  };

  const getCanonicalUrl = () => {
    if (!seoPage) return '';
    return `https://imoveis.leilaodeimoveis-cataldosiston.com/catalogo/${seoPage.page_id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error || !seoPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-6">{error || 'Esta página não existe ou foi removida.'}</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  // Parse region_content if it's a string
  const regionContent: RegionContent | null = seoPage.region_content 
    ? (typeof seoPage.region_content === 'string' 
        ? JSON.parse(seoPage.region_content) 
        : seoPage.region_content)
    : null;

  return (
    <>
      <SEO 
        title={seoPage.meta_title}
        description={seoPage.meta_description}
        keywords={seoPage.meta_keywords || ''}
        canonicalUrl={getCanonicalUrl()}
      />
      
      <Header />
      
      <main className="min-h-screen">
        {/* Sprint 6: Region Intro Section (H1 + Intro Text) */}
        <RegionIntroSection
          regionName={seoPage.regiao}
          introText={seoPage.intro_text}
          h1Title={seoPage.h1_title}
          estado={seoPage.estado}
          filterType={seoPage.filter_type}
          filterValue={seoPage.filter_value}
        />

        {/* Sprint 6: Region Description */}
        <RegionDescriptionSection
          regionName={seoPage.regiao}
          description={seoPage.region_description}
        />

        {/* Properties Stats Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Badge variant={seoPage.estado === 'RJ' ? 'default' : 'secondary'} className="bg-primary text-white">
                  {seoPage.estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo'}
                </Badge>
                <Badge variant="outline">
                  {seoPage.filter_type === 'bairro' ? 'Bairro' : seoPage.filter_type === 'zona' ? 'Zona' : 'Cidade'}: {seoPage.filter_value}
                </Badge>
                <span className="text-sm font-medium text-gray-700">
                  {properties.length} imóveis encontrados
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  {seoPage.view_count || 0} visualizações
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareUrl}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <section className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Imóveis Disponíveis em {seoPage.regiao}
            </h2>
            
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">Nenhum imóvel encontrado para {seoPage.regiao} no momento.</p>
                <p className="text-gray-400 text-sm mb-6">Novos imóveis são adicionados frequentemente. Volte em breve!</p>
                <Button 
                  onClick={() => navigate(`/leilao-${seoPage.estado.toLowerCase()}`)} 
                  className="bg-primary hover:bg-primary-dark"
                >
                  Ver todos os imóveis em {seoPage.estado}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => {
                  const address = [property.endereco, property.bairro, property.cidade, property.estado]
                    .filter(Boolean)
                    .join(', ');
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                  const propertyUrl = createPropertyUrl(property);

                  return (
                    <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
                      {/* Image or Map */}
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <PropertyImageOrMap property={property} />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {property.titulo_propriedade || 'Título não informado'}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{address}</span>
                        </p>

                        {/* Price */}
                        <div className="mb-3">
                          <div className="text-xl font-bold text-primary">
                            {property.leilao_1 ? formatCurrency(property.leilao_1) : 'Valor não informado'}
                          </div>
                          {property.data_leilao_1 && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(property.data_leilao_1).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        {(property.fgts || property.financiamento || property.parcelamento) && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {property.fgts && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">FGTS</Badge>
                            )}
                            {property.financiamento && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Financiamento</Badge>
                            )}
                            {property.parcelamento && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Parcelamento</Badge>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary-dark"
                          >
                            <a href={propertyUrl}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                              <MapPin className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Sprint 6: Support CTA */}
        <SupportCTA estado={seoPage.estado} />

        {/* Sprint 6: Region Content (Neighborhoods, Attractions, Infrastructure, Highlights) */}
        <RegionContentSection
          regionName={seoPage.regiao}
          content={regionContent}
        />

        {/* Sprint 6: Related Properties Carousel */}
        <RelatedPropertiesCarousel
          currentRegion={seoPage.regiao}
          estado={seoPage.estado}
          filterType={seoPage.filter_type}
          filterValue={seoPage.filter_value}
          excludeIds={properties.map(p => p.id)}
        />

        {/* Sprint 6: Success Cases */}
        <SuccessCasesSection region={seoPage.regiao} />

        {/* Sprint 6: Blog Posts Carousel */}
        <BlogPostsCarousel />

        {/* Sprint 6: About Company Section */}
        <AboutCompanySection />

        {/* Sprint 6: Final CTA */}
        <FinalCTA regionName={seoPage.regiao} />
      </main>
      
      <Footer />
    </>
  );
}
