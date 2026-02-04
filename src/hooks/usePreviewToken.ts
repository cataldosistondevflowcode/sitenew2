/**
 * Hook: usePreviewToken
 * 
 * Gerencia tokens de preview temporários para compartilhamento
 * Sprint CMS v3 — Preview Completo
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface PreviewToken {
  id: number;
  page_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

// Gerar token aleatório de 32 caracteres
const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const usePreviewToken = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Criar token de preview temporário
   * @param pageId ID da página
   * @param expiresInMinutes Tempo de expiração em minutos (default: 60)
   */
  const createToken = async (pageId: number, expiresInMinutes = 60): Promise<PreviewToken | null> => {
    try {
      setIsCreating(true);

      const token = generateToken();
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('cms_preview_tokens')
        .insert({
          page_id: pageId,
          token,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Token criado',
        description: `Link de preview válido por ${expiresInMinutes} minutos`,
      });

      return data as PreviewToken;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar token';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Validar token de preview
   * @param token Token a validar
   * @returns Dados do token se válido, null se inválido ou expirado
   */
  const validateToken = async (token: string): Promise<{ pageId: number; slug: string } | null> => {
    try {
      setIsValidating(true);

      const { data, error } = await supabase
        .from('cms_preview_tokens')
        .select(`
          id,
          page_id,
          expires_at,
          cms_pages!inner(slug)
        `)
        .eq('token', token)
        .single();

      if (error || !data) {
        return null;
      }

      // Verificar se expirou
      if (new Date(data.expires_at) < new Date()) {
        return null;
      }

      return {
        pageId: data.page_id,
        slug: (data as any).cms_pages?.slug || '',
      };
    } catch {
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Gerar URL de preview com token
   */
  const getPreviewUrl = (slug: string, token: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/preview/${slug}?token=${token}`;
  };

  /**
   * Copiar URL de preview para clipboard
   */
  const copyPreviewUrl = async (slug: string, token: string): Promise<boolean> => {
    try {
      const url = getPreviewUrl(slug, token);
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copiado!',
        description: 'O link de preview foi copiado para a área de transferência',
      });
      return true;
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link',
        variant: 'destructive',
      });
      return false;
    }
  };

  /**
   * Limpar tokens expirados (cleanup)
   */
  const cleanupExpiredTokens = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('cms_preview_tokens')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id');

      if (error) throw error;

      return data?.length || 0;
    } catch {
      return 0;
    }
  };

  return {
    createToken,
    validateToken,
    getPreviewUrl,
    copyPreviewUrl,
    cleanupExpiredTokens,
    isCreating,
    isValidating,
  };
};
