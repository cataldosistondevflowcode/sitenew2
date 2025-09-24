interface GeocodeResult {
  coordinates: google.maps.LatLng;
  timestamp: number;
}

class GeocodeCache {
  private cache = new Map<string, GeocodeResult>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  set(address: string, coordinates: google.maps.LatLng): void {
    this.cache.set(address, {
      coordinates,
      timestamp: Date.now()
    });
  }

  get(address: string): google.maps.LatLng | null {
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

export const geocodeCache = new GeocodeCache();