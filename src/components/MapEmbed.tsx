import React, { useEffect, useState } from 'react';
import { geocodeAddress } from '@/integrations/mapbox/client';
import { mapboxGeocodeCache } from '@/utils/mapboxCache';

interface MapEmbedProps {
  address: string;
  height?: string;
  zoom?: number;
  mapType?: 'roadmap' | 'satellite';
}

/**
 * Componente de Mapa usando:
 * - Mapbox para geocoding (com cache de 24h) = ECONÔMICO
 * - Google Maps Embed para exibição = GRATUITO (100%)
 */
export const MapEmbed: React.FC<MapEmbedProps> = ({ 
  address, 
  height = '400px',
  zoom = 16,
  mapType = 'roadmap'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mapUrl, setMapUrl] = useState<string>('');
  
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAhJ8Gwj8myDXFR7UaLADc7PJAWe7mLERU';

  useEffect(() => {
    const loadMap = async () => {
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
          console.log('🔍 Mapa: Fazendo geocoding para:', address);
          coordinates = await geocodeAddress(address);
          
          if (coordinates) {
            mapboxGeocodeCache.set(address, coordinates);
            console.log('✅ Mapa: Coordenadas salvas no cache:', coordinates);
          }
        } else {
          console.log('⚡ Mapa: Usando coordenadas do cache:', coordinates);
        }

        if (!coordinates) {
          console.error('❌ Mapa: Não foi possível obter coordenadas para:', address);
          setError(true);
          setLoading(false);
          return;
        }

        // 3. Gerar URL do Google Maps Embed (GRATUITO)
        const center = `${coordinates.lat},${coordinates.lng}`;
        const url = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${center}&zoom=${zoom}&maptype=${mapType}`;
        
        console.log('🗺️ Mapa: Criando embed iframe (GRATUITO)');
        setMapUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erro ao carregar mapa:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadMap();
  }, [address, zoom, mapType, GOOGLE_MAPS_API_KEY]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm mb-2">Mapa não disponível</p>
          <p className="text-gray-400 text-xs">
            Não foi possível carregar o mapa para esta localização
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
          <p className="text-gray-500 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded overflow-hidden" style={{ height }}>
      <iframe
        src={mapUrl}
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
