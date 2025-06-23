import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { loadGoogleMaps } from '../integrations/googlemaps/client';
import { formatPropertyAddress } from '../utils/addressFormatter';

interface PropertyMapProps {
  property: {
    image: string;
    title: string;
  };
  rawPropertyData?: any;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ property, rawPropertyData }) => {
  const isImageNotFound = property.image.includes('/not-found');
  const [activeTab, setActiveTab] = useState<'foto' | 'mapa' | 'street'>(isImageNotFound ? 'mapa' : 'foto');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [streetViewLoaded, setStreetViewLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const streetViewInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const images = [
    property.image,
    "/assets/logos/cataldo-siston-logo.png",
    property.image
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
      const geocoder = new google.maps.Geocoder();
      const address = getFullAddress();
      
      if (!address) {
        console.warn('No address available for mapping');
        return;
      }

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0] && mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            zoom: 16,
            center: results[0].geometry.location,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          });

          new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: property.title,
          });

          mapInstanceRef.current = map;
          setMapLoaded(true);
        } else {
          console.error('Geocoding failed:', status);
        }
      });
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
      const geocoder = new google.maps.Geocoder();
      const address = getFullAddress();
      
      if (!address) {
        console.warn('No address available for Street View');
        return;
      }

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0] && streetViewRef.current) {
          const panorama = new google.maps.StreetViewPanorama(streetViewRef.current, {
            position: results[0].geometry.location,
            pov: { heading: 34, pitch: 10 },
            zoom: 1,
          });

          streetViewInstanceRef.current = panorama;
          setStreetViewLoaded(true);
        } else {
          console.error('Geocoding failed for Street View:', status);
        }
      });
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
      <div className="flex border-b border-gray-300 mb-4">
        {!isImageNotFound && (
          <button
            onClick={() => setActiveTab('foto')}
            className={`px-6 py-3 font-medium text-sm uppercase tracking-wide ${
              activeTab === 'foto'
                ? 'text-[#d68e08] border-b-2 border-[#d68e08] bg-gray-50'
                : 'text-gray-600 hover:text-[#d68e08] hover:bg-gray-50'
            }`}
          >
            Foto
          </button>
        )}
        <button
          onClick={() => setActiveTab('mapa')}
          className={`px-6 py-3 font-medium text-sm uppercase tracking-wide ${
            activeTab === 'mapa'
              ? 'text-[#d68e08] border-b-2 border-[#d68e08] bg-gray-50'
              : 'text-gray-600 hover:text-[#d68e08] hover:bg-gray-50'
          }`}
        >
          Mapa
        </button>
        <button
          onClick={() => setActiveTab('street')}
          className={`px-6 py-3 font-medium text-sm uppercase tracking-wide ${
            activeTab === 'street'
              ? 'text-[#d68e08] border-b-2 border-[#d68e08] bg-gray-50'
              : 'text-gray-600 hover:text-[#d68e08] hover:bg-gray-50'
          }`}
        >
          Visão da rua
        </button>
      </div>

      <div className="relative rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {activeTab === 'foto' && !isImageNotFound && (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full"
              onClick={prevImage}
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-2 rounded-full"
              onClick={nextImage}
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>
            
            <button className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded flex items-center">
              <span className="mr-2">Foto {currentImageIndex + 1}/{images.length}</span>
            </button>
          </>
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
