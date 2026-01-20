/**
 * Hook para buscar conteúdo do Webflow CMS via Edge Function
 * 
 * Este hook:
 * - Faz requisição para Edge Function (proxy seguro)
 * - Usa TanStack Query para cache e gerenciamento de estado
 * - Retorna dados tipados do Webflow CMS
 * - Trata erros e estados de loading
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WebflowCMSResponse, WebflowCMSItem } from "@/types/webflow";

interface UseWebflowCMSOptions {
  /**
   * ID da collection do Webflow CMS
   */
  collectionId: string;
  
  /**
   * Limite de itens a retornar
   * @default 10
   */
  limit?: number;
  
  /**
   * Se deve habilitar a query
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Tempo de cache em milissegundos
   * @default 300000 (5 minutos)
   */
  staleTime?: number;
}

/**
 * Hook para buscar conteúdo do Webflow CMS
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useWebflowCMS({
 *   collectionId: 'hero-content-collection-id',
 *   limit: 1,
 * });
 * ```
 */
export const useWebflowCMS = <T extends WebflowCMSItem = WebflowCMSItem>(
  options: UseWebflowCMSOptions
) => {
  const { collectionId, limit = 10, enabled = true, staleTime = 300000 } = options;

  return useQuery<WebflowCMSResponse<T>, Error>({
    queryKey: ["webflow-cms", collectionId, limit],
    queryFn: async () => {
      // Chamar Edge Function
      const { data, error } = await supabase.functions.invoke("webflow-cms-proxy", {
        body: {
          collectionId,
          limit,
        },
      });

      if (error) {
        throw new Error(`Failed to fetch Webflow CMS: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error(data?.message || "Failed to fetch Webflow CMS");
      }

      return data as WebflowCMSResponse<T>;
    },
    enabled: enabled && !!collectionId,
    staleTime,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook específico para buscar Hero Content
 */
export const useWebflowHero = (enabled: boolean = true) => {
  // TODO: Substituir por Collection ID real quando disponível
  // Usar variável de ambiente ou valor padrão
  const HERO_COLLECTION_ID = import.meta.env.VITE_WEBFLOW_HERO_COLLECTION_ID || "";
  
  return useWebflowCMS({
    collectionId: HERO_COLLECTION_ID,
    limit: 1,
    enabled: enabled && !!HERO_COLLECTION_ID,
  });
};

/**
 * Hook específico para buscar Testimonials
 */
export const useWebflowTestimonials = (limit: number = 10, enabled: boolean = true) => {
  // TODO: Substituir por Collection ID real quando disponível
  // Usar variável de ambiente ou valor padrão
  const TESTIMONIALS_COLLECTION_ID = import.meta.env.VITE_WEBFLOW_TESTIMONIALS_COLLECTION_ID || "";
  
  return useWebflowCMS({
    collectionId: TESTIMONIALS_COLLECTION_ID,
    limit,
    enabled: enabled && !!TESTIMONIALS_COLLECTION_ID,
  });
};
