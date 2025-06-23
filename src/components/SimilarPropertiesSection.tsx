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
      const newIndex = prev - 3;
      return newIndex < 0 ? Math.max(0, properties.length - 3) : newIndex;
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 3;
      return newIndex >= properties.length ? 0 : newIndex;
    });
  };

  const visibleProperties = properties.slice(currentIndex, currentIndex + 3);

  if (loading) {
    return (
      <section className="flex relative gap-4 justify-center items-start pt-10 pr-5 pb-0 pl-4 min-h-[430px]">
        <div className="flex absolute inset-0 z-0 self-start bg-gray-200 w-full h-full" />
        <div className="flex z-0 flex-col flex-1 shrink items-center my-auto basis-0 min-w-60 max-md:max-w-full">
          <div className="px-4 max-w-full w-[960px]">
            <div className="w-full max-md:max-w-full">
              <header className="flex flex-col items-center w-full text-4xl font-medium leading-tight text-center text-black max-md:max-w-full">
                <div className="flex flex-col py-4 pr-px pl-2.5 max-w-full w-[802px]">
                  <h2 className="max-md:max-w-full">
                    Imóveis Similares
                  </h2>
                  <div className="self-center mt-2 max-md:max-w-full text-lg">
                    Carregando imóveis similares...
                  </div>
                </div>
              </header>
            </div>
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
    <section className="flex relative gap-4 justify-center items-start pt-10 pr-5 pb-0 pl-4 min-h-[430px]">
      <div className="flex absolute inset-0 z-0 self-start bg-gray-200 w-full h-full" />
      <div className="flex z-0 flex-col flex-1 shrink items-center my-auto basis-0 min-w-60 max-md:max-w-full">
        <div className="px-4 max-w-full w-[960px]">
          <div className="w-full max-md:max-w-full">
            <header className="flex flex-col items-center w-full text-4xl font-medium leading-tight text-center text-black max-md:max-w-full">
              <div className="flex flex-col py-4 pr-px pl-2.5 max-w-full w-[802px]">
                <h2 className="max-md:max-w-full">
                  Imóveis Similares
                </h2>
                <div className="self-center mt-2 max-md:max-w-full text-lg">
                  Confira outros imóveis que podem interessar você
                </div>
              </div>
            </header>
            <div className="flex relative flex-col items-start px-16 mt-2 w-full max-md:px-5 max-md:max-w-full">
              <div className="overflow-hidden z-0 self-stretch pb-16 w-full max-md:max-w-full">
                {properties.length > 0 ? (
                  <div className="flex gap-6 min-h-[527px] justify-center">
                    {visibleProperties.map((property) => (
                      <div key={property.id} className="flex-1 max-w-[320px]">
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
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-h-[200px] text-gray-600">
                    <p className="text-lg">Carregando imóveis similares...</p>
                  </div>
                )}
              </div>
              
              {/* Botões de navegação */}
              {properties.length > 3 && (
                <>
                  <button 
                    onClick={handlePreviousClick}
                    className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                    aria-label="Imóveis anteriores"
                    style={{ left: '-50px' }}
                  >
                    <ChevronLeft className="w-6 h-6 text-[#d68e08]" />
                  </button>
                  <button 
                    onClick={handleNextClick}
                    className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                    aria-label="Próximos imóveis"
                    style={{ right: '-50px' }}
                  >
                    <ChevronRight className="w-6 h-6 text-[#d68e08]" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimilarPropertiesSection;