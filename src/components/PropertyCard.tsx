import { MapPin, Calendar, DollarSign, SquareStack, Car, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../integrations/googlemaps/client";
import { formatPropertyAddress } from "../utils/addressFormatter";
import { createPropertyUrl } from "../utils/slugUtils";
import { ShareModal } from "./ShareModal";

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

  // Initialize map when image is not found
  useEffect(() => {
    if (isImageNotFound && mapRef.current && rawPropertyData) {
      initializeMap();
    }
  }, [isImageNotFound, rawPropertyData]);

  // Handle image load error
  const handleImageError = () => {
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

  const initializeMap = async () => {
    if (!mapRef.current) return;
    
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
            title: title,
          });
        }
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  };
  
  // Função para formatar data no padrão brasileiro
  const formatDateToBrazilian = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = dateString.match(brazilianDateRegex);
      
      if (match) {
        return dateString;
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Data inválida recebida no PropertyCard:', dateString);
        return '';
      }
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
    
    // 1. Judicial: tipo_leilao = "Judicial"
    if (tipoLeilao === "Judicial") {
      badges.push({
        text: "JUDICIAL",
        color: "bg-red-700"
      });
    }
    
    // 2. Extrajudicial Financiável: tipo_leilao != "Judicial" && financiamento = true
    else if (tipoLeilao !== "Judicial" && financiamento === true) {
      badges.push({
        text: "EXTRAJUDICIAL FINANCIÁVEL",
        color: "bg-purple-600"
      });
    }
    
    // 3. Extrajudicial: tipo_leilao != "Judicial" (e não é financiável)
    else if (tipoLeilao !== "Judicial") {
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
    <Link to={createPropertyUrl(id, getFullAddress())} target="_blank" rel="noopener noreferrer" className="block cursor-pointer h-full property-card-container">
      <div className="bg-[#191919] rounded-lg shadow-lg overflow-hidden text-white hover:shadow-xl transition-shadow duration-300 property-card-layout">
        {/* Imagem com altura fixa ou Mapa quando imagem não encontrada */}
        <div className="relative flex-shrink-0 property-card-header">
          {isImageNotFound ? (
            <div 
              ref={mapRef} 
              className="w-full h-40 sm:h-44 md:h-48 bg-gray-200"
            />
          ) : (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-40 sm:h-44 md:h-48 object-cover" 
              onError={handleImageError}
            />
          )}
          <Link 
            to={createPropertyUrl(id, getFullAddress())}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#d68e08] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-bold z-10 hover:bg-[#b8780a] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Saiba Mais
          </Link>
          <button 
            className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#25d366] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-bold z-10 hover:bg-[#20b858] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onContactClick) {
                onContactClick();
              }
            }}
          >
            <span className="hidden sm:inline">Fale conosco</span>
            <span className="sm:hidden">Contato</span>
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
        propertyUrl={createPropertyUrl(id, getFullAddress())}
        propertyTitle={title}
      />
    </Link>
  );
};
