interface StaticMapOptions {
  address: string;
  width?: number;
  height?: number;
  zoom?: number;
  mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
  marker?: boolean;
}

export const generateStaticMapUrl = (options: StaticMapOptions): string => {
  const {
    address,
    width = 400,
    height = 200,
    zoom = 15,
    mapType = 'roadmap',
    marker = true
  } = options;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAhJ8Gwj8myDXFR7UaLADc7PJAWe7mLERU';

  const encodedAddress = encodeURIComponent(address);

  let url = `https://maps.googleapis.com/maps/api/staticmap?`;
  url += `center=${encodedAddress}`;
  url += `&zoom=${zoom}`;
  url += `&size=${width}x${height}`;
  url += `&maptype=${mapType}`;
  url += `&key=${apiKey}`;

  if (marker) {
    url += `&markers=color:red%7C${encodedAddress}`;
  }

  console.log('URL do mapa gerada:', url);
  return url;
};