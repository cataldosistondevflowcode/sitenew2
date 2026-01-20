/**
 * Hook para rastreamento automático de eventos RD Station
 * 
 * Este hook rastreia automaticamente:
 * - Visualizações de página (mudanças de rota)
 * - Cliques em imóveis
 * - Aplicação de filtros
 * - Buscas realizadas
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackFilterApplied,
  trackSearch,
} from '@/utils/rdStation';

interface UseRDStationTrackingOptions {
  /**
   * Nome da página para rastreamento
   * Se não fornecido, usa o título do documento
   */
  pageName?: string;
  
  /**
   * Dados adicionais para incluir no evento de visualização
   */
  additionalData?: Record<string, any>;
  
  /**
   * Se deve rastrear mudanças de rota automaticamente
   * @default true
   */
  trackRouteChanges?: boolean;
}

/**
 * Hook para rastreamento automático de eventos RD Station
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   useRDStationTracking({ pageName: 'Home Page' });
 *   return <div>...</div>;
 * }
 * ```
 */
export const useRDStationTracking = (options: UseRDStationTrackingOptions = {}): void => {
  const location = useLocation();
  const {
    pageName,
    additionalData,
    trackRouteChanges = true,
  } = options;

  useEffect(() => {
    if (trackRouteChanges) {
      // Rastrear visualização de página quando a rota muda
      trackPageView(pageName, {
        path: location.pathname,
        search: location.search,
        ...additionalData,
      });
    }
  }, [location.pathname, location.search, pageName, additionalData, trackRouteChanges]);
};

/**
 * Hook para rastrear aplicação de filtros
 */
export const useRDStationFilterTracking = (
  filters: Record<string, any>,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled || !filters || Object.keys(filters).length === 0) {
      return;
    }

    // Rastrear cada filtro aplicado
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        trackFilterApplied(key, String(value), {
          all_filters: filters,
        });
      }
    });
  }, [filters, enabled]);
};

/**
 * Hook para rastrear buscas
 */
export const useRDStationSearchTracking = (
  searchQuery: string,
  resultsCount?: number,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled || !searchQuery || searchQuery.trim() === '') {
      return;
    }

    trackSearch(searchQuery, resultsCount);
  }, [searchQuery, resultsCount, enabled]);
};
