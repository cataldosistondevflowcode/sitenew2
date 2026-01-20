/**
 * Hook para redirecionar para páginas SEO fixas quando uma região mapeada é selecionada
 * Conforme RF-04 e RF-03 - Páginas Regionais Fixas
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { FilterParams } from './useFilterParams';

interface SEOPageMapping {
  page_id: string;
  filter_type: 'bairro' | 'zona' | 'cidade';
  filter_value: string;
  estado: string;
}

/**
 * Hook para verificar e redirecionar para páginas SEO fixas
 * @param filters - Filtros atuais aplicados
 * @param currentState - Estado atual (RJ/SP)
 * @param enabled - Se o redirecionamento está habilitado (padrão: true)
 */
export const useSEORedirect = (
  filters: FilterParams,
  currentState: 'RJ' | 'SP' = 'RJ',
  enabled: boolean = true
) => {
  const navigate = useNavigate();
  const [mappings, setMappings] = useState<SEOPageMapping[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  // Carregar mapeamentos de páginas SEO ativas
  useEffect(() => {
    if (!enabled) return;

    const loadMappings = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_pages')
          .select('page_id, filter_type, filter_value, estado')
          .eq('is_active', true)
          .eq('estado', currentState);

        if (error) {
          console.error('Erro ao carregar mapeamentos SEO:', error);
          return;
        }

        setMappings((data || []) as SEOPageMapping[]);
      } catch (error) {
        console.error('Erro ao carregar mapeamentos SEO:', error);
      }
    };

    loadMappings();
  }, [currentState, enabled]);

  // Verificar se deve redirecionar quando filtros mudarem
  useEffect(() => {
    if (!enabled || isChecking || mappings.length === 0) return;

    const checkAndRedirect = async () => {
      setIsChecking(true);

      try {
        // Verificar se há um filtro de bairro que corresponde a uma página SEO
        if (filters.neighborhood) {
          const mapping = mappings.find(
            m => m.filter_type === 'bairro' && 
                 m.filter_value.toLowerCase() === filters.neighborhood.toLowerCase()
          );

          if (mapping) {
            // Redirecionar para página SEO fixa
            navigate(`/catalogo/${mapping.page_id}`, { replace: true });
            return;
          }
        }

        // Verificar se há um filtro de zona que corresponde a uma página SEO
        if (filters.zone) {
          const mapping = mappings.find(
            m => m.filter_type === 'zona' && 
                 m.filter_value.toLowerCase() === filters.zone.toLowerCase()
          );

          if (mapping) {
            // Redirecionar para página SEO fixa
            navigate(`/catalogo/${mapping.page_id}`, { replace: true });
            return;
          }
        }

        // Verificar múltiplas zonas
        if (filters.zones && filters.zones.length > 0) {
          // Se apenas uma zona está selecionada, verificar se tem página SEO
          if (filters.zones.length === 1) {
            const mapping = mappings.find(
              m => m.filter_type === 'zona' && 
                   m.filter_value.toLowerCase() === filters.zones![0].toLowerCase()
            );

            if (mapping) {
              navigate(`/catalogo/${mapping.page_id}`, { replace: true });
              return;
            }
          }
        }

        // Verificar múltiplos bairros
        if (filters.neighborhoods && filters.neighborhoods.length > 0) {
          // Se apenas um bairro está selecionado, verificar se tem página SEO
          if (filters.neighborhoods.length === 1) {
            const mapping = mappings.find(
              m => m.filter_type === 'bairro' && 
                   m.filter_value.toLowerCase() === filters.neighborhoods![0].toLowerCase()
            );

            if (mapping) {
              navigate(`/catalogo/${mapping.page_id}`, { replace: true });
              return;
            }
          }
        }

      } catch (error) {
        console.error('Erro ao verificar redirecionamento SEO:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Delay para evitar redirecionamentos durante digitação
    const timeoutId = setTimeout(() => {
      checkAndRedirect();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, mappings, navigate, enabled, isChecking]);

  /**
   * Verifica se uma região específica tem página SEO mapeada
   */
  const hasSEOPage = (filterType: 'bairro' | 'zona' | 'cidade', filterValue: string): boolean => {
    return mappings.some(
      m => m.filter_type === filterType && 
           m.filter_value.toLowerCase() === filterValue.toLowerCase()
    );
  };

  /**
   * Obtém o page_id de uma região mapeada
   */
  const getSEOPageId = (filterType: 'bairro' | 'zona' | 'cidade', filterValue: string): string | null => {
    const mapping = mappings.find(
      m => m.filter_type === filterType && 
           m.filter_value.toLowerCase() === filterValue.toLowerCase()
    );
    return mapping?.page_id || null;
  };

  return {
    hasSEOPage,
    getSEOPageId,
    isChecking
  };
};
