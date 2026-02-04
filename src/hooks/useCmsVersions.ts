/**
 * Hook: useCmsVersions
 *
 * Histórico de versões e rollback (Sprint CMS v4 — FR-ADM-008).
 * - Listar versões de um bloco
 * - Reverter bloco para uma versão anterior (como draft)
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface CmsVersion {
  id: number;
  entity_type: 'page' | 'block';
  entity_id: number;
  version_number: number;
  data_snapshot: Record<string, unknown>;
  created_at: string;
  created_by?: string;
}

export function useCmsVersions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState(false);

  const listBlockVersions = useCallback(
    async (blockId: number): Promise<CmsVersion[]> => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cms_versions')
          .select('*')
          .eq('entity_type', 'block')
          .eq('entity_id', blockId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as CmsVersion[];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar versões';
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const revertBlockToVersion = useCallback(
    async (blockId: number, versionId: number): Promise<boolean> => {
      setReverting(true);
      try {
        const { data, error } = await supabase.rpc('revert_block_to_version', {
          p_block_id: blockId,
          p_version_id: versionId,
          p_user_id: user?.id ?? null,
        });

        if (error) throw new Error(error.message);

        const result = data as { success?: boolean; error?: string } | null;
        if (result && !result.success) {
          throw new Error(result.error || 'Erro ao reverter');
        }

        toast({
          title: 'Sucesso',
          description: 'Versão restaurada como rascunho. Você pode publicar quando quiser.',
        });
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao reverter';
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
        return false;
      } finally {
        setReverting(false);
      }
    },
    [user?.id, toast]
  );

  return {
    listBlockVersions,
    revertBlockToVersion,
    loading,
    reverting,
  };
}
