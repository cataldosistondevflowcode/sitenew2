import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/utils/stringUtils';

interface Property {
  id: number;
  titulo_propriedade: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_leilao_1: string;
  leilao_1: number;
  imagem: string;
  tipo_propriedade?: string;
}

interface RelatedPropertiesCarouselProps {
  currentRegion: string;
  estado: string;
  filterType: 'bairro' | 'zona' | 'cidade';
  filterValue: string;
  excludeIds?: number[];
}

export function RelatedPropertiesCarousel({
  currentRegion,
  estado,
  filterType,
  filterValue,
  excludeIds = []
}: RelatedPropertiesCarouselProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 
                       typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 4;

  useEffect(() => {
    fetchRelatedProperties();
  }, [estado, filterType, filterValue]);

  const fetchRelatedProperties = async () => {
    try {
      setLoading(true);
      
      // Buscar imóveis relacionados (mesma cidade ou estado, mas diferente do filtro atual)
      let query = supabase
        .from('imoveis')
        .select('id, titulo_propriedade, endereco, bairro, cidade, estado, data_leilao_1, leilao_1, imagem, tipo_propriedade')
        .eq('estado', estado)
        .gte('leilao_1', 75000)
        .order('data_leilao_1', { ascending: true, nullsFirst: false })
        .limit(12);
      
      // Excluir os imóveis já exibidos na listagem principal
      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }
      
      // Se o filtro é bairro, buscar de outros bairros da mesma cidade
      if (filterType === 'bairro') {
        query = query.neq('bairro', filterValue);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar imóveis relacionados:', error);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis relacionados:', error);
    } finally {
      setLoading(false);
    }
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

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= properties.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 ? Math.max(0, properties.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  if (loading) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg h-72"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  const visibleProperties = properties.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="bg-[#ebe5de] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] font-medium text-[#191919]">
              Outros Imóveis de Interesse
            </h2>
            <p className="font-body text-[#333333] mt-2">
              Confira mais oportunidades em {estado === 'RJ' ? 'Rio de Janeiro' : 'São Paulo'}
            </p>
          </div>
          
          {properties.length > itemsPerPage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full border-[#265c54] text-[#265c54] hover:bg-[#265c54] hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full border-[#265c54] text-[#265c54] hover:bg-[#265c54] hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProperties.map((property) => (
            <a
              key={property.id}
              href={createPropertyUrl(property)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group border border-gray-100"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {property.imagem && !property.imagem.includes('not-found') ? (
                  <img
                    src={property.imagem}
                    alt={property.titulo_propriedade || 'Imóvel'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#f5f5f5] flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {property.tipo_propriedade && (
                  <Badge className="absolute top-2 left-2 bg-[#d68e08] text-white text-xs font-body">
                    {property.tipo_propriedade}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-base font-medium text-[#191919] mb-2 line-clamp-2 group-hover:text-[#d68e08] transition-colors">
                  {property.titulo_propriedade || 'Imóvel em Leilão'}
                </h3>
                
                <p className="font-body text-[#333333] text-sm mb-3 flex items-center gap-1">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-[#d68e08]" />
                  <span className="truncate">{property.bairro}, {property.cidade}</span>
                </p>

                <div className="flex items-center justify-between">
                  <div className="font-body text-lg font-bold text-[#265c54]">
                    {property.leilao_1 ? formatCurrency(property.leilao_1) : 'Consulte'}
                  </div>
                  {property.data_leilao_1 && (
                    <div className="font-body text-xs text-[#333333] flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#d68e08]" />
                      {new Date(property.data_leilao_1).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination dots */}
        {properties.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(properties.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsPerPage)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerPage) === i 
                    ? 'bg-[#d68e08]' 
                    : 'bg-[#265c54]/30 hover:bg-[#265c54]/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
