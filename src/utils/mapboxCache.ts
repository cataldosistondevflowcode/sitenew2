import { MapboxCoordinates, MapboxMapInstance } from '../integrations/mapbox/client';

interface MapboxGeocodeResult {
  coordinates: MapboxCoordinates;
  timestamp: number;
}

interface MapboxMapCacheEntry {
  mapInstance: MapboxMapInstance;
  timestamp: number;
}

class MapboxGeocodeCache {
  private cache = new Map<string, MapboxGeocodeResult>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  set(address: string, coordinates: MapboxCoordinates): void {
    this.cache.set(address, {
      coordinates,
      timestamp: Date.now()
    });
  }

  get(address: string): MapboxCoordinates | null {
    const result = this.cache.get(address);

    if (!result) {
      return null;
    }

    if (this.isExpired(result.timestamp)) {
      this.cache.delete(address);
      return null;
    }

    return result.coordinates;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

class MapboxMapCache {
  private cache = new Map<string, MapboxMapCacheEntry>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  set(address: string, mapInstance: MapboxMapInstance): void {
    this.cache.set(address, {
      mapInstance,
      timestamp: Date.now()
    });
  }

  get(address: string): MapboxMapInstance | null {
    const entry = this.cache.get(address);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry.timestamp)) {
      this.cache.delete(address);
      return null;
    }

    return entry.mapInstance;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Limpar mapas expirados periodicamente
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry.timestamp)) {
        // Remover o mapa do DOM antes de limpar do cache
        if (entry.mapInstance.map.getContainer().parentNode) {
          entry.mapInstance.map.remove();
        }
        this.cache.delete(key);
      }
    }
  }
}

export const mapboxGeocodeCache = new MapboxGeocodeCache();
export const mapboxMapCache = new MapboxMapCache();

// Limpeza automática a cada 10 minutos
setInterval(() => {
  mapboxMapCache.cleanExpired();
}, 10 * 60 * 1000);
