import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = "AIzaSyDgSXLV-7AdIZ_bm8mNWswm516VqcFwQzI";

export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

export const loadGoogleMaps = async (): Promise<typeof google> => {
  await googleMapsLoader.load();
  return google;
};
