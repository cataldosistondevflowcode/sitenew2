/**
 * Hook para buscar dados de filtros do Supabase
 * Conforme RF-05 - Filtros vindos do Supabase
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FilterRegion {
  id: number;
  name: string;
  state: string;
  display_order: number;
  is_active: boolean;
}

export interface FilterCity {
  id: number;
  name: string;
  state: string;
  region_id: number | null;
  display_order: number;
  is_active: boolean;
}

export interface FilterZone {
  id: number;
  name: string;
  city_id: number;
  zone_type: string;
  display_order: number;
  is_active: boolean;
}

export interface FilterNeighborhood {
  id: number;
  name: string;
  city_id: number;
  zone_id: number | null;
  display_order: number;
  is_active: boolean;
}

/**
 * Hook para buscar regiões do Supabase
 */
export const useFilterRegions = (state?: 'RJ' | 'SP') => {
  const [regions, setRegions] = useState<FilterRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('filter_regions')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (state) {
          query = query.eq('state', state);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        setRegions((data || []) as FilterRegion[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar regiões'));
        console.error('Erro ao buscar regiões:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [state]);

  return { regions, loading, error };
};

/**
 * Hook para buscar cidades do Supabase
 */
export const useFilterCities = (state?: 'RJ' | 'SP', regionId?: number) => {
  const [cities, setCities] = useState<FilterCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('filter_cities')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (state) {
          query = query.eq('state', state);
        }

        if (regionId) {
          query = query.eq('region_id', regionId);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        setCities((data || []) as FilterCity[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar cidades'));
        console.error('Erro ao buscar cidades:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [state, regionId]);

  return { cities, loading, error };
};

/**
 * Hook para buscar zonas do Supabase
 */
export const useFilterZones = (cityId?: number) => {
  const [zones, setZones] = useState<FilterZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('filter_zones')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (cityId) {
          query = query.eq('city_id', cityId);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        setZones((data || []) as FilterZone[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar zonas'));
        console.error('Erro ao buscar zonas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, [cityId]);

  return { zones, loading, error };
};

/**
 * Hook para buscar bairros do Supabase
 */
export const useFilterNeighborhoods = (cityId?: number, zoneId?: number) => {
  const [neighborhoods, setNeighborhoods] = useState<FilterNeighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('filter_neighborhoods')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (cityId) {
          query = query.eq('city_id', cityId);
        }

        if (zoneId) {
          query = query.eq('zone_id', zoneId);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        setNeighborhoods((data || []) as FilterNeighborhood[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar bairros'));
        console.error('Erro ao buscar bairros:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoods();
  }, [cityId, zoneId]);

  return { neighborhoods, loading, error };
};

/**
 * Hook combinado para buscar todos os dados de filtros de uma vez
 * Útil para páginas que precisam de múltiplos tipos de filtros
 */
export const useFilterData = (state?: 'RJ' | 'SP') => {
  const { regions, loading: regionsLoading, error: regionsError } = useFilterRegions(state);
  const { cities, loading: citiesLoading, error: citiesError } = useFilterCities(state);
  const { zones, loading: zonesLoading, error: zonesError } = useFilterZones();
  const { neighborhoods, loading: neighborhoodsLoading, error: neighborhoodsError } = useFilterNeighborhoods();

  const loading = regionsLoading || citiesLoading || zonesLoading || neighborhoodsLoading;
  const error = regionsError || citiesError || zonesError || neighborhoodsError;

  return {
    regions,
    cities,
    zones,
    neighborhoods,
    loading,
    error
  };
};
