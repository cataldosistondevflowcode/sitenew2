"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: number;
  titulo_propriedade: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_leilao_1: string;
  data_leilao_2: string;
  leilao_1: number;
  leilao_2: number;
  area_displayable?: string;
  parkingSpots?: string;
  imagem: string;
  descricao?: string;
  tipo_leilao?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
  tipo_propriedade?: string;
  quartos?: number;
  banheiros?: number;
}

interface SimilarPropertiesSectionProps {
  currentPropertyId: number;
  propertyType?: string;
  city?: string;
  neighborhood?: string;
  auctionType?: string;
}

export function SimilarPropertiesSection({ 
  currentPropertyId, 
  propertyType, 
  city, 
  neighborhood, 
  auctionType 
}: SimilarPropertiesSectionProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  console.log('📍 SimilarPropertiesSection renderizado!');

  // Função para formatar datas no padrão brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getItemsPerPage = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentIndex(0);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      setLoading(true);
      console.log('🔍 Buscando imóveis similares para:', {
        currentPropertyId,
        propertyType,
        city,
        neighborhood,
        auctionType
      });
      
      try {
        let foundProperties: Property[] = [];

        // Estratégia 1: Buscar por cidade e tipo de leilão
        if (city && auctionType && foundProperties.length === 0) {
          console.log('🎯 Tentativa 1: Mesma cidade e tipo de leilão');
          const { data } = await supabase
            .from('leiloes_imoveis')
            .select('*')
            .neq('id', currentPropertyId)
            .eq('cidade', city)
            .eq('tipo_leilao', auctionType)
            .limit(9);
          foundProperties = data || [];
          console.log('📊 Encontrados na tentativa 1:', foundProperties.length);
        }

        // Estratégia 2: Buscar apenas por cidade
        if (city && foundProperties.length === 0) {
          console.log('🎯 Tentativa 2: Mesma cidade');
          const { data } = await supabase
            .from('leiloes_imoveis')
            .select('*')
            .neq('id', currentPropertyId)
            .eq('cidade', city)
            .limit(9);
          foundProperties = data || [];
          console.log('📊 Encontrados na tentativa 2:', foundProperties.length);
        }

        // Estratégia 3: Buscar por tipo de leilão
        if (auctionType && foundProperties.length === 0) {
          console.log('🎯 Tentativa 3: Mesmo tipo de leilão');
          const { data } = await supabase
            .from('leiloes_imoveis')
            .select('*')
            .neq('id', currentPropertyId)
            .eq('tipo_leilao', auctionType)
            .limit(9);
          foundProperties = data || [];
          console.log('📊 Encontrados na tentativa 3:', foundProperties.length);
        }

        // Estratégia 4: Buscar qualquer imóvel (fallback)
        if (foundProperties.length === 0) {
          console.log('🎯 Tentativa 4: Qualquer imóvel');
          const { data } = await supabase
            .from('leiloes_imoveis')
            .select('*')
            .neq('id', currentPropertyId)
            .limit(9);
          foundProperties = data || [];
          console.log('📊 Encontrados na tentativa 4:', foundProperties.length);
        }
        
        console.log('✅ Total de imóveis similares encontrados:', foundProperties.length);
        setProperties(foundProperties);
      } catch (err) {
        console.error('❌ Erro ao buscar imóveis similares:', err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentPropertyId, propertyType, city, neighborhood, auctionType]);

  const handlePreviousClick = () => {
    setCurrentIndex((prev) => {
      const itemsPerPage = getItemsPerPage();
      const newIndex = prev - itemsPerPage;
      return newIndex < 0 ? Math.max(0, properties.length - itemsPerPage) : newIndex;
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => {
      const itemsPerPage = getItemsPerPage();
      const newIndex = prev + itemsPerPage;
      return newIndex >= properties.length ? 0 : newIndex;
    });
  };

  const itemsPerPage = getItemsPerPage();
  const visibleProperties = properties.slice(currentIndex, currentIndex + itemsPerPage);

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black mb-2 sm:mb-4">
                Imóveis Similares
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Carregando imóveis similares...
              </p>
            </header>
          </div>
        </div>
      </section>
    );
  }

  // Agora sempre devemos ter imóveis, mas vamos manter um fallback por segurança
  if (properties.length === 0) {
    console.log('⚠️ Nenhum imóvel encontrado mesmo com fallback!');
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black mb-2 sm:mb-4">
              Imóveis Similares
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Confira outros imóveis que podem interessar você
            </p>
          </header>
          
          <div className="relative">
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {visibleProperties.map((property) => (
                  <div key={property.id} className="w-full">
                    <PropertyCard
                      id={property.id}
                      image={property.imagem}
                      title={property.titulo_propriedade}
                      location={`${property.bairro}, ${property.cidade}/${property.estado}`}
                      firstAuctionDate={formatDateToBrazilian(property.data_leilao_1)}
                      firstAuctionValue={formatCurrency(property.leilao_1)}
                      secondAuctionDate={formatDateToBrazilian(property.data_leilao_2)}
                      secondAuctionValue={formatCurrency(property.leilao_2)}
                      area={property.area_displayable}
                      parkingSpots={property.parkingSpots}
                      tipoLeilao={property.tipo_leilao}
                      fgts={property.fgts}
                      financiamento={property.financiamento}
                      parcelamento={property.parcelamento}
                      rawPropertyData={property}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center min-h-[200px] text-gray-600">
                <p className="text-lg">Carregando imóveis similares...</p>
              </div>
            )}
            
            {properties.length > itemsPerPage && (
              <>
                <button 
                  onClick={handlePreviousClick}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all border border-gray-200 min-h-[44px] min-w-[44px]"
                  aria-label="Imóveis anteriores"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#d68e08]" />
                </button>
                <button 
                  onClick={handleNextClick}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all border border-gray-200 min-h-[44px] min-w-[44px]"
                  aria-label="Próximos imóveis"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#d68e08]" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimilarPropertiesSection;
