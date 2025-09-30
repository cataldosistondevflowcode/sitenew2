import React, { useEffect, useRef, useState } from 'react';
import { geocodeAddress } from '@/integrations/mapbox/client';
import { mapboxGeocodeCache } from '@/utils/mapboxCache';

interface StreetViewEmbedProps {
  address: string;
  height?: string;
  heading?: number;
  pitch?: number;
  fov?: number;
}

/**
 * Componente de Street View usando:
 * - Mapbox para geocoding (com cache de 24h) = ECONÔMICO
 * - Google Street View Embed para exibição = GRATUITO (100%)
 */
export const StreetViewEmbed: React.FC<StreetViewEmbedProps> = ({ 
  address, 
  height = '400px',
  heading = 0,
  pitch = 0,
  fov = 90
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [streetViewUrl, setStreetViewUrl] = useState<string>('');
  
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAhJ8Gwj8myDXFR7UaLADc7PJAWe7mLERU';

  useEffect(() => {
    const loadStreetView = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        
        // 1. Verificar cache do Mapbox primeiro (24h de duração)
        let coordinates = mapboxGeocodeCache.get(address);
        
        // 2. Se não tem cache, fazer geocoding com Mapbox
        if (!coordinates) {
          console.log('🔍 Street View: Fazendo geocoding para:', address);
          coordinates = await geocodeAddress(address);
          
          if (coordinates) {
            mapboxGeocodeCache.set(address, coordinates);
            console.log('✅ Street View: Coordenadas salvas no cache:', coordinates);
          }
        } else {
          console.log('⚡ Street View: Usando coordenadas do cache:', coordinates);
        }

        if (!coordinates) {
          console.error('❌ Street View: Não foi possível obter coordenadas para:', address);
          setError(true);
          setLoading(false);
          return;
        }

        // 3. Gerar URL do Google Street View Embed (GRATUITO)
        const location = `${coordinates.lat},${coordinates.lng}`;
        const url = `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_API_KEY}&location=${location}&heading=${heading}&pitch=${pitch}&fov=${fov}`;
        
        console.log('🗺️ Street View: Criando embed iframe (GRATUITO)');
        setStreetViewUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erro ao carregar Street View:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadStreetView();
  }, [address, heading, pitch, fov, GOOGLE_MAPS_API_KEY]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm mb-2">Street View não disponível</p>
          <p className="text-gray-400 text-xs">
            Pode não haver cobertura do Street View nesta localização
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded animate-pulse"
        style={{ height }}
      >
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-2"></div>
          <p className="text-gray-500 text-sm">Carregando Street View...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full rounded overflow-hidden" style={{ height }}>
      <iframe
        src={streetViewUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="geolocation"
      />
    </div>
  );
};
