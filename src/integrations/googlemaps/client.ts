import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAhJ8Gwj8myDXFR7UaLADc7PJAWe7mLERU';

export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

export const loadGoogleMaps = async (): Promise<typeof google> => {
  await googleMapsLoader.load();
  return google;
};
