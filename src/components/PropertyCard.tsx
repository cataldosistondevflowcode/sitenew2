import { MapPin, Calendar, DollarSign, SquareStack, Car, Share2, ImageOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { formatPropertyAddress } from "../utils/addressFormatter";
import { createPropertyUrl } from "../utils/slugUtils";
import { ShareModal } from "./ShareModal";
import { supabase } from "@/integrations/supabase/client";
import { loadMapbox, geocodeAddress, createMapboxMap, MapboxCoordinates } from "../integrations/mapbox/client";
import { mapboxGeocodeCache } from "../utils/mapboxCache";
import { mapboxMapCache } from "../utils/mapboxCache";
import { trackPropertyClick } from "@/utils/rdStation";

interface PropertyCardProps {
  id: number;
  image: string;
  title: string;
  location: string;
  firstAuctionDate: string;
  firstAuctionValue: string;
  secondAuctionDate?: string;
  secondAuctionValue?: string;
  area?: string;
  parkingSpots?: string;
  imageOverlayText?: string;
  tipoLeilao?: string;
  fgts?: boolean;
  financiamento?: boolean;
  parcelamento?: boolean;
  rawPropertyData?: any;
  onContactClick?: () => void;
}

export const PropertyCard = ({
  id,
  image,
  title,
  location,
  firstAuctionDate,
  firstAuctionValue,
  secondAuctionDate,
  secondAuctionValue,
  area,
  parkingSpots,
  imageOverlayText,
  tipoLeilao,
  fgts,
  financiamento,
  parcelamento,
  rawPropertyData,
  onContactClick,
}: PropertyCardProps) => {
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [isImageNotFound, setIsImageNotFound] = useState(
    image.includes('/not-found') ||
    !image ||
    image === '' ||
    image === 'https://kmiblhbe.manus.space/imovel_sao_goncalo.jpeg'
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Função para registrar clique no "Saiba Mais"
  const handleSaibaMaisClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      console.log('Registrando clique para propriedade ID:', id);

      // Rastrear evento RD Station
      trackPropertyClick(id, {
        property_title: title,
        property_location: location,
        click_type: 'saiba_mais',
        property_value: firstAuctionValue,
      });

      // Registrar o clique na nova tabela específica
      const { data, error } = await supabase.from('property_clicks').insert({
        property_id: id,
        click_type: 'saiba_mais',
        visitor_ip: '192.168.1.' + Math.floor(Math.random() * 255),
        user_agent: navigator.userAgent,
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      if (error) {
        console.error('Erro do Supabase ao registrar clique:', error);
      } else {
        console.log('Clique registrado com sucesso na tabela property_clicks:', data);
      }
    } catch (error) {
      console.warn('Erro ao registrar clique do Saiba Mais:', error);
    }
  };

  // Handle image load error
  const handleImageError = () => {
    console.log('Erro ao carregar imagem:', image);
    setImageLoadError(true);
    setIsImageNotFound(true);
  };

  const getFullAddress = () => {
    if (!rawPropertyData) return location;
    return formatPropertyAddress(
      rawPropertyData.endereco || '',
      rawPropertyData.bairro || '',
      rawPropertyData.cidade || '',
      rawPropertyData.estado || ''
    );
  };

  // Initialize map when image is not found or failed to load
  const initializeMap = async () => {
    if (!mapRef.current || (!isImageNotFound && !imageLoadError) || mapLoaded || mapLoading) return;

    setMapLoading(true);

    try {
      const address = getFullAddress();
      if (!address) {
        setMapLoading(false);
        return;
      }

      // Verificar cache de mapas primeiro
      const cachedMap = mapboxMapCache.get(address);
      if (cachedMap && mapRef.current) {
        // Reusar mapa do cache - clonar o container do mapa
        const mapContainer = cachedMap.map.getContainer();
        const clonedContainer = mapContainer.cloneNode(true) as HTMLElement;
        mapRef.current.appendChild(clonedContainer);
        setMapLoaded(true);
        setMapLoading(false);
        return;
      }

      await loadMapbox();

      // Verificar cache de coordenadas
      const cachedCoordinates = mapboxGeocodeCache.get(address);

      if (cachedCoordinates) {
        // Usar coordenadas do cache
        createMapWithCoordinates(cachedCoordinates, address);
      } else {
        // Fazer geocoding e salvar no cache
        const coordinates = await geocodeAddress(address);
        if (coordinates && mapRef.current) {
          mapboxGeocodeCache.set(address, coordinates);
          createMapWithCoordinates(coordinates, address);
        } else {
          setMapLoading(false);
          console.error('Geocoding failed for address:', address);
        }
      }
    } catch (error) {
      console.error('Error loading map:', error);
      setMapLoading(false);
    }
  };

  const createMapWithCoordinates = (coordinates: MapboxCoordinates, address: string) => {
    if (!mapRef.current) return;

    const mapInstance = createMapboxMap(mapRef.current, coordinates, {
      zoom: 15,
      interactive: false, // Desabilita interação
      title: title,
    });

    // Salvar no cache
    mapboxMapCache.set(address, mapInstance);
    setMapLoaded(true);
    setMapLoading(false);
  };

  // Carregar mapa quando necessário
  useEffect(() => {
    if ((isImageNotFound || imageLoadError) && mapRef.current && rawPropertyData) {
      const timer = setTimeout(() => {
        initializeMap();
      }, imageLoadError ? 500 : 100); // Delay extra se a imagem falhou
      return () => clearTimeout(timer);
    }
  }, [isImageNotFound, imageLoadError, rawPropertyData]);
  
  // Função para formatar data no padrão brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = dateString.match(brazilianDateRegex);
      
      if (match) {
        return dateString;
      }
      
      // Extrair apenas a parte da data (YYYY-MM-DD) antes do "T" para evitar problemas de timezone
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      
      // Criar data local sem conversão de timezone
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data no PropertyCard:', error, 'Data recebida:', dateString);
      return '';
    }
  };

  // Implementar a lógica de badges conforme as regras definidas
  const getBadges = () => {
    const badges = [];
    
    // Normalizar o tipo de leilão (tratar "Outros" como "Judicial")
    const normalizedTipoLeilao = tipoLeilao === "Outros" ? "Judicial" : tipoLeilao;
    
    // 1. Judicial: tipo_leilao = "Judicial" (incluindo "Outros")
    if (normalizedTipoLeilao === "Judicial") {
      badges.push({
        text: "JUDICIAL",
        color: "bg-red-700"
      });
    }
    
    // 2. Extrajudicial Financiável: tipo_leilao != "Judicial" && financiamento = true
    else if (normalizedTipoLeilao !== "Judicial" && financiamento === true) {
      badges.push({
        text: "EXTRAJUDICIAL FINANCIÁVEL",
        color: "bg-purple-600"
      });
    }
    
    // 3. Extrajudicial: tipo_leilao != "Judicial" (e não é financiável)
    else if (normalizedTipoLeilao !== "Judicial") {
      badges.push({
        text: "EXTRAJUDICIAL",
        color: "bg-orange-600"
      });
    }
    
    // Badge FGTS removido - não é mais necessário
    
    return badges;
  };

  const badges = getBadges();

  return (
                    <Link to={createPropertyUrl(
                  id, 
                  rawPropertyData?.endereco || location, 
                  rawPropertyData?.bairro, 
                  rawPropertyData?.cidade, 
                  rawPropertyData?.estado
                )} target="_blank" rel="noopener noreferrer" className="block cursor-pointer h-full property-card-container">
      <div className="bg-[#191919] rounded-lg shadow-lg overflow-hidden text-white hover:shadow-xl transition-shadow duration-300 property-card-layout">
        {/* Imagem com altura fixa ou Estados quando imagem não encontrada/inválida */}
        <div className="relative flex-shrink-0 property-card-header">
          {isImageNotFound || imageLoadError ? (
            <div className="relative w-full h-40 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Estado de loading */}
              {mapLoading && !mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Carregando localização...</span>
                </div>
              )}

              {/* Estado de erro/sem endereço */}
              {!mapLoading && !mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <ImageOff className="w-12 h-12 text-gray-300 mb-3" />
                  <span className="text-sm text-gray-400 font-medium mb-1">
                    {imageLoadError ? 'Falha ao carregar imagem' : 'Imagem não disponível'}
                  </span>
                  <span className="text-xs text-gray-400 text-center px-4">
                    {getFullAddress()
                      ? (imageLoadError ? 'Carregando localização alternativa...' : 'Carregando mapa...')
                      : 'Endereço não informado'
                    }
                  </span>
                </div>
              )}

              {/* Container do mapa Mapbox */}
              <div
                ref={mapRef}
                className={`w-full h-full transition-opacity duration-300 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          ) : (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-40 sm:h-44 md:h-48 object-cover" 
              onError={handleImageError}
            />
          )}
          
          {/* Botões de ação - centralizados verticalmente */}
          <a
            href={createPropertyUrl(
                id, 
                rawPropertyData?.endereco || location, 
                rawPropertyData?.bairro, 
                rawPropertyData?.cidade, 
                rawPropertyData?.estado
              )}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-3 bg-[#d68e08] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-bold z-10 hover:bg-[#b8780a] transition-colors shadow-lg"
            onClick={async (e) => {
              e.preventDefault();
              await handleSaibaMaisClick(e);
              // Pequeno delay para garantir que o registro seja salvo
              setTimeout(() => {
                window.open(createPropertyUrl(
                  id, 
                  rawPropertyData?.endereco || location, 
                  rawPropertyData?.bairro, 
                  rawPropertyData?.cidade, 
                  rawPropertyData?.estado
                ), '_blank');
              }, 100);
            }}
          >
            Saiba Mais
          </a>
          <button 
            className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 bg-[#25d366] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-bold z-10 hover:bg-[#20b858] transition-colors shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onContactClick) {
                onContactClick();
              }
            }}
          >
            Contato
          </button>
          {imageOverlayText && (
            <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4 text-white text-lg sm:text-xl font-bold">
              {imageOverlayText}
            </div>
          )}
        </div>
        
        {/* Conteúdo principal com flex-grow para ocupar espaço disponível */}
        <div className="p-3 sm:p-4 property-card-body">
          <div className="property-card-content">
            {/* Header do card - título e localização */}
            <div className="mb-3">
              <h2 className="text-base sm:text-lg font-bold mb-2 property-card-title leading-tight">
                {title}
              </h2>
              <div className="flex items-start text-xs sm:text-sm mb-2 property-card-location">
                <MapPin className="mr-1.5 flex-shrink-0 text-[#d68e08] mt-0.5" size={14} />
                <span className="leading-tight">{location}</span>
              </div>
            </div>
            
            {/* Badges com altura mínima */}
            <div className="property-card-badges mb-3 sm:mb-4">
              {badges.map((badge, index) => (
                <span 
                  key={index}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold rounded-md ${badge.color} text-white flex-shrink-0`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
            
            {/* Seção de leilões */}
            <div className="mt-auto">
              {/* Primeiro leilão */}
              <div className="grid grid-cols-2 py-2 sm:py-3 border-t border-[#444]">
                <div className="px-1 sm:px-2">
                  <strong className="block text-xs sm:text-sm mb-1">Primeiro leilão</strong>
                  <div className="flex items-center text-xs">
                    <Calendar className="mr-1 text-[#d68e08] flex-shrink-0" size={12} />
                    <span className="truncate text-xs">{formatDateToBrazilian(firstAuctionDate)}</span>
                  </div>
                </div>
                <div className="px-1 sm:px-2">
                  <strong className="block text-xs sm:text-sm mb-1">Valor Mínimo</strong>
                  <div className="flex items-center text-xs">
                    <DollarSign className="mr-1 text-[#d68e08] flex-shrink-0" size={12} />
                    <span className="truncate text-xs">{firstAuctionValue}</span>
                  </div>
                </div>
              </div>
              
              {/* Segundo leilão destacado */}
              <div className="grid grid-cols-2 py-2 sm:py-3 bg-[#d68e08] -mx-3 sm:-mx-4 px-3 sm:px-4">
                <div className="px-1 sm:px-2">
                  <strong className="block text-xs sm:text-sm mb-1 text-white">Segundo leilão</strong>
                  <div className="flex items-center text-xs text-white">
                    <Calendar className="mr-1 flex-shrink-0" size={12} />
                    <span className="truncate text-xs">{formatDateToBrazilian(secondAuctionDate || '')}</span>
                  </div>
                </div>
                <div className="px-1 sm:px-2">
                  <strong className="block text-xs sm:text-sm mb-1 text-white">Valor Mínimo</strong>
                  <div className="flex items-center text-xs text-white">
                    <DollarSign className="mr-1 flex-shrink-0" size={12} />
                    <span className="truncate text-xs">{secondAuctionValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer fixo */}
        <div className="p-2 sm:p-3 text-right border-t border-[#444] property-card-footer">
          <button 
            className="text-base sm:text-lg ml-2 sm:ml-3 text-[#d68e08] hover:text-[#b8780a] transition-colors p-1"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsShareModalOpen(true);
            }}
            title="Compartilhar"
          >
            <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        propertyUrl={createPropertyUrl(
          id, 
          rawPropertyData?.endereco || location, 
          rawPropertyData?.bairro, 
          rawPropertyData?.cidade, 
          rawPropertyData?.estado
        )}
        propertyTitle={title}
      />
    </Link>
  );
};
