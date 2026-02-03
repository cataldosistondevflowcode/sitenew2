/**
 * Hook: useCmsContent
 * 
 * Gerencia conteúdo do CMS (páginas, blocos, draft/publish)
 * Sprint CMS v0 — MVP mínimo
 * 
 * Funcionalidades:
 * - Carregar página e blocos do CMS
 * - Salvar alterações como draft
 * - Publicar conteúdo (draft → published)
 * - Registrar no audit log
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CmsBlock {
  id: number;
  page_id: number;
  block_key: string;
  block_type: 'text' | 'richtext' | 'image' | 'cta' | 'list' | 'faq' | 'banner';
  content_draft: Record<string, any>;
  content_published: Record<string, any>;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsAuditLog {
  id: number;
  actor_id?: string;
  actor_email?: string;
  action: 'create' | 'update' | 'publish' | 'revert' | 'delete' | 'upload';
  entity_type: 'page' | 'block' | 'asset';
  entity_id: number;
  entity_name?: string;
  details?: Record<string, any>;
  created_at: string;
}

export const useCmsContent = (pageSlug: string) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [page, setPage] = useState<CmsPage | null>(null);
  const [blocks, setBlocks] = useState<CmsBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar página e blocos
  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Carregar página
      const { data: pageData, error: pageError } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', pageSlug)
        .single();

      if (pageError) throw new Error(`Página não encontrada: ${pageError.message}`);
      if (!pageData) throw new Error('Página não encontrada');

      setPage(pageData as CmsPage);

      // 2. Carregar blocos
      const { data: blocksData, error: blocksError } = await supabase
        .from('cms_blocks')
        .select('*')
        .eq('page_id', pageData.id)
        .order('display_order', { ascending: true });

      if (blocksError) throw new Error(`Erro ao carregar blocos: ${blocksError.message}`);

      setBlocks((blocksData || []) as CmsBlock[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Validar conteúdo do bloco
  const validateBlockContent = (block: CmsBlock, content: Record<string, any>): string[] => {
    const errors: string[] = [];

    switch (block.block_type) {
      case 'text':
      case 'richtext':
        if (!content.value || !content.value.trim()) {
          errors.push('Conteúdo não pode estar vazio');
        }
        break;

      case 'image':
        if (!content.url || !content.url.trim()) {
          errors.push('URL da imagem é obrigatória');
        } else {
          try {
            new URL(content.url);
          } catch {
            errors.push('URL da imagem inválida');
          }
        }
        break;

      case 'cta':
        if (!content.text || !content.text.trim()) {
          errors.push('Texto do botão é obrigatório');
        }
        if (!content.url || !content.url.trim()) {
          errors.push('URL/Link é obrigatório');
        }
        break;

      case 'list':
        if (!Array.isArray(content.items) || content.items.length === 0) {
          errors.push('Lista precisa de pelo menos um item');
        }
        break;

      case 'faq':
        if (!Array.isArray(content.items) || content.items.length === 0) {
          errors.push('FAQ precisa de pelo menos um item');
        }
        break;
    }

    return errors;
  };

  // Atualizar bloco (salvar como draft)
  const updateBlockDraft = async (blockId: number, content: Record<string, any>) => {
    try {
      setIsSaving(true);

      // Validar conteúdo
      const block = blocks.find((b) => b.id === blockId);
      if (!block) throw new Error('Bloco não encontrado');

      const validationErrors = validateBlockContent(block, content);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('; '));
      }

      // Atualizar content_draft no Supabase
      const { error } = await supabase
        .from('cms_blocks')
        .update({
          content_draft: content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', blockId);

      if (error) throw error;

      // Atualizar estado local
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId
            ? { ...block, content_draft: content, updated_at: new Date().toISOString() }
            : block
        )
      );

      // Registrar audit log
      await createAuditLog('update', 'block', blockId, 'Bloco atualizado como draft');

      toast({
        title: 'Sucesso',
        description: 'Draft salvo com sucesso',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar draft';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar bloco (draft → published)
  const publishBlock = async (blockId: number) => {
    try {
      setIsSaving(true);

      // Obter bloco com draft
      const block = blocks.find((b) => b.id === blockId);
      if (!block) throw new Error('Bloco não encontrado');

      // Usar content_draft se existir, senão usar content_published
      const contentToPublish = block.content_draft || block.content_published;
      if (!contentToPublish) {
        throw new Error('Nenhum conteúdo para publicar');
      }

      // Validar antes de publicar
      const validationErrors = validateBlockContent(block, contentToPublish);
      if (validationErrors.length > 0) {
        throw new Error(`Validação falhou: ${validationErrors.join('; ')}`);
      }

      // Salvar versão anterior se houver
      if (block.content_published && Object.keys(block.content_published).length > 0) {
        const { error: versionError } = await supabase
          .from('cms_versions')
          .insert({
            entity_type: 'block',
            entity_id: blockId,
            version_number: 1, // TODO: incrementar versão
            data_snapshot: block.content_published,
            created_by: user?.id,
          });

        if (versionError) console.warn('Erro ao salvar versão anterior:', versionError);
      }

      // Publicar draft
      const { error } = await supabase
        .from('cms_blocks')
        .update({
          content_published: contentToPublish,
          content_draft: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', blockId);

      if (error) throw error;

      // Atualizar estado local
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                content_published: b.content_draft,
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );

      // Atualizar status da página para published
      if (page) {
        const { error: pageError } = await supabase
          .from('cms_pages')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            updated_by: user?.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', page.id);

        if (pageError) console.warn('Erro ao atualizar status da página:', pageError);
        else {
          setPage((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'published',
                  published_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : null
          );
        }
      }

      // Registrar audit log
      await createAuditLog('publish', 'block', blockId, 'Bloco publicado');

      toast({
        title: 'Sucesso',
        description: 'Conteúdo publicado com sucesso',
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao publicar';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Registrar ação no audit log
  const createAuditLog = async (
    action: CmsAuditLog['action'],
    entityType: CmsAuditLog['entity_type'],
    entityId: number,
    summary?: string
  ) => {
    try {
      const { error } = await supabase.from('cms_audit_log').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action,
        entity_type: entityType,
        entity_id: entityId,
        entity_name: summary,
        details: { timestamp: new Date().toISOString() },
      });

      if (error) console.warn('Erro ao registrar audit log:', error);
    } catch (err) {
      console.warn('Erro ao criar audit log:', err);
    }
  };

  // Carregar página ao montar ou mudar slug
  useEffect(() => {
    if (pageSlug) {
      loadPage();
    }
  }, [pageSlug]);

  return {
    page,
    blocks,
    loading,
    error,
    isSaving,
    updateBlockDraft,
    publishBlock,
    validateBlockContent,
    reloadPage: loadPage,
  };
};
