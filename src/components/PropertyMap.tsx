import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, Loader2 } from 'lucide-react';
import { formatPropertyAddress } from '../utils/addressFormatter';
import { StreetViewEmbed } from './StreetViewEmbed';
import { MapEmbed } from './MapEmbed';

interface PropertyMapProps {
  property: {
    image?: string | null;
    title?: string | null;
  };
  rawPropertyData?: any;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ property, rawPropertyData }) => {
  const isImageNotFound = !property.image || 
                          property.image === '' ||
                          property.image.includes('/not-found') || 
                          property.image === 'https://kmiblhbe.manus.space/imovel_sao_goncalo.jpeg';
  const [activeTab, setActiveTab] = useState<'foto' | 'mapa' | 'street'>(isImageNotFound ? 'mapa' : 'foto');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!isImageNotFound);
  
  // Criar array apenas com imagens diferentes
  const images = React.useMemo(() => {
    const uniqueImages: string[] = [];

    // Adicionar imagem da propriedade se existir e for válida
    if (property.image &&
        property.image !== "/assets/logos/cataldo-siston-logo.png" &&
        !property.image.includes('/not-found') &&
        property.image !== 'https://kmiblhbe.manus.space/imovel_sao_goncalo.jpeg') {
      uniqueImages.push(property.image);
    }

    // Se não tem imagem válida, usar logo
    if (uniqueImages.length === 0) {
      uniqueImages.push("/assets/logos/cataldo-siston-logo.png");
    }

    return uniqueImages;
  }, [property.image]);

  // Reset image index when images array changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setImageLoading(true);
    setImageLoadError(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setImageLoading(true);
    setImageLoadError(false);
  };

  // Handle image load events
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageLoadError(false);
  };

  const handleImageError = () => {
    console.log('Erro ao carregar imagem da página do imóvel:', images[currentImageIndex]);
    setImageLoading(false);
    setImageLoadError(true);
  };

  const getFullAddress = () => {
    if (!rawPropertyData) return '';
    return formatPropertyAddress(
      rawPropertyData.endereco || '',
      rawPropertyData.bairro || '',
      rawPropertyData.cidade || '',
      rawPropertyData.estado || ''
    );
  };


  return (
    <div className="w-full">
      <div className="flex gap-1 mb-4">
        {!isImageNotFound && (
          <button
            onClick={() => setActiveTab('foto')}
            className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r text-white ${
              activeTab === 'foto'
                ? 'from-[#d68e08] via-[#e6a010] to-[#d68e08]'
                : 'from-[#b8780a] via-[#c8920e] to-[#b8780a] opacity-80 hover:opacity-100'
            }`}
          >
            Foto
          </button>
        )}
        <button
          onClick={() => setActiveTab('mapa')}
          className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r text-white ${
            activeTab === 'mapa'
              ? 'from-[#d68e08] via-[#e6a010] to-[#d68e08]'
              : 'from-[#b8780a] via-[#c8920e] to-[#b8780a] opacity-80 hover:opacity-100'
          }`}
        >
          Mapa
        </button>
        <button
          onClick={() => setActiveTab('street')}
          className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r text-white ${
            activeTab === 'street'
              ? 'from-[#d68e08] via-[#e6a010] to-[#d68e08]'
              : 'from-[#b8780a] via-[#c8920e] to-[#b8780a] opacity-80 hover:opacity-100'
          }`}
        >
          Visão da rua
        </button>
      </div>

      <div className="relative rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {activeTab === 'foto' && !isImageNotFound && (
          <div className="relative w-full h-full">
            {/* Estado de loading */}
            {imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-3" />
                <span className="text-lg text-gray-500 font-medium">Carregando imagem...</span>
              </div>
            )}

            {/* Estado de erro */}
            {imageLoadError && !imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <ImageOff className="w-16 h-16 text-gray-300 mb-4" />
                <span className="text-lg text-gray-400 font-medium mb-2">Essa imagem não pode ser carregada</span>
                <span className="text-sm text-gray-400 text-center px-6">
                  Cheque o mapa e a visão da rua para mais informações sobre este imóvel.
                </span>
              </div>
            )}

            {/* Imagem */}
            <img
              src={images[currentImageIndex]}
              alt={property.title || 'Imagem da propriedade'}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading || imageLoadError ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {/* Controles de navegação das imagens - só aparecem se não há erro */}
            {!imageLoadError && images.length > 1 && !imageLoading && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'mapa' && (
          <div className="w-full h-full" style={{ minHeight: '400px' }}>
            {/* Mapa usando Mapbox geocoding + Google Maps Embed (GRATUITO) */}
            <MapEmbed 
              address={getFullAddress()}
              height="400px"
              zoom={16}
              mapType="roadmap"
            />
          </div>
        )}

        {activeTab === 'street' && (
          <div className="w-full h-full" style={{ minHeight: '400px' }}>
            {/* Street View usando Mapbox geocoding + Google Embed (GRATUITO) */}
            <StreetViewEmbed 
              address={getFullAddress()}
              height="400px"
              heading={34}
              pitch={10}
              fov={90}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMap;
