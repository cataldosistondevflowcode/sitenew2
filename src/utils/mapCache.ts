interface MapCacheEntry {
  map: google.maps.Map;
  marker: google.maps.Marker;
  timestamp: number;
}

class MapCache {
  private cache = new Map<string, MapCacheEntry>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.CACHE_DURATION;
  }

  set(address: string, map: google.maps.Map, marker: google.maps.Marker): void {
    this.cache.set(address, {
      map,
      marker,
      timestamp: Date.now()
    });
  }

  get(address: string): { map: google.maps.Map; marker: google.maps.Marker } | null {
    const entry = this.cache.get(address);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry.timestamp)) {
      this.cache.delete(address);
      return null;
    }

    return { map: entry.map, marker: entry.marker };
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
        this.cache.delete(key);
      }
    }
  }
}

export const mapCache = new MapCache();

// Limpeza automática a cada 10 minutos
setInterval(() => {
  mapCache.cleanExpired();
}, 10 * 60 * 1000);