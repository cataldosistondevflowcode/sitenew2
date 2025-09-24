import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { loadGoogleMaps } from '../integrations/googlemaps/client';
import { formatPropertyAddress } from '../utils/addressFormatter';
import { geocodeCache } from '../utils/geocodeCache';

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [streetViewLoaded, setStreetViewLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const streetViewInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null);
  
  const images = [
    property.image || "/assets/logos/cataldo-siston-logo.png",
    "/assets/logos/cataldo-siston-logo.png",
    property.image || "/assets/logos/cataldo-siston-logo.png"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
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

  const initializeMap = async () => {
    if (!mapRef.current) return;

    // Reset loading state if element is not ready
    if (mapLoaded && !mapInstanceRef.current) {
      setMapLoaded(false);
    }

    if (mapLoaded && mapInstanceRef.current) return;

    try {
      const google = await loadGoogleMaps();
      const address = getFullAddress();

      if (!address) {
        console.warn('No address available for mapping');
        return;
      }

      // Verificar cache primeiro
      const cachedCoordinates = geocodeCache.get(address);

      if (cachedCoordinates) {
        // Usar coordenadas do cache
        const map = new google.maps.Map(mapRef.current, {
          zoom: 16,
          center: cachedCoordinates,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        new google.maps.Marker({
          position: cachedCoordinates,
          map: map,
          title: property.title || 'Propriedade',
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } else {
        // Fazer geocoding e salvar no cache
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0] && mapRef.current) {
            const coordinates = results[0].geometry.location;

            // Salvar no cache
            geocodeCache.set(address, coordinates);

            const map = new google.maps.Map(mapRef.current, {
              zoom: 16,
              center: coordinates,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            });

            new google.maps.Marker({
              position: coordinates,
              map: map,
              title: property.title || 'Propriedade',
            });

            mapInstanceRef.current = map;
            setMapLoaded(true);
          } else {
            console.error('Geocoding failed:', status);
          }
        });
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  };

  const initializeStreetView = async () => {
    if (!streetViewRef.current) return;

    // Reset loading state if element is not ready
    if (streetViewLoaded && !streetViewInstanceRef.current) {
      setStreetViewLoaded(false);
    }

    if (streetViewLoaded && streetViewInstanceRef.current) return;

    try {
      const google = await loadGoogleMaps();
      const address = getFullAddress();

      if (!address) {
        console.warn('No address available for Street View');
        return;
      }

      // Verificar cache primeiro
      const cachedCoordinates = geocodeCache.get(address);

      if (cachedCoordinates) {
        // Usar coordenadas do cache
        const panorama = new google.maps.StreetViewPanorama(streetViewRef.current, {
          position: cachedCoordinates,
          pov: { heading: 34, pitch: 10 },
          zoom: 1,
        });

        streetViewInstanceRef.current = panorama;
        setStreetViewLoaded(true);
      } else {
        // Fazer geocoding e salvar no cache
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0] && streetViewRef.current) {
            const coordinates = results[0].geometry.location;

            // Salvar no cache
            geocodeCache.set(address, coordinates);

            const panorama = new google.maps.StreetViewPanorama(streetViewRef.current, {
              position: coordinates,
              pov: { heading: 34, pitch: 10 },
              zoom: 1,
            });

            streetViewInstanceRef.current = panorama;
            setStreetViewLoaded(true);
          } else {
            console.error('Geocoding failed for Street View:', status);
          }
        });
      }
    } catch (error) {
      console.error('Error loading Street View:', error);
    }
  };

  // Effect to handle tab changes and cleanup
  useEffect(() => {
    // Reset states when tab changes
    if (activeTab !== 'mapa') {
      mapInstanceRef.current = null;
      setMapLoaded(false);
    }
    
    if (activeTab !== 'street') {
      streetViewInstanceRef.current = null;
      setStreetViewLoaded(false);
    }

    // Initialize based on active tab
    if (activeTab === 'mapa') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    } else if (activeTab === 'street') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeStreetView();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Effect to trigger resize event when map becomes visible
  useEffect(() => {
    if (activeTab === 'mapa' && mapInstanceRef.current) {
      // Trigger resize to fix display issues
      setTimeout(() => {
        if (mapInstanceRef.current) {
          google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }
      }, 200);
    }
  }, [activeTab, mapLoaded]);

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
          <img 
            src={images[currentImageIndex]} 
            alt={property.title || 'Imagem da propriedade'} 
            className="w-full h-full object-cover"
          />
        )}

        {activeTab === 'mapa' && (
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
        )}

        {activeTab === 'street' && (
          <div 
            ref={streetViewRef} 
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyMap;
