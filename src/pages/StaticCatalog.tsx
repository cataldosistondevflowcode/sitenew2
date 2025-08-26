import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/stringUtils';
import { ExternalLink, MapPin, Calendar, ArrowLeft, Eye, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadGoogleMaps } from '@/integrations/googlemaps/client';
import { formatPropertyAddress } from '@/utils/addressFormatter';

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

interface StaticPage {
  id: string;
  page_id: string;
  title: string;
  description?: string;
  page_type: string;
  property_ids: number[];
  properties_data: Property[];
  total_properties: number;
  created_at: string;
  view_count: number;
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
      const google = await loadGoogleMaps();
      const geocoder = new google.maps.Geocoder();
      const address = getFullAddress();

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0] && mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            zoom: 15,
            center: results[0].geometry.location,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true,
          });

          new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: property.titulo_propriedade,
          });

          setMapLoaded(true);
        }
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
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
  const [staticPage, setStaticPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      fetchStaticPage(pageId);
    }
  }, [pageId]);

  const fetchStaticPage = async (pageId: string) => {
    try {
      setLoading(true);
      
      // Buscar página estática
      const { data: page, error: pageError } = await supabase
        .from('static_pages')
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
        .from('static_pages')
        .update({ 
          view_count: (page.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', page.id);

      // Se não tem dados das propriedades, buscar
      let properties = page.properties_data as Property[] || [];
      
      if (!properties.length && page.property_ids.length > 0) {
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('leiloes_imoveis')
          .select('*')
          .in('id', page.property_ids);

        if (propertiesError) {
          console.error('Erro ao buscar propriedades:', propertiesError);
        } else {
          properties = propertiesData || [];
        }
      }

      setStaticPage({
        ...page,
        properties_data: properties
      });

    } catch (error) {
      console.error('Erro ao buscar página estática:', error);
      setError('Erro ao carregar página');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error || !staticPage) {
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

  const properties = staticPage.properties_data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{staticPage.title}</h1>
                {staticPage.description && (
                  <p className="text-gray-600 mt-1">{staticPage.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                {staticPage.view_count || 0} visualizações
              </div>
              <Button
                variant="outline"
                onClick={shareUrl}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Badge variant={staticPage.page_type === 'RJ' ? 'default' : 'secondary'}>
              {staticPage.page_type === 'RJ' ? 'Rio de Janeiro' : 'São Paulo'}
            </Badge>
            <span className="text-sm text-gray-500">
              {properties.length} imóveis • Criado em {new Date(staticPage.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum imóvel encontrado neste catálogo.</p>
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
                <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image or Map */}
                  <div className="aspect-video bg-gray-200 relative">
                    <PropertyImageOrMap property={property} />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {property.titulo_propriedade || 'Título não informado'}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 flex items-start gap-1">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {address}
                    </p>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="text-xl font-bold text-blue-600">
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
                          <Badge variant="secondary" className="text-xs">FGTS</Badge>
                        )}
                        {property.financiamento && (
                          <Badge variant="secondary" className="text-xs">Financiamento</Badge>
                        )}
                        {property.parcelamento && (
                          <Badge variant="secondary" className="text-xs">Parcelamento</Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1"
                      >
                        <a href={propertyUrl} target="_blank" rel="noopener noreferrer">
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
    </div>
  );
}
