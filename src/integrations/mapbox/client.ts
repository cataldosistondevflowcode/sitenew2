// Declarar mapboxgl como global (carregado via CDN)
declare global {
  interface Window {
    mapboxgl: any;
  }
}

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiY2F0YWxkb3Npc3RvbjIiLCJhIjoiY21qMDlsaWxjMDZ1NzNkcHpqcTU3dWUzZSJ9.nRQLqX_y-RjVMUSNaNLVTw';

export interface MapboxCoordinates {
  lng: number;
  lat: number;
}

export interface MapboxMapInstance {
  map: any;
  marker: any;
}

export const loadMapbox = async (): Promise<any> => {
  // Mapbox GL JS é carregado via CDN no index.html
  // Verificar se já está disponível
  if (typeof window.mapboxgl === 'undefined') {
    throw new Error('Mapbox GL JS não foi carregado. Verifique se o script está incluído no index.html');
  }
  
  // Configurar token do Mapbox
  window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  
  return window.mapboxgl;
};

export const geocodeAddress = async (address: string): Promise<MapboxCoordinates | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=BR&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lng, lat };
    }
    
    return null;
  } catch (error) {
    console.error('Erro no geocoding do Mapbox:', error);
    return null;
  }
};

export const createMapboxMap = (
  container: HTMLElement,
  coordinates: MapboxCoordinates,
  options: {
    zoom?: number;
    interactive?: boolean;
    title?: string;
  } = {}
): MapboxMapInstance => {
  const { zoom = 15, interactive = false, title = 'Propriedade' } = options;
  
  const map = new window.mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [coordinates.lng, coordinates.lat],
    zoom,
    interactive,
    attributionControl: false,
    logoPosition: 'bottom-right'
  });
  
  // Criar marcador
  const marker = new window.mapboxgl.Marker({
    color: '#d68e08'
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .setPopup(new window.mapboxgl.Popup().setHTML(`<div class="p-2"><strong>${title}</strong></div>`))
    .addTo(map);
  
  return { map, marker };
};
